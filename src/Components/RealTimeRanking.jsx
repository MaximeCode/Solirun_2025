"use client";

import React, { useEffect, useState } from "react";
import ClassCard from "./RealTimeClassCard";
import { socket } from "@/utils/socket";
import Clock from "./Clock";

const ClassementReel = () => {
  const [classes, setclasses] = useState([]);
  const [sortedClasses, setSortedClasses] = useState([...classes]);

  useEffect(() => {
    // Retirer les classes prof
    const classesWithoutProf = classes.filter((classe) => !classe.isTeacher);
    // Trie les classes par nombre de tours
    const newSortedClasses = [...classesWithoutProf].sort(
      (a, b) => b.laps - a.laps
    );

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
      setclasses(classes);
    });

    return () => {
      socket.off("updateClasses");
    };
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-xl p-8 mx-auto">
        <Clock />
        <h2 className="text-4xl font-extrabold text-center mb-8 font-outline-2">
          Classement des Classes
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 mt-24">
        {sortedClasses.map((classe, index) => (
          <div
            key={classe.id}
            className={`transition-all duration-500 ${
              classe.movingUp
                ? "transform -translate-y-2 scale-105 shadow-2xl"
                : ""
            }`}>
            <ClassCard
              position={index}
              classe={classe}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ClassementReel;
