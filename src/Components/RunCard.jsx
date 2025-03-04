import React, { useState } from "react";

const RunCard = ({ id, time, classList, setSelectedRun, selectedRun }) => {
    const classArray = classList.split(",");

  return (
    <div 
        className={`${selectedRun == id ? "bg-gray-200" : "bg-white" } text-black shadow-lg rounded-xl p-6 mx-auto w-full max-w-md hover:cursor-pointer hover:scale-105 transition-transform duration-300`}
        onClick={() => setSelectedRun(id) && console.log(selectedRun)}
    >
      <h3 className="text-2xl font-bold text-center mb-4">Course #{id}</h3>
      <p className="text-lg text-center mb-4">⏳ Heure de départ estimée : <span className="font-semibold">{time}</span></p>
      <div className="bg-gray-100 border border-gray-200 text-black p-4 rounded-lg">
        <h4 className="text-xl font-semibold text-center mb-2">Classes participantes :</h4>
        <ul className="space-y-2">
          {classArray.map((classe, index) => (
            <li 
              key={index} 
              className="p-2 bg-gray-200 rounded-md text-center font-medium"
            >
              {classe}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RunCard;
