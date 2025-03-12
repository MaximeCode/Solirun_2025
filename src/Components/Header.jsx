import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl py-5">
      <div className="container mx-auto flex justify-between items-center px-8">
        {/* Logo avec Animation */}
        <Link
          href="/"
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-500 hover:scale-110 transform transition-all duration-500"
        >
          Solirun 2025
        </Link>

        {/* Navigation avec design plus fluide */}
        <div className="flex gap-8 text-lg font-semibold">
          <Link
            href="/Admin/AdminPanel"
            className="px-4 py-2 rounded-lg bg-white bg-opacity-30 hover:bg-opacity-40 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Panneau d'administration
          </Link>
          <Link
            href="/Admin/ManageClasses"
            className="px-4 py-2 rounded-lg bg-white bg-opacity-30 hover:bg-opacity-40 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Gérer les classes
          </Link>
          <Link
            href="/Admin/ManageRuns"
            className="px-4 py-2 rounded-lg bg-white bg-opacity-30 hover:bg-opacity-40 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Gérer les courses
          </Link>
        </div>
      </div>
    </header>
  );
}