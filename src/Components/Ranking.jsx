import React, { useEffect, useRef } from "react";
import ClassePodiumItem from "./RankingPodiumItem";
import ClasseItem from "./RankingItem";
import Clock from "./Clock";

const SCROLL_DELAY = 3000; // Pause avant de repartir en haut (2s)
const SCROLL_SPEED = 2; // Vitesse du scroll (px par intervalle)
const SCROLL_INTERVAL = 50; // Fréquence du scroll (ms)

const Classement = ({ data }) => {
	const sortedData = [...data].sort((a, b) => b.laps - a.laps);
	const podium = sortedData.slice(0, 3);
	const scrollContainerRef = useRef(null);

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		let scrollInterval;
		let timeout;

		const startScrolling = () => {
			scrollInterval = setInterval(() => {
				if (
					container.scrollTop + container.clientHeight >=
					container.scrollHeight
				) {
					// Fin du scroll, pause et retour en haut
					timeout = setTimeout(() => {
						container.scrollBy({ top: -SCROLL_SPEED, behavior: "smooth" });
						setTimeout(startScrolling, SCROLL_DELAY); // Redémarre le scroll après 3s
					}, SCROLL_DELAY);
				} else {
					container.scrollBy({ top: SCROLL_SPEED, behavior: "smooth" });
				}
			}, SCROLL_INTERVAL);
		};

		startScrolling();

		return () => {
			clearInterval(scrollInterval);
			clearTimeout(timeout);
		};
	}, [sortedData.length]);

	return (
		<div className="h-max w-full text-white shadow-lg rounded-xl p-8 mx-auto flex flex-col">
			<Clock />
			<h2 className="text-6xl font-extrabold text-center mb-8">
				Classement général
			</h2>

			{sortedData.length > 0 ? (
				<>
					{/* Podium */}
					<div className="bg-orange-100 px-4 pb-4 rounded-lg">
						<h3 className="text-black font-bold text-4xl px-4 py-2">Podium</h3>
						<div className="space-y-2">
							{podium.map((classe, idx) => (
								<ClassePodiumItem
									key={classe.id}
									rank={idx + 1}
									classe={classe}
								/>
							))}
						</div>
					</div>

					{/* Classement défilant */}
					<div
						ref={scrollContainerRef}
						className="mt-6 bg-orange-100 rounded-lg p-4 overflow-y-auto"
						style={{ maxHeight: "calc(100vh - 300px)" }} // Ajuste dynamiquement
					>
						<div className="space-y-2">
							{sortedData.slice(3).map((classe, idx) => (
								<ClasseItem
									key={classe.id}
									rank={idx + 4}
									classe={classe}
								/>
							))}
						</div>
					</div>
				</>
			) : (
				<div className="bg-orange-100 px-4 pb-4 rounded-lg">
					<p className="text-black text-center font-bold text-4xl px-4 py-2">
						Aucune course n'a été courue !
					</p>
				</div>
			)}
		</div>
	);
};

export default Classement;
