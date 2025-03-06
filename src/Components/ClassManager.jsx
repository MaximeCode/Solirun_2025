import React, { useState, useEffect } from "react";
import { socket } from "@/utils/socket";

const ClassManager = ({ classe }) => {
    const [laps, setLaps] = useState(classe.laps || 0);

    useEffect(() => {
      socket.on("receiveClass", (response) => {
          setLaps(response.laps); // Met à jour le nombre de tours
      });
  
      return () => {
          socket.off("receiveClass"); // Nettoyage lors du démontage du composant
      };
  }, []);

    const handleTourUpdate = (id, increment) => {
      // Émettre l'événement pour mettre à jour les tours
      socket.emit("updateToursById", { id, increment });
  
      // Émettre un événement pour récupérer la classe mise à jour
      socket.emit("getClassById", id);
  };
  
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
                onClick={() => handleTourUpdate(classe.id, -1)} 
                className="bg-red-500 hover:bg-red-600 text-white w-24 h-24 text-6xl pb-4 rounded-full transition-all active:scale-90"
                >
                -
                </button>
                <button 
                onClick={() => handleTourUpdate(classe.id, 1)} 
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