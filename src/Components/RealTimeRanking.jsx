import React, { useEffect, useState } from "react";
import ClassCard from "./RealTimeClassCard";
import { socket } from "@/utils/socket";
import Clock from "./Clock";

const ClassementReel = () => {
  const [classes, setClasses] = useState([]);
  const [sortedClasses, setSortedClasses] = useState([...classes]);

  useEffect(() => {
    // Trie les classes par nombre de tours
    const newSortedClasses = [...classes].sort((a, b) => b.laps - a.laps);

    // Ajoute une animation si la position change
    newSortedClasses.forEach((classe, index) => {
      const oldIndex = sortedClasses.findIndex((c) => c.id === classe.id);
      classe.movingUp = oldIndex > index; // Détecte si la classe monte
    });

    setSortedClasses(newSortedClasses);
  }, [classes]);

  useEffect(() => {
    socket.emit("getClasses");
    // Écouter les mises à jour de isRunning
    socket.on("updateClasses", (classes) => {
      setClasses(classes);
    });

    return () => {
      socket.off("updateClasses");
    };
  }, []);

  return (
    <>
      <div className="text-white rounded-xl p-8 mx-auto">
        <Clock />
        <h2 className="text-5xl font-extrabold text-center mt-10 leading-tight mb-34">
          Classement des Classes
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 items-center h-auto">
        {sortedClasses.map((classe, index) => (
          <div
            key={classe.id}
            className={`transition-all duration-500 ease-in-out ${
              classe.movingUp ? "transform -translate-y-3 scale-105 shadow-2xl" : ""
            }`}
          >
            <ClassCard
              position={index}
              id={classe.id}
              name={classe.name}
              alias={classe.alias}
              color={classe.color}
              students={classe.students}
              laps={classe.laps}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ClassementReel;