"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setLoaded(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-800 via-black to-fuchsia-800 opacity-75 blur-3xl animate-pulse"></div>
      
      {/* Moving Circle */}
      <motion.div 
        className="absolute w-64 h-64 bg-purple-600 opacity-30 rounded-full blur-3xl"
        style={{
          left: mousePosition.x - 128, // 128px is half of 256px (w-64 = 16rem = 256px)
          top: mousePosition.y - 128
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
      ></motion.div>

      {/* Page Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center px-6">
        
        {/* Animated Title */}
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 neon-text p-4">
          ⚡ Bienvenue sur la Solirun ⚡
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg text-gray-300 mt-4">
          Suivez les classements en direct et gérez vos équipes avec style !
        </motion.p>
        
        {/* Navigation Links */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-10 flex flex-wrap justify-center gap-6">
          
          <Link href="/Ranking">
            <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg hover:scale-110 transition transform duration-300">
              📊 Classements en temps réel
            </button>
          </Link>
          <Link href="/Podium">
            <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl shadow-lg hover:scale-110 transition transform duration-300">
              🏆 Voir le Podium
            </button>
          </Link>
          <Link href="/Manager">
            <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-lime-500 rounded-xl shadow-lg hover:scale-110 transition transform duration-300">
              🎮 Compteur de tours (mobile)
            </button>
          </Link>
          <Link href="/Admin/ManageClasses">
            <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg hover:scale-110 transition transform duration-300">
              🛠️ Ajouter des Classes
            </button>
          </Link>
          <Link href="/Admin/ManageRuns">
            <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg hover:scale-110 transition transform duration-300">
              🏁 Gérer les Courses
            </button>
          </Link>
          <Link href="/Admin/AdminPanel">
            <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-xl shadow-lg hover:scale-110 transition transform duration-300">
              🔧 Panneau Admin
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}