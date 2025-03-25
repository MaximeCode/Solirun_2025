import React, { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Met à jour l'heure toutes les secondes
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Nettoie l'intervalle lorsque le composant est démonté
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="relative bg-black px-6 py-3 rounded-xl shadow-lg shadow-fuchsia-500/50 border border-purple-500">
        {/* Effet lumineux derrière */}
        <div className="absolute inset-0 bg-fuchsia-300 opacity-1 blur-xl animate-pulse"></div>

        {/* Texte de l'heure */}
        <h2 className="relative text-4xl font-mono text-gray-300 font-bold tracking-widest">
          {time.toLocaleTimeString()}
        </h2>
      </div>
    </div>
  );
};

export default Clock;