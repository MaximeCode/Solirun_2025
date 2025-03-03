'use client'

import React from "react";
import Classement from "../../Components/Ranking";

const classesData = [
  { nom: "Classe A", etudiants: 30, tours: 120 },
  { nom: "Classe B", etudiants: 25, tours: 110 },
  { nom: "Classe C", etudiants: 28, tours: 95 },
  { nom: "Classe D", etudiants: 32, tours: 130 },
  { nom: "Classe E", etudiants: 27, tours: 115 },
  { nom: "Classe F", etudiants: 29, tours: 105 },
  { nom: "Classe G", etudiants: 33, tours: 140 },
  { nom: "Classe H", etudiants: 24, tours: 100 },
  { nom: "Classe I", etudiants: 26, tours: 125 },
  { nom: "Classe J", etudiants: 31, tours: 135 },
  { nom: "Classe K", etudiants: 22, tours: 90 },
  { nom: "Classe L", etudiants: 35, tours: 145 },
  { nom: "Classe M", etudiants: 30, tours: 110 },
  { nom: "Classe N", etudiants: 28, tours: 102 },
  { nom: "Classe O", etudiants: 20, tours: 85 },
];

function App( { page } ) {
  page = "Ranking";
  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 via-gray-750 to-gray-900">
        <div className="px-16 py-16">
          {page == "Ranking" && 
            <Classement data={classesData} />
          }
        </div>
      </div>
    </>
  );
}

export default App;