import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import ClassePodiumItem from "./RankingPodiumItem";
import ClasseItem from "./RankingItem";
import Clock from "./Clock";

const Classement = ({ data }) => {
  // Trier les classes par nombre de tours (décroissant)
  const sortedData = [...data].sort((a, b) => b.laps - a.laps);

  return (
    <div className="text-white p-8">
      <Clock />
      <h2 className="text-6xl font-extrabold text-center my-8">
        Classement général
      </h2>
      {sortedData.length > 0 ? (
        <>
          <div className="bg-orange-100 px-4 pb-4 rounded-lg">
            <h3 className="text-black text-4xl px-4 py-2 font-extrabold">
              Podium
            </h3>
            <div className="space-y-2">
              {sortedData.slice(0, 3).map((classe, index) => (
                <div key={classe.id}>
                  <ClassePodiumItem
                    rank={index + 1}
                    classe={classe}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-lg py-4 ">
            <div className="space-y-2">
              {sortedData.slice(3).map((classe, index) => (
                <div key={classe.id}>
                  <ClasseItem
                    rank={index + 4}
                    classe={classe}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-orange-100 px-4 pb-4 rounded-lg">
          <p className="text-black text-center text-4xl px-4 py-2 font-extrabold">
            Aucune course n'a été couru !
          </p>
        </div>
      )}
    </div>
  );
};

Classement.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      laps: PropTypes.number.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Classement;
