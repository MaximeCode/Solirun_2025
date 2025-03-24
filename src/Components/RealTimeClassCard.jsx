import React from "react";
import PropTypes from "prop-types";

const ClassCard = ({ position, name, alias, color, students, laps }) => {
	// Styles dynamiques basés sur le classement
	const positionStyles = [
		"text-yellow-400", // 1ère position
		"text-gray-300", // 2ème position
		"text-orange-400", // 3ème position
	];
	const icons = ["🏆", "🥈", "🥉"];
	const positionIcon = icons[position] || `#${position + 1}`;

	// Fonction pour déterminer la couleur du texte en fonction du fond (contraste)
	const getTextColor = (bgColor) => {
		// Convertit la couleur hexadécimale en RGB
		const hexToRgb = (hex) => {
			let r = parseInt(hex.substring(1, 3), 16);
			let g = parseInt(hex.substring(3, 5), 16);
			let b = parseInt(hex.substring(5, 7), 16);
			return r * 0.299 + g * 0.587 + b * 0.114 > 186
				? "text-gray-900"
				: "text-white";
		};

		return hexToRgb(bgColor);
	};

	// Appliquer une couleur spécifique pour chaque classe
	const classColors = [
		"#F4C542", // Jaune
		"#F44336", // Rouge
		"#2196F3", // Bleu
		"#4CAF50" // Vert
	];

	// Sélectionne la couleur en fonction de l'alias ou du nom de la classe
	const classColor = classColors[position] || "#FFFFFF"; // Default to white if color is not found

	return (
		<div
			className={`shadow-xl rounded-xl p-10 flex flex-col justify-center items-center text-center transform hover:scale-105 transition-all h-96`}
			style={{ backgroundColor: classColor }}
		>
			<div className="bg-black rounded-lg h-full w-full p-6">
				{/* Icône de position */}
				<div
					className={`text-5xl font-bold ${
						positionStyles[position] || "text-gray-500"
					}`}
				>
					{positionIcon}
				</div>

				{/* Surnom de la classe */}
				<h3
					className={`text-4xl text-white font-bold mt-4 ${getTextColor(
						classColor
					)}`}
				>
					{alias}
				</h3>

				{/* Nom de la classe */}
				<p className={`italic text-white text-4xl ${getTextColor(classColor)}`}>
					{name}
				</p>

				{/* Nombre d'élèves */}
				<p
					className={`text-4xl text-white mt-2 font-semibold ${getTextColor(
						classColor
					)}`}
				>
					👨‍🎓 {students} élèves
				</p>

				{/* Nombre de tours */}
				<p className={`text-4xl text-white mt-2 ${getTextColor(classColor)}`}>
					🏁 Tours : <span className="font-bold">{laps}</span>
				</p>
			</div>
		</div>
	);
};

// Define PropTypes for the component
ClassCard.propTypes = {
	position: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	alias: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired, // La couleur ici fait référence à "yellow", "red", "blue", "green"
	students: PropTypes.number.isRequired,
	laps: PropTypes.number.isRequired,
};

export default ClassCard;
