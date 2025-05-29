"use client";

import React, { useEffect, useState } from "react";

export default function ChatForm({ socket }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(username !== "");
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("login"); // "login" ou "register"
  const [tempUsername, setTempUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("usernameForTchat") || "");
    console.log(
      "Username from localStorage:",
      localStorage.getItem("usernameForTchat")
    );
  }, []);

  const handleAuth = () => {
    if (tempUsername.trim() === "") return;

    // Appel API pour l'authentification
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php?action=auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "auth",
        username: tempUsername.trim(),
        mode: mode,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((user) => {
        console.log("Réponse de l'API :", user);
        // Saved data in localStorage
        localStorage.setItem("userIdForTchat", user.id);
        localStorage.setItem("usernameForTchat", user.username);
        setUsername(user.username);
        setTempUsername("");
      })
      .catch((error) => {
        console.error("Erreur lors de l'appel API :", error);
      });

    setIsConnected(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    socket.emit("newTchat", localStorage.getItem("userIdForTchat"), message);
    setMessage("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Bouton initial */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg transition duration-300">
          Envoyer un message
        </button>
      )}

      {/* Formulaire conditionnel */}
      {showForm && (
        <div className="bg-gray-900 p-4 rounded-xl shadow-xl w-80">
          <div className="absolute right-4 top-2 mb-2">
            <button
              onClick={() => setShowForm(false)}
              className="text-red-400 hover:text-red-600 text-xl">
              ✕
            </button>
          </div>

          {!isConnected ? (
            <div>
              <h2 className="text-lg font-bold mb-2 text-center text-white">
                {mode === "login" ? "Connexion" : "Inscription"}
              </h2>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-2"
              />
              <button
                onClick={handleAuth}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                {mode === "login" ? "Se connecter" : "S'inscrire"}
              </button>
              <div className="flex justify-center mt-2">
                <button
                  className="text-sm text-center text-blue-500 hover:underline cursor-pointer"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }>
                  {mode === "login"
                    ? "Pas encore inscrit ? S'inscrire"
                    : "Déjà un compte ? Se connecter"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage}>
              <p className="mb-2 text-white">
                Connecté en tant que :{" "}
                <span className="font-bold text-purple-400">{username}</span>
              </p>
              <textarea
                placeholder="Votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-20 p-2 border rounded-lg resize-none mb-1"
              />
              <div className="flex justify-end mb-1">
                <button
                  className="text-sm text-end text-blue-500 hover:underline cursor-pointer w-auto"
                  onClick={() => {
                    setIsConnected(false);
                    localStorage.removeItem("usernameForTchat");
                    localStorage.removeItem("userIdForTchat");
                    setUsername("");
                    setTempUsername("");
                    setShowForm(false);
                  }}>
                  Se déconnecter
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                Envoyer
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
