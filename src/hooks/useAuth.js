import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = () => {
			const token = localStorage.getItem("token");

			if (!token) {
				setLoading(false);
				return;
			}

			console.log("Token envoyé:", token);

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
				.then((response) => {
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
					return response.json();
				})
				.then((data) => {
					console.log("Réponse API :", data);

					if (data.success) {
						setUser({
							id: data.userId,
							username: data.username,
						});

						console.log("Utilisateur authentifié :", {
							id: data.userId,
							username: data.username,
						});
					} else {
						console.warn("Token invalide, suppression du token...");
						localStorage.removeItem("token");
						setUser(null);
					}
				})
				.catch((error) => {
					console.error("Erreur lors de la requête API :", error);
					localStorage.removeItem("token");
					setUser(null);
				})
				.finally(() => {
					setLoading(false);
				});
		};

		checkAuth();
	}, []);

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		router.push("/Login");
	};

	return { user, loading, logout };
}
