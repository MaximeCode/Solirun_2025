import React from "react";
import PropTypes from "prop-types";

const ClassCard = ({ classe }) => {
	const color = classe.color;

	// Fonction pour déterminer la couleur du texte en fonction du fond (contraste)
	const getTextColor = (bgColor) => {
		// Convertit la couleur hexadécimale en RGB
		const hexToRgb = (hex) => {
			let r = parseInt(hex.substring(1, 3), 16);
			let g = parseInt(hex.substring(3, 5), 16);
			let b = parseInt(hex.substring(5, 7), 16);
			return r * 0.299 + g * 0.587 + b * 0.114 > 186
				? "text-gray-900"
				: "text-black";
		};

		return hexToRgb(bgColor);
	};

	const getBorderColor = (borderColor) => {
		// Supprimer le # si présent
		borderColor = borderColor.replace('#', '');
	
		// Convertir la couleur hexadécimale en valeurs RGB
		const r = parseInt(borderColor.substr(0, 2), 16);
		const g = parseInt(borderColor.substr(2, 2), 16);
		const b = parseInt(borderColor.substr(4, 2), 16);
	
		// Réduire la luminosité de 20%
		const factor = 0.8;
		const darkerR = Math.max(0, Math.round(r * factor));
		const darkerG = Math.max(0, Math.round(g * factor));
		const darkerB = Math.max(0, Math.round(b * factor));
	
		// Convertir en couleur hexadécimale
		return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
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
				style={{ backgroundColor: classe.color }}
			></div>

			{/* Card content */}
			<div
				className="
				  bg-white
					flex 
					flex-col 
					justify-center 
					space-y-10 
					rounded-lg 
					h-full 
					w-full 
					p-6 
					relative 
					z-10
					border-1
				"
				style={{ borderColor: getBorderColor(classe.color) }}
			>

				{/* Nom de la classe */}
				<p
					className={`italic text-black text-5xl font-extrabold ${getTextColor(
						classe.color
					)}`}
				>
					{classe.name}
				</p>

				{/* Nombre d'élèves */}
				<p
					className={`text-4xl text-black mt-2 font-bold ${getTextColor(
						classe.color
					)}`}
				>
					👨‍🎓 {classe.students} {classe.isTeacher ? "Profs" : "Élèves"}
				</p>

				{/* Nombre de tours */}
				<p className={`text-4xl text-black mt-2 font-bold ${getTextColor(classe.color)}`}>
					🏁 Tours : <span className="">{classe.laps}</span>
				</p>
			</div>
		</div>
	);
};

// Define PropTypes for the component
ClassCard.propTypes = {
	position: PropTypes.number.isRequired,
	classe: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		alias: PropTypes.string.isRequired,
		students: PropTypes.number.isRequired,
		laps: PropTypes.number.isRequired,
		color: PropTypes.string.isRequired,
		isTeacher: PropTypes.bool.isRequired,
	}),
};

export default ClassCard;
