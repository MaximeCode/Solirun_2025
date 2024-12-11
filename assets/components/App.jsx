import React from "react";
import Classement from "./Classement";

const classesData = [
  { nom: "Classe A", etudiants: 30, tours: 120 },
  { nom: "Classe B", etudiants: 25, tours: 110 },
  { nom: "Classe C", etudiants: 28, tours: 95 },
  { nom: "Classe D", etudiants: 32, tours: 130 },
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <Classement data={classesData} />
    </div>
  );
}

export default App;
