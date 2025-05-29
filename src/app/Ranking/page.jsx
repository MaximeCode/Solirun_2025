"use client";

import React, { useEffect, useState } from "react";
import Classement from "@/Components/Ranking";
import ClassementReel from "@/Components/RealTimeRanking";
import { socket } from "@/utils/socket";

import ChatForm from "@/Components/ChatForm";
import Tchat from "@/Components/Tchat";

function App() {
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php?action=Ranking`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
          }
          return response.json();
        })
        .then((data) => {
          setClassesData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, 50);
  }, [isRunning]);

  useEffect(() => {
    socket.emit("getIsRunning");
    socket.on("updateIsRunning", (state) => {
      setIsRunning(state);
    });

    // Tchat
    socket.emit("getMsgs");
    socket.on("updateMsgs", (msgs) => {
      console.log("Messages reçus :", msgs);
    });

    return () => {
      socket.off("updateIsRunning");
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-black to-gray-900 opacity-60 blur-2xl animate-pulse"></div>

      <div className="relative z-10 w-full p-1">
        {!isRunning ? (
          <>
            {loading && (
              <p className="text-white text-center text-xl animate-pulse">
                Chargement des données...
              </p>
            )}
            {error && (
              <p className="text-red-500 text-center">Erreur : {error}</p>
            )}
            {!loading && !error && (
              <div className="p-6 bg-gradient-to-br from-purple-700 via-black to-purple-700 bg-opacity-40 rounded-xl animate-gradient">
                <Classement data={classesData} />
              </div>
            )}
          </>
        ) : (
          <div className="p-6 bg-gradient-to-br from-black via-purple-950 to-black bg-opacity-40 rounded-xl animate-gradient h-screen">
            <ClassementReel />
          </div>
        )}
      </div>

      <Tchat />

      <ChatForm socket={socket} />
    </div>
  );
}

export default App;
