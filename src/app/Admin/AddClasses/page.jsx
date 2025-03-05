"use client"

import UpdateClass from "@/Components/UpdateClass"
import { useState, useEffect } from "react"

export default function AddClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showUpdateClass, setShowUpdateClass] = useState(0) // 0 => Ne pas afficher, [nb] => Afficher le composant update pour la classe avec l'id [nb]
  const [dataRefresh, setDataRefresh] = useState(false)

  useEffect(() => {
    // Fonction pour récupérer les scores depuis l'API PHP
    async function fetchScores() {
      try {
        // Appel à l'API pour obtenir les classes
        const response = await fetch(
          "http://localhost:3030/api.php?action=Classes"
        )
        // Convertir la réponse en format JSON
        const data = await response.json()
        // Mettre à jour l'état avec les données récupérées
        setClasses(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des scores:", error)
        setError(
          error
            ? error
            : { message: "Erreur lors de la récupération des classes" }
        )
      } finally {
        setLoading(false)
      }
    }

    // Appeler la fonction pour récupérer les classes
    fetchScores()
  }, [dataRefresh])

  return (
    <div>
      <h1 className="text-3xl font-bold text-left mt-16 mb-8">
        Ajouter les classes participantes à la Solirun 2025
      </h1>

      {loading && <p>Chargement...</p>}
      {error && <p>Erreur : {error.message}</p>}

      {showUpdateClass && (
        <UpdateClass
          classe={classes.find((classe) => classe.id === showUpdateClass)}
          onCancel={() => setShowUpdateClass(0)}
          onSuccess={() => setDataRefresh(!dataRefresh)}
        />
      )}

      <p className="my-4">Nombre de classes participantes: {classes.length}</p>

      <div className="grid grid-cols-1 gap-4 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((classe, index) => (
          <div
            key={index}
            className="w-75 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {classe.name}
            </h3>

            <h4 className="mb-4 text-lg font-medium text-gray-900">
              {classe.nbStudents} élèves
            </h4>

            <button
              onClick={() => setShowUpdateClass(classe.id)}
              href="/Admin/UpdateClass"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-teal-500 rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
              Mettre à jour cette classe
              <svg
                className=" w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {!showUpdateClass && (
        <>
          <button className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-2 border-white">
            Ajouter une classe
          </button>

          <button className="mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4">
            Supprimer une classe
          </button>

          <button className="mt-8 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
            Enregistrer
          </button>

          <button className="mt-8 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4">
            Annuler
          </button>
        </>
      )}
    </div>
  )
}
