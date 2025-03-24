import React from "react";
import PropTypes from "prop-types";

const ClassePodiumItem = ({ rank, classe }) => {
  const colors = ["bg-yellow-400", "bg-gray-300", "bg-orange-400"];
  return (
    <div
      className={`grid grid-cols-4 items-center ${
        colors[rank - 1]
      } p-3 rounded-lg font-bold text-black`}>
      <span className="text-4xl text-left">
        {rank} {rank === 1 ? "er" : "ème"}
      </span>
      <span className="text-3xl text-center">{classe.name}</span>
      <span className="text-3xl text-center">{classe.students} élèves</span>
      <span className="text-3xl text-center">{classe.laps} Tours</span>
    </div>
  );
};

ClassePodiumItem.propTypes = {
  rank: PropTypes.number.isRequired,
  classe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    students: PropTypes.number.isRequired,
    laps: PropTypes.number.isRequired,
  }).isRequired,
};

export default ClassePodiumItem;
