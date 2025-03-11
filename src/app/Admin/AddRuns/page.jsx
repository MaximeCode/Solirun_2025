"use client"

import RunCard from "@/Components/RunCard"
import { useState, useEffect } from "react"

export default function AddRuns() {
  const [runs, setRuns] = useState([])

  useEffect(() => {
    fetch("http://localhost:3030/api.php?action=Runs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données")
        }
        return response.json()
      })
      .then((data) => {
        console.log(data)
        setRuns(data)
      })
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Ajouter les courses pour la Solirun 2025
      </h1>
    </div>
  )
}
