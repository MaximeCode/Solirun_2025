import { useEffect, useState, useRef } from "react";
import { socket } from "@/utils/socket";

export default function Tchat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Récupération initiale des messages existants
    const fetchInitialMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api.php?action=getTchat`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setMessages(data); // Ordre chronologique (plus récent en bas)
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
      } finally {
        setIsLoading(false);
      }
    };

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

    // Nettoyage à la déconnexion du composant
    return () => {
      socket.off("newTchatMessage", handleNewMessage);
      socket.off("updateMsgs", handleUpdateMessages);
    };
  }, []);

  // Auto-scroll à chaque nouveau message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="p-4 w-100 max-h-96 z-10 fixed top-1 right-1 bg-gray-900 rounded-lg text-white">
        <div className="text-center">
          <div className="animate-pulse">Chargement des messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 max-h-96 z-10 fixed top-1 left-1 bg-gray-900 rounded-lg text-white flex flex-col opacity-75 shadow-lg transition-opacity duration-300 hover:opacity-100">
      {/* En-tête fixe */}
      <div className="p-4 pb-2 bg-gray-900 rounded-t-lg relative z-20">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Messages en direct</h2>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-gray-400">En ligne</span>
          </div>
        </div>
        <hr className="border-gray-700" />
      </div>

      {/* Zone de messages avec effet de fondu */}
      <div className="flex-1 relative overflow-hidden min-h-80">
        {/* Gradient de fondu en haut */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-900 to-transparent z-10 pointer-events-none"></div>

        {/* Messages scrollables */}
        <div className="absolute inset-0 overflow-y-auto px-4 py-1">
          <div className="space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-4">
                Aucun message pour le moment...
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className="bg-gray-800 p-2 rounded-lg border-l-2 border-purple-500">
                  <div className="flex justify-between items-start mb-1">
                    <strong className="text-purple-400 text-sm">
                      {msg.username || `User-${msg.idAuteur}`}
                    </strong>
                  </div>
                  <p className="text-sm text-gray-100 break-words">{msg.msg}</p>
                </div>
              ))
            )}
            {/* Élément invisible pour le scroll automatique */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Footer avec indicateur de connexion */}
      <div className="px-4 py-2 bg-gray-900 rounded-b-lg border-t border-gray-700 relative z-20">
        <div className="flex items-center justify-center">
          <div className="text-xs text-gray-500">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
