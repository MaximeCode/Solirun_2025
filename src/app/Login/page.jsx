// app/Login/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./Login.module.css";

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
			fetch("http://localhost:3030/api.php", {
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

		fetch("http://localhost:3030/api.php", {
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
		<div className={styles.loginContainer}>
			<div className={styles.loginCard}>
				<h1>Connexion</h1>
				{error && <div className={styles.errorMessage}>{error}</div>}
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="username">Nom d'utilisateur</label>
						<input
							id="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="password">Mot de passe</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className={styles.loginButton}
					>
						{loading ? "Connexion en cours..." : "Se connecter"}
					</button>
				</form>
			</div>
		</div>
	);
}
