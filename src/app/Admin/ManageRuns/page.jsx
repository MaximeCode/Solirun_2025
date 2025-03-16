"use client"

import { useState, useEffect } from "react"
import ToastAlert, { showToast } from "@/Components/ToastAlert"
import RunCardAdmin from "@/Components/RunCardAdmin"
import FormRuns from "@/Components/FormRuns"
import NewItem from "@/Components/NewItem"
import UpdateRun from "@/Components/UpdateRun"

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

  const [showUpdateRun, setShowUpdateRun] = useState(0) // 0 => Ne pas afficher, [nb] => Afficher le composant update pour la course avec l'id [nb]

  const getAllRuns = () => {
    console.log(" ---- Début getAllRuns")
    setLoading(true)
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
        setShowAddRuns(1)
        console.log("Runs: ", data)
      })
      .catch((error) => {
        console.error("Error fetching runs:", error)
      })
      .then(() => {
        console.log(" ---- Fin getAllRuns")
        setLoading(false)
      })
  }

  const getAllClasses = () => {
    console.log(" ---- Début getAllClasses")
    setLoading(true)
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
        setClasses(data)
        console.log("Classes: ", data)
      })
      .catch((error) => {
        console.error("Error fetching classes:", error)
      })
      .then(() => {
        console.log(" ---- Fin getAllClasses")
        setLoading(false)
      })
  }

  // Fonction pour insérer la nouvelle course dans la DB
  const saveRun = () => {
    console.log(" ---- SaveRun")
    setLoading(true)
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
        setLoading(false)
      })
  }

  // Fonction pour mettre à jour une course dans la DB
  const updateRun = (run_id, estimatedTime, classesToAdd, classesToRemove) => {
    console.log(" ---- UpdateRun")
    setLoading(true)
    // Envoi des données vers l'API
    fetch("http://localhost:3030/api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateRun",
        run_id: run_id,
        estimatedTime: estimatedTime,
        class_idToAdd: classesToAdd,
        class_idToRemove: classesToRemove,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          showToast("Erreur lors de la mise à jour de la course ❌", true)
          throw new Error("Erreur lors de la mise à jour de la course")
        }
        showToast("Course mise à jour avec succès", false)
        getAllRuns()
      })
      .catch((error) => {
        console.error("Erreur:", error)
        showToast(error.message, true)
      })
      .then(() => {
        console.log(" ---- Fin update")
        setLoading(false)
      })
  }

  // Fonction pour supprimer une course de la DB
  const deleteRun = (id) => {
    console.log(" ---- DeleteRun")
    console.log("id à suppr : ", id)
    setLoading(true)
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
      .then(() => {
        console.log(" ---- Fin deleteRun")
        setLoading(false)
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

      {showUpdateRun > 0 && (
        <UpdateRun
          index={showUpdateRun}
          run={runs.find((run) => run.id === showUpdateRun)}
          setRuns={setRuns}
          onCancel={() => setShowUpdateRun(0)}
          onSuccess={() => {
            setShowUpdateRun(0)
          }}
          showToast={showToast}
          classes={classes}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {runs.map((run, index) => (
          <div key={run.id}>
            <RunCardAdmin
              id={run.id}
              idTxt={index + 1}
              time={run.estimatedTime}
              className={run.classNameList}
              setShowUpdateRun={setShowUpdateRun}
              deleteRuns={() => deleteRun(run.id)}
              classes={classes}
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
