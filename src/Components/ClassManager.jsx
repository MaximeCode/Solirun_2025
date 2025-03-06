import React, { useState } from "react";

const ClassManager = ({ classe }) => {
    const [laps, setLaps] = useState(classe.laps);

  return (
    <div className="flex items-center justify-center h-screen">
        <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg w-80 text-center border border-gray-700">
            {/* Nom et surnom */}
            <h2 className="text-2xl font-bold">{classe.alias}</h2>
            <p className="text-gray-400 text-lg italic">{classe.name}</p>

            {/* Nombre d'élèves */}
            <div className="mt-4 text-4xl font-bold text-green-400">{classe.students} élèves</div>

            <div className="mt-4 text-4xl font-bold text-green-400">Tours : {laps} </div>

            {/* Boutons */}
            <div className="flex justify-center gap-4 mt-4">
                <button 
                onClick={() => setLaps(laps - 1)} 
                className="bg-red-500 hover:bg-red-600 text-white w-24 h-24 text-6xl pb-4 rounded-full transition-all active:scale-90"
                >
                -
                </button>
                <button 
                onClick={() => setLaps(laps + 1)} 
                className="bg-green-500 hover:bg-green-600 text-white w-24 h-24 text-6xl pb-4 rounded-full transition-all active:scale-90"
                >
                +
                </button>
            </div>
        </div>
    </div>
  );
};

export default ClassManager;
