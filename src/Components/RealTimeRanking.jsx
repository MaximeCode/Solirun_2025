import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClassCard from "./RealTimeClassCard";
import { socket } from "@/utils/socket";
import Clock from "./Clock";

const ClassementReel = () => {
  const [classes, setClasses] = useState([]);
  const [sortedClasses, setSortedClasses] = useState([...classes]);

  const icons = ["🥇", "🥈", "🥉", "👏"];

  const getColumnClass = (index) => {
    const column = index % 4;
    switch (column) {
      case 0:
        return "col-start-1";
      case 1:
        return "col-start-2";
      case 2:
        return "col-start-3";
      default:
        return "col-start-4";
    }
  };

  useEffect(() => {
    // Retirer les classes prof
    const classesWithoutProf = classes.filter((classe) => !classe.isTeacher);

    // Trie les classes par nombre de tours
    const newSortedClasses = [...classesWithoutProf].sort(
      (a, b) => b.laps - a.laps
    );

    // Détecte et marque les changements de position
    const updatedSortedClasses = newSortedClasses.map((classe, index) => {
      const oldIndex = sortedClasses.findIndex((c) => c.id === classe.id);

      // Déterminer le sens et la distance du mouvement
      if (oldIndex > index) {
        // La classe monte
        classe.movementDirection = "up";
        classe.movementDistance = (oldIndex - index) * 100; // Distance de déplacement
      } else if (oldIndex < index) {
        // La classe descend
        classe.movementDirection = "down";
        classe.movementDistance = (index - oldIndex) * 100;
      } else {
        classe.movementDirection = "stable";
        classe.movementDistance = 0;
      }

      return classe;
    });

    setSortedClasses(updatedSortedClasses);
  }, [classes]);

  useEffect(() => {
    socket.emit("getClasses");
    socket.on("updateClasses", (classes) => {
      setClasses(classes);
    });

    return () => {
      socket.off("updateClasses");
    };
  }, []);

  // Fonction pour calculer la valeur de y en fonction de la direction du mouvement
  const calculateYMovement = (custom) => {
    if (custom.movementDirection === "up") {
      return custom.movementDistance;
    } else if (custom.movementDirection === "down") {
      return -custom.movementDistance;
    }
    return 0;
  };

  // Variants d'animation pour le dépassement spectaculaire
  const cardVariants = {
    initial: (custom) => ({
      opacity: 1,
      y: calculateYMovement(custom),
      zIndex: custom.movementDirection === "up" ? 0 : 50,
      scale: custom.movementDirection === "up" ? 1.05 : 1,
    }),
    animate: {
      opacity: 1,
      y: 0,
      zIndex: 0,
      scale: 1,
      transition: {
        duration: 4, // Durée de 4 secondes
        ease: "anticipate",
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <div className="text-white rounded-xl p-8 mx-auto">
        <Clock />
        <h2 className="text-5xl font-extrabold text-center mt-10 leading-tight mb-10">
          Classement de la course
        </h2>
      </div>

      <div className="relative">
        {/* Ligne d'icônes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12 mb-4">
          {icons.map((icon, index) => (
            <div
              key={icon}
              className="text-center text-8xl mb-4">
              {icon}
            </div>
          ))}
        </div>

        {/* Grille des cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-12">
          <AnimatePresence>
            {sortedClasses.map((classe, index) => (
              <motion.div
                key={classe.id}
                layout
                custom={classe}
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={cardVariants}
                className={`
                  w-full 
				  ${getColumnClass(index)}
				`}
                style={{
                  position: "relative",
                  top: `${Math.floor(index / 4) * 120}px`,
                  transition: "top 4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}>
                <ClassCard classe={classe} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ClassementReel;
