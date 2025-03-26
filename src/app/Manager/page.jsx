"use client";

import React, { useState, useEffect } from "react";
import ClassSelector from "@/Components/ClassSelector";
import ClassManager from "@/Components/ClassManager";
import { socket } from "@/utils/socket";

function Manager() {
  const [isRunning, setIsRunning] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.emit("getIsRunning");
      socket.emit("getUnUsedClasses");

      socket.on("updateIsRunning", (response) => {
        setIsRunning(response);
      });
      socket.on("updateUnUsedClasses", (newClasses) => {
        setClasses(newClasses);
      });

      return () => {
        socket.off("updateIsRunning");
        socket.off("updateUnUsedClasses");
      };
    }
  }, []);

  useEffect(() => {
    setSelectedClass(null);
  }, [!isRunning]);

  function handleClasse(classe) {
    setSelectedClass(classe);
    socket.emit("UseClasse", classe);
  }

  return (
    <>
      <div className="fixed top-0 left-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 h-screen w-screen -z-1"></div>
      {selectedClass == null ? (
        /* Conteneur général avec transition */
        <div className="relative min-h-screen flex items-center justify-center transition-all duration-500">
          {/* Affichage des classes */}
          <div
            className={`absolute w-full transition-all duration-1000 ease-in-out ${
              isRunning
                ? "opacity-100 translate-y-0 z-1"
                : "opacity-0 translate-y-10 z-0"
            }`}>
            <ClassSelector
              classes={classes}
              isRunning={isRunning}
              handleClasse={handleClasse}
            />
          </div>

          {/* Écran d'attente */}
          <div
            className={`absolute w-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
              !isRunning
                ? "opacity-100 translate-y-0 z-1"
                : "opacity-0 -translate-y-10 z-0"
            }`}>
            {/* Icône */}
            <div className="mb-4 animate-bounce">
              <span className="text-6xl">🏁</span>
            </div>

            {/* Message principal */}
            <h2 className="text-3xl text-white font-bold">
              La course est arrêtée
            </h2>
            <p className="text-gray-400 text-center mt-2 text-lg px-3">
              En attente que les administrateurs de la course en lancent une...
            </p>
          </div>
        </div>
      ) : (
        <div>
          <ClassManager
            classe={selectedClass}
            setClasse={setSelectedClass}
          />
        </div>
      )}
    </>
  );
}

export default Manager;
