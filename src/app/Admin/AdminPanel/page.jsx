"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth"; // ! NE PAS ENLEVER !
import RunCard from "@/Components/RunCardPanel";
import { socket } from "@/utils/socket";
import TeamTypeIcon from "@/Components/TeamTypeIcon";
import ModeratorTchat from "@/Components/ModeratorTchat";

function AdminPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [classes, setClasses] = useState([]);
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(() => {
    // Initialize from local storage if exists
    const savedRun = localStorage.getItem("selectedRun");
    return savedRun ? JSON.parse(savedRun) : null;
  });
  const [error, setError] = useState(false);
  const [buttonText, setButtonText] = useState(
    isRunning ? "Arrêter la Course" : "Démarrer la Course"
  );

  const [classesWithoutProf, setClassesWithoutProf] = useState([]);
  const [classesWithTeacher, setClassesWithTeacher] = useState([]);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInitialMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api.php?action=getTchat`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setMessages(data); // Ordre chronologique (plus récent en bas)
          console.log("Messages récupérés :", data);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.emit("getIsRunning");
    socket.emit("getClasses");

    socket.on("updateIsRunning", setIsRunning);
    socket.on("updateClasses", (newClasses) => {
      setClasses(newClasses);
      // trier les classes d'élèves et les équipes de prof
      setClassesWithoutProf(newClasses.filter((classe) => !classe.isTeacher));
      setClassesWithTeacher(newClasses.filter((classe) => classe.isTeacher));
    });

    // Gérer le tchat
    // 1. Récupération initiale des messages existants
    fetchInitialMessages();

    // 2. Écoute des nouveaux messages via WebSocket
    const handleNewMessage = (newMessage) => {
      console.log("Nouveau message reçu :", newMessage);

      setMessages((prevMessages) => {
        // Vérifier si le message n'existe pas déjà (éviter les doublons)
        const messageExists = prevMessages.some(
          (msg) =>
            msg.id === newMessage.id ||
            (msg.msg === newMessage.msg && msg.idAuteur === newMessage.idAuteur)
        );

        if (!messageExists) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    };

    // 3. Écoute des mises à jour complètes (fallback)
    const handleUpdateMessages = (updatedMessages) => {
      if (Array.isArray(updatedMessages)) {
        setMessages(updatedMessages);
      }
    };

    // Connexion aux événements Socket.IO
    socket.on("newTchatMessage", handleNewMessage);
    socket.on("updateMsgs", handleUpdateMessages);
    socket.on("msgDeleted", () => {
      socket.emit("getMsgs"); // Re-fetch messages after deletion
    });

    return () => {
      socket.off("updateIsRunning");
      socket.off("updateClasses");

      socket.off("newTchatMessage", handleNewMessage);
      socket.off("updateMsgs", handleUpdateMessages);
    };
  }, []);

  useEffect(() => {
    setButtonText(isRunning ? "Arrêter la Course" : "Démarrer la Course");
  }, [isRunning]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php?action=NextRuns`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((data) => {
        setRuns(data);
      });
  }, [isRunning]);

  // Update local storage whenever selectedRun changes
  useEffect(() => {
    if (selectedRun) {
      localStorage.setItem("selectedRun", JSON.stringify(selectedRun));
    } else {
      localStorage.removeItem("selectedRun");
    }
    console.log("Selected Run:", selectedRun);
    console.log("localStorage :: ", localStorage);
  }, [selectedRun]);

  const toggleIsRunning = () => {
    socket.emit("toggleIsRunning");
  };

  const updateTours = (id, increment) => {
    socket.emit("updateToursById", { id, increment });
  };

  const setRunningClasses = (newClasses) => {
    console.log(newClasses);
    socket.emit("setClasses", newClasses);
  };

  const handleClick = () => {
    if (!isRunning) {
      if (selectedRun == null) {
        setError(true);
        setButtonText("Aucune course sélectionnée");

        // Réinitialiser après 1 secondes
        setTimeout(() => {
          setError(false);
          setButtonText(isRunning ? "Arrêter la Course" : "Démarrer la Course");
        }, 1000);
      } else {
        toggleIsRunning();
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "StartRun",
            id: selectedRun,
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Erreur:", error));

        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api.php?action=ClassesRunning&id=${selectedRun}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erreur lors de la récupération des données");
            }
            return response.json();
          })
          .then((data) => {
            const classesWithZeroLaps = data.map((cls) => ({
              ...cls,
              laps: 0,
            }));
            setRunningClasses(classesWithZeroLaps);
            console.log("Data when GET : ", data);
          });
      }
    } else {
      toggleIsRunning();
      console.log(selectedRun);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "EndRun",
          id: selectedRun,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Erreur:", error));

      classes.map((classe, index) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "UpdateLaps",
            theClass: classe.id,
            theRun: selectedRun,
            laps: classe.laps,
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Erreur:", error));
        setSelectedRun(null);
      });
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto w-1/2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Panneau d'Administration
            </h2>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isRunning
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
              {isRunning ? "Course en cours" : "Course arrêtée"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">
                Contrôle de course
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Démarrez ou arrêtez la course actuelle. Ce changement sera
                reflété en temps réel pour tous les utilisateurs.
              </p>
              <button
                id="start-stop_run"
                onClick={handleClick}
                className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${
                  isRunning
                    ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                    : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                }
                ${
                  error ? "bg-red-500 animate-shake hover:bg-red-600" : ""
                } // Ajout de l'animation
              `}>
                {buttonText}
              </button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-700 mb-2">
                Statut du Serveur
              </h3>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">
                  Connecté au serveur WebSocket
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto w-1/2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Modération du tchat
            </h2>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-gray-500">En ligne</span>
            </div>
          </div>
          <ModeratorTchat
            messages={messages}
            isLoading={isLoading}
            socket={socket}
          />
        </div>
      </div>
      {isRunning ? (
        <>
          <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold">🏁 Course en cours</h2>
            <p className="text-gray-600">
              Les données de la course sont mises à jour en temps réel.
            </p>
          </div>

          {/* If there is at least 1 students classe, show : */}
          {classesWithoutProf.length !== 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-4 text-center flex items-center justify-center space-x-2">
                <span>Gestion des classes d'élèves</span>
                <TeamTypeIcon isTeacher={false} />
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 mb-5">
                {classesWithoutProf.map((classe) => (
                  <div
                    key={classe.id}
                    className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold">{classe.name}</h3>
                    <p className="text-gray-700 text-sm">
                      Tours :{" "}
                      <span className="font-semibold">{classe.laps}</span>
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => updateTours(classe.id, 1)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition hover:cursor-pointer">
                        +1 Tour
                      </button>
                      <button
                        onClick={() => updateTours(classe.id, -1)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition hover:cursor-pointer">
                        -1 Tour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* If there is at least 1 teacher team, show this : */}
          {classesWithTeacher.length !== 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-4 text-center flex items-center justify-center space-x-2">
                <span>Gestion des classes de professeurs</span>
                <TeamTypeIcon isTeacher={true} />
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {classesWithTeacher.map((classe) => (
                  <div
                    key={classe.id}
                    className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center">
                    <h3 className="text-lg font-bold">{classe.name}</h3>
                    <p className="text-gray-700 text-sm">
                      Tours :{" "}
                      <span className="font-semibold">{classe.laps}</span>
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => updateTours(classe.id, 1)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition hover:cursor-pointer">
                        +1 Tour
                      </button>
                      <button
                        onClick={() => updateTours(classe.id, -1)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition hover:cursor-pointer">
                        -1 Tour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold">🏁 Aucune course en cours</h2>
            <p className="text-gray-600">
              Sélectionner puis démarrer une course pour accéder aux options de
              gestion des classes.
            </p>
          </div>
          {runs.length !== 0 ? (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {runs.map((run) => (
                <div key={run.id}>
                  <RunCard
                    id={run.id}
                    time={run.estimatedTime}
                    classList={run.classList}
                    setSelectedRun={setSelectedRun}
                    selectedRun={selectedRun}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-red-500 font-bold text-xl mt-8">
              Aucune course à afficher !
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPanel;
