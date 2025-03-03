'use client'

import React, { useState, useEffect } from 'react';
import { socket } from '@/utils/socket';

function AdminPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    socket.on("updateIsRunning", setIsRunning);
    socket.on("updateClasses", (newClasses) => {
      console.log("Classes reçues:", newClasses); // Ajoute ce log pour voir ce qui est reçu
      setClasses(newClasses);
    });
  

    return () => {
      socket.off("updateIsRunning");
      socket.off("updateClasses");
    };
  }, []);

  const toggleIsRunning = () => {
    socket.emit("toggleIsRunning");
  };

  const updateTours = (classKey, increment) => {
    socket.emit("updateTours", { classKey, increment });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Panneau d'Administration</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {isRunning ? 'Course en cours' : 'Course arrêtée'}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">Contrôle de course</h3>
          <p className="text-sm text-gray-600 mb-4">
            Démarrez ou arrêtez la course actuelle. Ce changement sera reflété en temps réel pour tous les utilisateurs.
          </p>
          <button 
            onClick={toggleIsRunning}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' 
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
            }`}
          >
            {isRunning ? 'Arrêter la Course' : 'Démarrer la Course'}
          </button>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-700 mb-2">Statut du Serveur</h3>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Connecté au serveur WebSocket</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200">
          Actualiser les données
        </button>
      </div>
      {isRunning && (
        <>
          <div className="mt-8">
            <h2>Course en cours</h2>
            <p>Les données de course sont mises à jour en temps réel.</p>
          </div>
          <h2>Gestion des Classes</h2>
          {console.log(classes)}
          {classes.map((classe, index) => (
            <div index={index}>
              <h3>{classe.name} - Tours : {classe.laps}</h3>
              <button onClick={() => updateTours(index, 1)}>+1 Tour</button>
              <button onClick={() => updateTours(index, -1)}>-1 Tour</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default AdminPanel;