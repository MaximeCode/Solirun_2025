import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          href="/"
          className="text-2xl font-semibold">
          Solirun 2025
        </Link>
        <div className="text-white divide-x divide-white">
          <Link
            href="/Admin/AdminPanel"
            className="pr-4 link link-hover">
            Panneau d'administration
          </Link>
          <Link
            href="/Admin/ManageClasses"
            className="px-4 link link-hover">
            Gérer les classes
          </Link>
          <Link
            href="/Admin/ManageRuns"
            className="pl-4 link link-hover">
            Gérer les courses
          </Link>
        </div>
      </div>
    </header>
  );
}
