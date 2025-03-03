import React from "react";

const ClasseItem = ({ rank, classe, isTopThree }) => {
  const { name, students, laps } = classe;

  // Définir les styles pour les 3 premiers
  const getRankColor = () => {
    if (rank === 1) return "bg-yellow-400 text-yellow-900"; // Or
    if (rank === 2) return "bg-gray-400 text-gray-900"; // Argent
    if (rank === 3) return "bg-yellow-600 text-yellow-50"; // Bronze
    return "bg-white text-gray-800"; // Autres
  };

  return (
      <tr className={`border-b ${isTopThree ? "text-2xl" : "text-xl"}`}>
        <td className="py-5 px-5">
          <div className={`text-center font-bold rounded-full ${getRankColor()}`}>
            {rank}
          </div>
        </td>
        <td className="text-center">{name}</td>
        <td className="text-center">{students}</td>
        <td className="text-center font-semibold">{laps}</td>
      </tr>
    );
};

export default ClasseItem;