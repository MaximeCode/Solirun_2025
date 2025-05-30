import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import ShowMsg from "@/Components/ShowMsg";
import PropTypes from "prop-types";

export default function ModeratorTchat({
  messages,
  isLoading,
  socket,
}) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  // Auto-scroll à chaque nouveau message et au chargement initial
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages, isLoading]);

  // Fonction pour supprimer un message
  const deleteMessage = (messageId) => {
    let moderateurId = localStorage.getItem("userId");
    socket.emit("msgDeletedByModerateur", messageId, moderateurId);
  };

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-500">
            Chargement des messages...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80 flex flex-col border border-gray-200 rounded-lg bg-gray-50">
      {/* Zone de messages avec effet de fondu */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        {/* Gradient de fondu en haut */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none"></div>

        {/* Messages scrollables */}
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-y-auto px-4 pt-2 pb-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                Aucun message pour le moment...
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className="group bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <strong className="text-blue-600 text-sm font-medium">
                          {msg.username || `User-${msg.idAuteur}`}
                        </strong>
                      </div>
                      <p className="text-sm text-gray-700 break-words leading-relaxed">
                        <ShowMsg msg={msg} />
                      </p>
                    </div>

                    {/* Bouton de suppression */}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 ml-3 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0"
                      title="Supprimer ce message">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
            {/* Élément invisible pour le scroll automatique */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Footer avec indicateur */}
      <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-center">
          <div className="text-xs text-gray-500">
            {messages.length} message{messages.length !== 1 ? "s" : ""} •
            Modération active
          </div>
        </div>
      </div>
    </div>
  );
}

ModeratorTchat.propTypes = {
  messages: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  fetchInitialMessages: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
};
