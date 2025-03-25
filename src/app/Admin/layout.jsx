// app/Admin/layout.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";
import PropTypes from "prop-types";

export default function AdminLayout({ children }) {
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = localStorage.getItem("token");
				console.log(token);

				if (!token) {
					// Pas de token, rediriger vers la page de connexion
					router.push("/Login");
					return;
				}

				// Ajouter un AbortController pour ne pas attendre indéfiniment
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 8000);

				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						action: "verifyToken",
						token: token,
					}),
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					throw new Error(`Erreur HTTP: ${response.status}`);
				}

				const data = await response.json();
				console.log("Vérification auth:", data);

				if (data.success) {
					setAuthenticated(true);
				} else {
					// Token invalide, supprimer et rediriger
					localStorage.removeItem("token");
					localStorage.removeItem("userId");
					localStorage.removeItem("username");
					router.push("/Login");
				}
			} catch (error) {
				console.error("Erreur de vérification d'authentification:", error);

				if (error.name === "AbortError") {
					console.log("Timeout de la requête d'authentification");
				}

				// En cas d'erreur, on redirige vers la page de connexion
				// mais on attend un peu pour éviter une boucle infinie si l'API est down
				router.push("/Login");
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, [router]);

	// Pendant le chargement, afficher un indicateur
	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					flexDirection: "column",
				}}
			>
				<h2>Vérification de l'authentification...</h2>
				<div
					style={{
						width: "50px",
						height: "50px",
						border: "5px solid #f3f3f3",
						borderTop: "5px solid #3498db",
						borderRadius: "50%",
						animation: "spin 1s linear infinite",
						marginTop: "20px",
					}}
				></div>
				<style jsx>{`
					@keyframes spin {
						0% {
							transform: rotate(0deg);
						}
						100% {
							transform: rotate(360deg);
						}
					}
				`}</style>
			</div>
		);
	}

	// Si authentifié, afficher le contenu, sinon rien (la redirection est gérée dans useEffect)
	return authenticated ? (
		<div className="min-h-screen bg-gray-100">
			<Header />

			<main className="container mx-auto px-4 py-8">{children}</main>
		</div>
	) : null;
}

AdminLayout.propTypes = {
	children: PropTypes.node.isRequired,
  };