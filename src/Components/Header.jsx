import React from "react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold">
          Solirun 2025
        </Link>
        <div className="text-white divide-x divide-white">
          <Link href="/Admin/AdminPanel" className="px-4 hover:text-blue-200">
            AdminPanel
          </Link>
          <Link href="/Admin/AddClasses" className="px-4 hover:text-blue-200">
            AddClasses
          </Link>
          <Link href="/Admin/AddRuns" className="px-4 hover:text-blue-200">
            AddRuns
          </Link>
        </div>
      </div>
    </header>
  )
}
