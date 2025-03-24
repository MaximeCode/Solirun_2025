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
    <div className="text-center text-2xl font-bold font-outline-1">
      <h2>Temps réel : {time.toLocaleTimeString()}</h2>
    </div>
  );
};

export default Clock;
