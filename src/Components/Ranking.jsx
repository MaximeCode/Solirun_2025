import React from "react";
import ClasseHeader from "./RankingHeader";
import ClasseItem from "./RankingItem";
import Clock from './Clock';

const Classement = ({ data }) => {
  // Trier les données par le nombre de tours (décroissant)
  const sortedData = [...data].sort((a, b) => b.laps - a.laps);

  console.log(sortedData);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-xl p-8 mx-auto">
      <Clock />
      <h2 className="text-4xl font-extrabold text-center mb-8 font-outline-2">
        Classement des Classes
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse">
          <ClasseHeader />
          <tbody className="">
            {sortedData.map((classe, index) => (
              <ClasseItem
                key={index}
                rank={index + 1}
                classe={classe}
                isTopThree={index < 3} // Ajouter une logique pour les couleurs or, argent, bronze
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classement;