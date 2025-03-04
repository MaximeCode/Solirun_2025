import React from "react";

const ClassCard = ({ position, name, alias, color, students, laps }) => {
  // Styles dynamiques basés sur le classement
  const positionStyles = ["text-yellow-400", "text-gray-300", "text-orange-400"];
  const icons = ["🏆", "🥈", "🥉"];
  const positionIcon = icons[position] || `#${position + 1}`;

  // Fonction pour déterminer la couleur du texte en fonction du fond (contraste)
  const getTextColor = (bgColor) => {
    // Convertit la couleur hexadécimale en RGB
    const hexToRgb = (hex) => {
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? "text-gray-900" : "text-white";
    };

    return hexToRgb(bgColor);
  };

  return (
    <div
      className={`shadow-xl rounded-xl p-10 flex flex-col justify-center items-center text-center transform hover:scale-105 transition-all h-96`}
      style={{ backgroundColor: color }}
    >
      <div className="bg-black rounded-lg h-full w-full p-6">
        {/* Icône de position */}
        <div className={`text-5xl font-bold ${positionStyles[position] || "text-gray-500"}`}>
          {positionIcon}
        </div>

        {/* Surnom de la classe */}
        <h3 className={`text-4xl font-bold mt-4 ${getTextColor(color)}`}>{alias}</h3>

        {/* Nom de la classe */}
        <p className={`italic text-4xl ${getTextColor(color)}`}>{name}</p>

        {/* Nombre d'élèves */}
        <p className={`text-4xl mt-2 font-semibold ${getTextColor(color)}`}>👨‍🎓 {students} élèves</p>

        {/* Nombre de tours */}
        <p className={`text-4xl mt-2 ${getTextColor(color)}`}>
          🏁 Tours : <span className="font-bold">{laps}</span>
        </p>
      </div>
    </div>
  );
};
  
  export default ClassCard;
  