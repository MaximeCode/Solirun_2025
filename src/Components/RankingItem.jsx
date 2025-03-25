import React from "react";
import PropTypes from "prop-types";

const ClasseItem = ({ rank, classe }) => {
  return (
    <div className="grid grid-cols-4 items-center border-b border-gray-700 p-3 text-lg text-white bg-gray-900 rounded-lg">
      <span className="text-4xl text-left ml-5">{rank}</span>
      <span className="text-3xl text-center">{classe.name}</span>
      <span className="text-3xl text-center">{classe.students} {classe.isTeacher ? "Profs" : "Élèves"}</span>
      <span className="text-3xl text-center">{classe.laps} Tours</span>
    </div>
  );
};

ClasseItem.propTypes = {
  rank: PropTypes.number.isRequired,
  classe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    students: PropTypes.number.isRequired,
    laps: PropTypes.number.isRequired,
    isTeacher: PropTypes.bool.isRequired,
  }).isRequired,
};

export default ClasseItem;
