"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// Vérifier si l'utilisateur est déjà connecté au chargement de la page
	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			console.log(token);

			// Vérifier si le token est valide avant de rediriger
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					action: "verifyToken",
					token: token,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						// Token valide, rediriger vers Admin
						router.push("/");
					} else {
						// Token invalide, le supprimer
						localStorage.removeItem("token");
						localStorage.removeItem("userId");
						localStorage.removeItem("username");
					}
				})
				.catch((error) => {
					console.error("Erreur de vérification du token:", error);
					// Ne pas supprimer le token en cas d'erreur réseau
				});
		}
	}, [router]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		// Utiliser un AbortController pour définir un timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes de timeout

		fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				action: "login",
				username: username,
				password: password,
			}),
			signal: controller.signal, // Ajout du signal pour gérer le timeout
		})
			.then((response) => {
				clearTimeout(timeoutId);

				if (!response.ok) {
					throw new Error(`Erreur HTTP: ${response.status}`);
				}

				return response.json();
			})
			.then((data) => {
				console.log("Réponse API:", data);

				if (!data.success) {
					setError(data.error || "Échec de la connexion");
					setLoading(false);
					return;
				}

				// Stocker le token dans localStorage
				localStorage.setItem("token", data.token);
				localStorage.setItem("userId", data.userId);
				localStorage.setItem("username", data.username);
				Cookies.set("token", data.token, { expires: 7 });

				// Attendre un peu avant de rediriger pour s'assurer que localStorage est mis à jour
				setTimeout(() => {
					router.push("/");
				}, 100);
			})
			.catch((error) => {
				console.error("Erreur de connexion:", error);

				if (error.name === "AbortError") {
					setError(
						"La connexion au serveur a expiré. Vérifiez que votre API est en cours d'exécution."
					);
				} else {
					setError(`Erreur de connexion: ${error.message}`);
				}

				setLoading(false);
			});
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
		{/* Effet néon animé */}
		<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-3xl animate-pulse"></div>
		
		<motion.div 
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5 }}
			className="relative z-10 w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 backdrop-blur-lg bg-opacity-60">
			
			<h1 className="text-4xl font-extrabold text-center text-white neon-text">Connexion</h1>
			
			{error && (
			<div className="p-4 text-sm text-red-400 bg-red-900 bg-opacity-40 rounded-md">
				{error}
			</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6 mt-6">
			<div className="space-y-2">
				<label htmlFor="username" className="block text-sm font-medium text-gray-300">
				Nom d'utilisateur
				</label>
				<input
				id="username"
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
				className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
				/>
			</div>
			
			<div className="space-y-2">
				<label htmlFor="password" className="block text-sm font-medium text-gray-300">
				Mot de passe
				</label>
				<input
				id="password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
				/>
			</div>
			
			<button
				type="submit"
				disabled={loading}
				className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? "Connexion en cours..." : "Se connecter"}
			</button>
			</form>
		</motion.div>
		</div>
	);
}