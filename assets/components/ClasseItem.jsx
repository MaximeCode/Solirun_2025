import React from "react";

const ClasseItem = ({ rank, classe, isTopThree }) => {
  const { nom, etudiants, tours } = classe;

  // Définir les styles pour les 3 premiers
  const getRankColor = () => {
    if (rank === 1) return "bg-yellow-400 text-yellow-900"; // Or
    if (rank === 2) return "bg-gray-300 text-gray-900"; // Argent
    if (rank === 3) return "bg-yellow-600 text-yellow-50"; // Bronze
    return "bg-white text-gray-800"; // Autres
  };

  return (
    <tr className={`border-b hover:bg-blue-200 ${isTopThree ? "text-2xl" : "text-xl"}`}>
      <td
        className={`px-6 py-4 text-center font-bold rounded-full ${getRankColor()}`}
      >
        {rank}
      </td>
      <td className="px-6 py-4">{nom}</td>
      <td className="px-6 py-4 text-center">{etudiants}</td>
      <td className="px-6 py-4 text-center font-semibold">{tours}</td>
    </tr>
  );
};

export default ClasseItem;
