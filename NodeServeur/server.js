const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();

const dotenv = require("dotenv");
dotenv.config({ path: "../.env.local" }); // Chargement des variables d'environnement depuis le fichier .env

const io = new Server(server, {
	cors: {
		origin: "*",  // Permet toutes les origines
		methods: ["GET", "POST"],
	},
});

let isRunning = false;
let classes = [];
let unUsedClasses = [];
let usedClasses = new Map(); // Utilisation d’un Map() pour éviter les conflits

const classColors = [
	"#ffab18", // Jaune
	"#F44336", // Rouge
	"#2196F3", // Bleu
	"#4CAF50" // Vert
];

const updateAllClients = () => {
	io.emit("updateClasses", classes);
	io.emit("updateUnUsedClasses", unUsedClasses);
};

io.on("connection", (socket) => {
	console.log("Nouvelle connexion :", socket.id);

	// Envoi des données actuelles au client qui se connecte
	socket.emit("updateIsRunning", isRunning);
	socket.emit("updateClasses", classes);
	socket.emit("updateUnUsedClasses", unUsedClasses);

	socket.on("getIsRunning", () => {
		socket.emit("updateIsRunning", isRunning);
	});

	socket.on("getClasses", () => {
		socket.emit("updateClasses", classes);
	});

	socket.on("getUnUsedClasses", () => {
		socket.emit("updateUnUsedClasses", unUsedClasses);
	});

	socket.on("toggleIsRunning", async () => {
		isRunning = !isRunning;
		console.log("isRunning:", isRunning);
		io.emit("updateIsRunning", isRunning);

		await new Promise((resolve) => setTimeout(resolve, 10));
		updateAllClients();
	});

	socket.on("setClasses", (newClasses) => {
		for (let i = 0; i < newClasses.length; i++) {
			newClasses[i].color = classColors[i];
		}
		classes = [...newClasses]; // Immutabilité
		unUsedClasses = [...newClasses]; // Immutabilité
		console.log("Running Classes :", classes);
		updateAllClients();
	});

	socket.on("updateToursById", ({ id, increment }) => {
		const requestedClass = classes.find((cls) => cls.id === id);
		if (requestedClass) {
			requestedClass.laps = Math.max(0, requestedClass.laps + (increment > 0 ? 1 : -1));
			console.log("classes:", requestedClass.name, "prend :", (increment > 0 ? 1 : -1));
			updateAllClients();
		}
	});

	socket.on("getClassById", (id) => {
		const requestedClass = classes.find((cls) => cls.id === id);
		socket.emit("receiveClass", requestedClass);
	});

	socket.on("UseClasse", (classe) => {
		console.log("Use Classes :", classe);
		usedClasses.set(socket.id, classe.id);
		unUsedClasses = unUsedClasses.filter((cls) => cls.id !== classe.id);
		console.log("UnUsed Classes :", unUsedClasses);
		updateAllClients();
	});

	socket.on("UnUseClasse", (classe) => {
		const foundClass = classes.find((cls) => cls.id === classe.id);
		if (foundClass) {
			unUsedClasses.push(foundClass);
			console.log("UnUsed Classes :", unUsedClasses);
			updateAllClients();
		}
	});

	// 🔥 VERSION OPTIMISÉE - Gestion des messages de tchat
	socket.on("newTchat", async (userId, message) => {
		console.log("Nouveau message de l'utilisateur", userId, ":", message);

		try {
			// 1. Sauvegarder le message en base de données
			const response = await fetch(`http://localhost:3030/api.php`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					action: "AddNewTchat",
					idAuteur: userId,
					msg: message,
				}),
			});

			console.log("Réponse de l'API pour la sauvegarde du message :", response);

			if (!response.ok) {
				throw new Error(`Erreur API: ${response.status}`);
			}

			const result = response;

			if (result.ok) {
				// 2. Récupérer le message en bdd avce  toutes ces infos
				const newMsgResponse = await fetch(`http://localhost:3030/api.php`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						action: "getUserById",
						userId: userId,
					}),
				});

				if (newMsgResponse.ok) {
					const userData = await newMsgResponse.json();
					console.log("Données utilisateur récupérées :", userData);

					// 3. Créer l'objet message complet
					const newMessage = {
						id: Date.now(),
						msg: message,
						username: userData.username,
						idAuteur: userId
					};

					// 4. Diffuser SEULEMENT le nouveau message à tous les clients
					io.emit("newTchatMessage", newMessage);
					console.log("Message diffusé :", newMessage);
				} else {
					console.error("Erreur lors de la récupération des données utilisateur");
				}
			} else {
				console.error("Erreur lors de la sauvegarde du message:", result.error);
			}

		} catch (error) {
			console.error("Erreur lors de la gestion du message :", error);

			// En cas d'erreur, on peut quand même essayer de diffuser le message
			// avec les informations disponibles
			const fallbackMessage = {
				id: Date.now(),
				msg: message,
				username: `User-${userId}`, // Nom de fallback
				idAuteur: userId
			};

			io.emit("newTchatMessage", fallbackMessage);
		}
	});

	// 🆕 Événement pour récupérer l'historique des messages
	socket.on("getMsgs", async () => {
		try {
			const response = await fetch(`http://localhost:3030/api.php?action=getTchat`);
			if (response.ok) {
				const messages = await response.json();
				socket.emit("updateMsgs", messages);
				// console.log("Messages récupérés et envoyés au client :", messages);
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des messages :", error);
		}
	});

	// ❌ Message non autorisé par le modérateur
	socket.on("msgDeletedByModerateur", async (msgId, moderateurId) => {
		if (!msgId || !moderateurId) {
			console.error("ID de message ou ID de modérateur manquant");
			return;
		}
		try {
			console.log(`Suppression du message ${msgId} par le modérateur ${moderateurId}`);
			const response = await fetch(`http://localhost:3030/api.php`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					action: "msgNotAllowed",
					msgId: msgId,
					moderateurId: moderateurId,
				}),
			});

			if (response.ok) {
				console.log("Message supprimé avec succès :", msgId);
				io.emit("msgDeleted", msgId); // Diffuser l'événement de suppression
			} else {
				console.error("Erreur lors de la suppression du message :", response.statusText);
			}
		} catch (error) {
			console.error("Erreur lors de la suppression du message :", error);
		}
	});

	socket.on("disconnect", () => {
		console.log(`Client ${socket.id} déconnecté`);

		if (usedClasses.has(socket.id)) {
			const classId = usedClasses.get(socket.id);
			const releasedClass = classes.find((cls) => cls.id === classId);
			if (releasedClass) {
				unUsedClasses.push(releasedClass);
				console.log(`Classe ${classId} libérée par ${socket.id}`);
			}
			usedClasses.delete(socket.id);
		}

		updateAllClients();
	});
});

server.listen(5000, () => {
	console.log("Serveur WebSocket en écoute sur http://localhost:5000");
});
