import React from "react";

const ClasseHeader = () => {
  return (
    <thead className="bg-blue-800 text-white uppercase rounded-lg">
      <tr>
        <th className="px-6 py-4 text-center text-xl font-outline-1">Position</th>
        <th className="px-6 py-4 text-center text-xl font-outline-1">Nom de la Classe</th>
        <th className="px-6 py-4 text-center text-xl font-outline-1">Nombre d'Étudiants</th>
        <th className="px-6 py-4 text-center text-xl font-outline-1">Nombre de Tours</th>
      </tr>
    </thead>
  );
};

export default ClasseHeader;