"use client"

import { useState, useEffect } from "react"
import ToastAlert, { showToast } from "@/Components/ToastAlert"
import RunCardAdmin from "@/Components/RunCardAdmin"
import FormRuns from "@/Components/FormRuns"
import NewItem from "@/Components/NewItem"

export default function ManageRuns() {
  const initRuns = {
    estimatedTime: "",
    classList: [],
  }
  const [runs, setRuns] = useState([]) // Array of estimatedTime and class id list foreach run
  const [loading, setLoading] = useState(true)
  const [showAddRuns, setShowAddRuns] = useState(0) // 0 => Ne pas afficher, 1 => Afficher le +, 2 => Afficher le formulaire
  const [newRuns, setNewRuns] = useState(initRuns)

  const [classes, setClasses] = useState([])

  const [updateStatus, setUpdateStatus] = useState(false) // false => Ne pas afficher, true => Afficher le form avec les valeurs à modifier

  const getAllRuns = () => {
    console.log(" ---- Début getAllRuns")
    // Fetch all runs
    fetch("http://localhost:3030/api.php?action=AllRuns")
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          showToast("Erreur lors de la récupération des courses", true)
          throw new Error("Erreur lors de la récupération des courses")
        }
        return response.json()
      })
      .then((data) => {
        // Convert string to array for classList
        data.forEach((run) => {
          run.classIdList = run.classIdList.split(",")
          run.classNameList = run.classNameList.split(",")
        })
        setRuns(data)
        setLoading(false)
        setShowAddRuns(1)
        console.log("Runs: ", data)
      })
      .catch((error) => {
        console.error("Error fetching runs:", error)
        setLoading(false)
      })
      .then(() => {
        console.log(" ---- Fin getAllRuns")
      })
  }

  const getAllClasses = () => {
    // Fetch all classes
    fetch("http://localhost:3030/api.php?action=Classes")
      .then((response) => {
        if (!response.ok) {
          showToast("Erreur lors de la récupération des classes", true)
          throw new Error("Erreur lors de la récupération des classes")
        }
        return response.json()
      })
      .then((data) => {
        // console.log("Classes data:", data)
        setClasses(data)
      })
      .catch((error) => {
        console.error("Error fetching classes:", error)
      })
  }

  // Fonction pour insérer la nouvelle course dans la DB
  const saveRun = () => {
    console.log(" ---- SaveRun")
    // Envoi des courses vers l'API
    fetch("http://localhost:3030/api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "insertRun",
        estimatedTime: newRuns.estimatedTime,
        class_idToAdd: newRuns.classList,
      }),
    })
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          showToast("Erreur lors de l'insertion de la course ❌", true)
          throw new Error(
            "Erreur lors de l'insertion de la course en base de données"
          )
        }
        showToast("Course enregistrée avec succès", false)
        setNewRuns(initRuns)
        setShowAddRuns(1)
        getAllRuns()
      })
      .catch((error) => {
        console.error("Erreur:", error)
        showToast(error.message, true)
      })
      .then(() => {
        console.log(" ---- Fin saveRun")
      })
  }

  // Fonction pour supprimer une course de la DB
  const deleteRun = (id) => {
    console.log(" ---- DeleteRun")
    console.log("id à suppr : ", id)
    // Envoi de la requête pour supprimer la course
    fetch("http://localhost:3030/api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "deleteRun",
        run_id: id,
      }),
    })
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          showToast("Erreur lors de la suppression de la course ❌", true)
          throw new Error(
            "Erreur lors de la suppression de la course en base de données"
          )
        }
        showToast("Course supprimée avec succès", false)
        getAllRuns()
      })
      .catch((error) => {
        console.error("Erreur:", error)
        showToast(error.message, true)
      })
  }

  useEffect(() => {
    getAllRuns()
    getAllClasses()
  }, [])

  return (
    <div>
      <ToastAlert />

      <h1 className="text-3xl font-bold mb-8">
        Ajouter les courses pour la Solirun 2025
      </h1>

      {loading && <span className="loading loading-bars loading-md"></span>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {runs.map((run, index) => (
          <div key={run.id}>
            <RunCardAdmin
              id={run.id}
              idTxt={index + 1}
              time={run.estimatedTime}
              className={run.classNameList}
              updateStatus={updateStatus}
              setUpdateStatus={setUpdateStatus}
              deleteRuns={() => deleteRun(run.id)}
            />
          </div>
        ))}

        {/* Form Add Runs */}
        {showAddRuns === 2 && (
          <FormRuns
            runs={runs}
            classes={classes}
            newRuns={newRuns}
            setNewRuns={setNewRuns}
            saveRun={() => saveRun()}
            onCancel={() => {
              setShowAddRuns(1)
              setNewRuns(initRuns)
            }}
          />
        )}

        {showAddRuns == 1 ? (
          // + btn
          <NewItem setShow={() => setShowAddRuns(2)} />
        ) : null}
      </div>
    </div>
  )
}
