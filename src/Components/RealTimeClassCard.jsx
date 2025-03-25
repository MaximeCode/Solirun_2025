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

	// Sélectionne la couleur en fonction de l'alias ou du nom de la classe
	const classColor = color || "#FFFFFF"; // Default to white if color is not found

	return (
		<div
			className={`
				relative 
				shadow-xl 
				rounded-xl 
				p-3 
				text-center 
				transform 
				transition-all 
				h-96 
				overflow-hidden
				[animation:neon-pulse_2s_ease-in-out_infinite]
				[@keyframes_neon-pulse]:from{opacity:0.7}
				[@keyframes_neon-pulse]:to{opacity:0.5}
			`}
			style={{
				"--neon-color": color,
				boxShadow: `
					0 0 10px 3px ${color}, 
					0 0 20px 6px ${color}, 
					0 0 30px 9px ${color}
				`,
				backgroundColor: color,
			}}
		>
			{/* Neon border effect */}
			<div
				className="
					absolute 
					inset-0 
					rounded-xl 
					pointer-events-none
					z-[1]
				"
				style={{
					boxShadow: `
						0 0 10px 3px ${color}, 
						0 0 20px 6px ${color}, 
						0 0 30px 9px ${color}
					`,
					opacity: 0.7,
				}}
			></div>

			{/* Background blur effect */}
			<div
				className="absolute inset-0 -z-1 opacity-10 blur-xl animate-pulse"
				style={{ backgroundColor: color }}
			></div>

			{/* Card content */}
			<div
				className="
					bg-black 
					flex 
					flex-col 
					justify-center 
					space-y-3 
					rounded-lg 
					h-full 
					w-full 
					p-6 
					relative 
					z-10
				"
				style={{ borderColor: color }}
			>
				{/* Position Icon */}
				<div
					className={`text-5xl font-bold ${
						positionStyles[position] || "text-gray-500"
					}`}
				>
					{positionIcon}
				</div>

				{/* Class Nickname */}
				<h3
					className={`text-4xl text-white font-bold mt-4 ${getTextColor(
						classColor
					)}`}
				>
					{alias}
				</h3>

				{/* Class Name */}
				<p className={`italic text-white text-4xl ${getTextColor(classColor)}`}>
					{name}
				</p>

				{/* Number of Students */}
				<p
					className={`text-4xl text-white mt-2 font-semibold ${getTextColor(
						classColor
					)}`}
				>
					👨‍🎓 {students} élèves
				</p>

				{/* Number of Laps */}
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
