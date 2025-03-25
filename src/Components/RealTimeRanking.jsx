import React, { useEffect, useState } from "react";
import ClassCard from "./RealTimeClassCard";
import { socket } from "@/utils/socket";
import Clock from "./Clock";

const ClassementReel = () => {
	const [classes, setClasses] = useState([]);
	const [sortedClasses, setSortedClasses] = useState([...classes]);

	useEffect(() => {
		// Retirer les classes prof
		const classesWithoutProf = classes.filter((classe) => !classe.isTeacher);
		// Trie les classes par nombre de tours
		const newSortedClasses = [...classesWithoutProf].sort(
			(a, b) => b.laps - a.laps
		);

		// Ajoute une animation si la position change
		newSortedClasses.forEach((classe, index) => {
			const oldIndex = sortedClasses.findIndex((c) => c.id === classe.id);
			classe.movingUp = oldIndex > index; // Détecte si la classe monte
		});

		setSortedClasses(newSortedClasses);
	}, [classes]);

	useEffect(() => {
		socket.emit("getClasses");
		// Écouter les mises à jour de isRunning
		socket.on("updateClasses", (classes) => {
			setClasses(classes);
		});

		return () => {
			socket.off("updateClasses");
		};
	}, []);

  // Styles dynamiques basés sur le classement
	const positionStyles = [
		"text-yellow-400", // 1ère position
		"text-gray-300", // 2ème position
		"text-orange-400", // 3ème position
	];
	const icons = ["🏆", "🥈", "🥉", "😭"];
	return (
		<>
			<div className="text-white rounded-xl p-8 mx-auto">
				<Clock />
				<h2 className="text-5xl font-extrabold text-center mt-10 leading-tight mb-10">
					Classement de la course
				</h2>
			</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 items-center h-auto">
        {icons.map((icon, index) => (
          <div className="text-center mb-18 text-8xl ">{icon}</div>
        ))}
      </div>

			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 items-center h-auto">
				{sortedClasses.map((classe, index) => (
					<>
						<div
							key={classe.id}
							className={`transition-all duration-500 ease-in-out ${
								classe.movingUp
									? "transform -translate-y-3 scale-105 shadow-2xl"
									: ""
							}`}
						>
							<ClassCard
								position={index}
								classe={classe}
							/>
						</div>
					</>
				))}
			</div>
		</>
	);
};

export default ClassementReel;
