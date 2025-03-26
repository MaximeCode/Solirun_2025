const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();

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
