"use client"

import ToastAlert, { showToast } from "@/Components/ToastAlert"
import UpdateClass from "@/Components/UpdateClass"
import { useState, useEffect } from "react"

export default function AddClasses() {
  const initClass = {
    name: "",
    nbStudents: 0,
  }

  const [classes, setClasses] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [showUpdateClass, setShowUpdateClass] = useState(0) // 0 => Ne pas afficher, [nb] => Afficher le composant update pour la classe avec l'id [nb]
  const [dataRefresh, setDataRefresh] = useState(false)

  // Add class
  const [showAddClass, setShowAddClass] = useState(0) // 0 => Ne pas afficher, 1 => Afficher le +, 2 => Afficher le formulaire
  const [newClass, setNewClass] = useState(initClass)

  useEffect(() => {
    // Fonction pour récupérer les scores depuis l'API PHP
    async function fetchClasses() {
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
        showToast(error.message, true)

      } finally {
        setLoading(false)
        setShowAddClass(1)
      }
    }

    // Appeler la fonction pour récupérer les classes
    fetchClasses()
  }, [dataRefresh])

  // Fonction pour supprimer une classe
  const deleteClass = (classId) => {
    if (confirm("Voulez-vous vraiment supprimer cette classe ?")) {
      // suppression de la classe avec l'id [classId] de classes
      setClasses(classes.filter((classe) => classe.id !== classId))
      const className = classes.find((classe) => classe.id === classId).name
      showToast(`Classe ${className} supprimée avec succès`, false)
    }
  }

  // Fonction pour insérer les nouvelles classes dans la DB
  const saveClasses = () => {
    // Envoi des classes vers l'API
    fetch("http://localhost:3030/api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "insertClasses",
        classes: classes,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          showToast("Erreur lors de l'insertion des classes ❌", true)
          throw new Error("Erreur lors de l'insertion des classes")
        }
        return response.json()
      })
      .then((result) => {
        if (result.success) {
          showToast("Classes insérées avec succès", false)
        } else {
          showToast(result.message, true)
        }
      })
      .catch((error) => {
        showToast(error.message, true)
      })
  }

  return (
    <div>
      <ToastAlert />

      <h1 className="text-3xl font-bold mb-8">
        Ajouter les classes participantes à la Solirun 2025
      </h1>

      {loading && <span className="loading loading-bars loading-md"></span>}

      {showUpdateClass ? (
        <UpdateClass
          classe={classes.find((classe) => classe.id === showUpdateClass)}
          onCancel={() => setShowUpdateClass(0)}
          onSuccess={() => {
            setShowUpdateClass(0)
            setDataRefresh(!dataRefresh)
          }}
          showToast={showToast}
        />
      ) : null}

      <p className="my-4">Nombre de classes participantes: {classes.length}</p>

      <div className="grid grid-cols-1 gap-4 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((classe, index) => (
          <div
            key={index}
            className="w-75 p-6 bg-white border border-gray-200 rounded-lg shadow-sm relative">
            {/* Bin to del the class */}
            <div className="absolute top-0 right-0 p-2">
              <svg
                onClick={() => deleteClass(classe.id)}
                className="w-6 h-6 text-red-500 cursor-pointer"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {classe.name}
            </h3>

            <h4 className="mb-4 text-lg font-medium text-gray-900">
              {classe.nbStudents} élèves
            </h4>

            <button
              onClick={() => setShowUpdateClass(classe.id)}
              href="/Admin/UpdateClass"
              className="inline-flex items-center btn bg-emerald-300 hover:bg-emerald-500">
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
        {/* Add class */}
        {showAddClass === 2 && (
          <div className="w-75 p-6 pt-10 bg-white border border-gray-200 rounded-lg shadow-sm relative flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Nom de la classe"
              className="mb-3 text-2xl font-bold tracking-tight text-gray-900 border-b-2 border-gray-200 input input-ghost p-0"
              onChange={(e) =>
                setNewClass({ ...newClass, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Nombre d'élèves"
              className="w-3/4 mb-4 text-lg font-medium text-gray-900 border-b-2 border-gray-200 input input-ghost p-0"
              onChange={(e) =>
                setNewClass({ ...newClass, nbStudents: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                className="btn btn-success"
                onClick={() => {
                  if (newClass.name === "" || newClass.nbStudents === 0) {
                    alert("Veuillez remplir tous les champs")
                    return
                  }
                  classes.push(newClass)
                  setShowAddClass(1)
                  setNewClass(initClass)
                }}>
                Ajouter
              </button>

              <button
                className="btn btn-soft"
                onClick={() => {
                  setShowAddClass(1)
                  setNewClass(initClass)
                }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {showAddClass == 1 ? (
          // + btn
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowAddClass(2)}
              className="p-6 size-auto btn border border-success rounded-lg shadow-sm">
              <svg
                className="w-12 h-12 text-success"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      {!showUpdateClass && (
        <div className="flex gap-4 mt-8">
          <button
            className="btn text-white btn-success"
            onClick={() => saveClasses()}>
            Enregistrer
          </button>
          <button className="btn btn-soft">Annuler</button>
        </div>
      )}
    </div>
  )
}
