import React, { useEffect, useState } from "react";

const Fireworks = () => {
  const [fireworks, setFireworks] = useState([]);

  useEffect(() => {
    // Générer des feux d'artifice aléatoires
    const generateFireworks = () => {
      let newFireworks = [];
      for (let i = 0; i < Math.floor(Math.random() * 1000); i++) {
        newFireworks.push({
          id: i,
          left: Math.floor(Math.random() * 1000) / 10 + "%",
          top: Math.floor(Math.random() * 1000) / 10 + "%",
          delay: Math.floor(Math.random() * 3) + "s",
        });
      }
      setFireworks(newFireworks);
    };

    generateFireworks();
    const interval = setInterval(generateFireworks, 100000); // Régénère toutes les 4s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="firework"
          style={{ left: fw.left, top: fw.top, animationDelay: fw.delay }}
        ></div>
      ))}
    </div>
  );
};

export default Fireworks;
