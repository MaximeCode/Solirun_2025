import React from "react";
import { useState } from "react";

const ClassSelector = ({ classes, isRunning, setSelectedClass }) => {
  const [PreSelectedClass, setPreSelectedClass] = useState(null);
  
  return (
    <div className="max-w-sm mx-auto p-4">
      <h2 className="text-white text-2xl font-bold text-center mb-4">Sélectionner une classe</h2>
      <div className="grid grid-cols-2 gap-4">
        {isRunning && (
            <>
            {classes.map((classe) => (
                <button
                    key={classe.id}
                    onClick={() => setPreSelectedClass(classe)}
                    className={`p-10 text-sm rounded-lg shadow-md transition-all font-bold text-black ${
                    PreSelectedClass?.id === classe.id
                        ? "bg-orange-100 scale-105"
                        : "bg-gray-100 hover:bg-orange-100"
                    }`}
                >
                    {classe.name}
                </button>
            ))}
            </>
        )};
      </div>
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg font-bold w-full"
        onClick={() => setSelectedClass(PreSelectedClass)}
        >
        Séléctionner
      </button>
    </div>
  );
};

export default ClassSelector;
