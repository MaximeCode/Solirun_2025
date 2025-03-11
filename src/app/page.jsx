'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      
      {/* Background animation */}
      <div className="absolute inset-0 z-0 bg-black opacity-50 animate-pulse" />
      
      {/* Page Content */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-3000 ease-out transform ${
        loaded ? "opacity-100 scale-100" : "opacity-0 scale-50"
      }`}>

        {/* Animated Title */}
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-fadeInUp p-6">
          ⚡ Bienvenue sur la Solirun ⚡
        </h1>
        <p className="text-lg text-gray-300 mt-4 animate-fadeIn delay-300">
          Suivez les classements en direct et gérez vos équipes avec style !
        </p>

        {/* Navigation Links */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Link href="/Rankings">
            <button className="px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/50">
              📊 Voir les classements en temps réel
            </button>
          </Link>
          <Link href="/Admin/AddClasses">
            <button className="px-6 py-3 text-lg font-bold text-white bg-purple-600 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 hover:bg-purple-700 hover:shadow-purple-500/50">
              🛠️ Ajouter des classes
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
