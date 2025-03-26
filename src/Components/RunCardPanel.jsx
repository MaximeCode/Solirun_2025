import React from "react";
import PropTypes from "prop-types";

const RunCard = ({ id, time, classList, setSelectedRun, selectedRun }) => {
  const classArray = classList.split(",");

  return (
    <button
      className={`${
        selectedRun == id ? "bg-gray-200" : "bg-white"
      } text-black shadow-lg rounded-xl p-6 mx-auto w-full max-w-md hover:cursor-pointer hover:scale-105 transition-transform duration-300 text-left border-none`}
      onClick={() => setSelectedRun(id)}
      aria-pressed={selectedRun === id}>
      <h3 className="text-2xl font-bold text-center mb-4">Course #{id}</h3>
      <p className="text-lg text-center mb-4">
        ⏳ Heure de départ estimée :{" "}
        <span className="font-semibold">{time}</span>
      </p>
      <div className="bg-gray-100 border border-gray-200 text-black p-4 rounded-lg">
        <h4 className="text-xl font-semibold text-center mb-2">
          Classes participantes :
        </h4>
        <ul className="space-y-2">
          {classArray.map((classe) => (
            <li
              key={`${id}-${classe}`}
              className="p-2 bg-gray-200 rounded-md text-center font-medium">
              {classe}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
};
RunCard.propTypes = {
  id: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
  classList: PropTypes.string.isRequired,
  setSelectedRun: PropTypes.func.isRequired,
  selectedRun: PropTypes.number,
};

export default RunCard;
