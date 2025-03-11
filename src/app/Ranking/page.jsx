"use client";

import React, { useEffect, useState } from "react";
import Classement from "@/Components/Ranking";
import ClassementReel from "@/Components/RealTimeRanking";
import { socket } from "@/utils/socket";

function App() {
	const [classesData, setClassesData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			fetch("http://localhost:3030/api.php?action=Ranking")
				.then((response) => {
					if (!response.ok) {
						throw new Error("Erreur lors de la récupération des données");
					}
					return response.json();
				})
				.then((data) => {
					setClassesData(data);
					setLoading(false);
				})
				.catch((err) => {
					setError(err.message);
					setLoading(false);
				});
		}, 50);
	}, [isRunning]);

	useEffect(() => {
		// Écouter les mises à jour de isRunning
		socket.on("updateIsRunning", (state) => {
			setIsRunning(state);
		});

		return () => {
			socket.off("updateIsRunning");
		};
	}, []);

	return (
		<>
			<div className="fixed top-0 left-0 bg-gradient-to-br from-gray-900 via-gray-750 to-gray-900 h-screen w-screen -z-1"></div>
			<div>
				<div className="px-16 py-16">
					{!isRunning ? (
						<>
							{loading && (
								<p className="text-white">Chargement des données...</p>
							)}
							{error && <p className="text-red-500">Erreur : {error}</p>}
							{!loading && !error && <Classement data={classesData} />}
						</>
					) : (
						<>
							<ClassementReel />
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
