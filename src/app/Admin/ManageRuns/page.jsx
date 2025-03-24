"use client";

import { useState, useEffect } from "react";
import ToastAlert, { showToast } from "@/Components/ToastAlert";
import RunCardAdmin from "@/Components/RunCardAdmin";
import NewItem from "@/Components/NewItem";
import UpdateRun from "@/Components/UpdateRun";

export default function ManageRuns() {
  const initRuns = {
    estimatedTime: "",
    classList: [],
  };
  const [runs, setRuns] = useState([]); // Array of estimatedTime and class id list foreach run
  const [loading, setLoading] = useState(true);
  const [showAddRuns, setShowAddRuns] = useState(0); // 0 => Ne pas afficher, 1 => Afficher le +, 2 => Afficher le formulaire
  const [newRuns, setNewRuns] = useState(initRuns);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const [classes, setClasses] = useState([]);

  const [showUpdateRun, setShowUpdateRun] = useState(0); // 0 => Ne pas afficher, [nb] => Afficher le composant update pour la course avec l'id [nb]

  const getAllRuns = () => {
    console.log(" ---- Début getAllRuns");
    setLoading(true);
    // Fetch all runs
    fetch("http://localhost:3030/api.php?action=AllRuns")
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          showToast("Erreur lors de la récupération des courses", true);
          throw new Error("Erreur lors de la récupération des courses");
        }
        return response.json();
      })
      .then((data) => {
        // Convert string to array for classList
        data.forEach((run) => {
          run.classIdList = run.classIdList.split(", ");
          run.classNameList = run.classNameList.split(", ");
        });
        setRuns(data);
        setShowAddRuns(1);
      })
      .catch((error) => {
        console.error("Error fetching runs:", error);
      })
      .then(() => {
        console.log(" ---- Fin getAllRuns");
        setLoading(false);
      });
  };

  const getAllClasses = () => {
    console.log(" ---- Début getAllClasses");
    setLoading(true);
    // Fetch all classes
    fetch("http://localhost:3030/api.php?action=Classes")
      .then((response) => {
        if (!response.ok) {
          showToast("Erreur lors de la récupération des classes", true);
          throw new Error("Erreur lors de la récupération des classes");
        }
        return response.json();
      })
      .then((data) => {
        setClasses(data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      })
      .then(() => {
        console.log(" ---- Fin getAllClasses");
        setLoading(false);
      });
  };

  // Toggle class selection for new run
  const toggleClass = (classId) => {
    setNewRuns((prevData) => {
      // Check if the class is already selected
      if (prevData.classList.includes(classId)) {
        // Remove the class if already selected
        return {
          ...prevData,
          classList: prevData.classList.filter((id) => id !== classId),
        };
      } else {
        // Add the class if not selected
        return {
          ...prevData,
          classList: [...prevData.classList, classId],
        };
      }
    });
  };

  // Filter classes based on search term
  const filteredClasses = classes.filter((classe) =>
    classe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour insérer la nouvelle course dans la DB
  const saveRun = () => {
    console.log(" ---- SaveRun");
    setLoading(true);
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
        console.log(response);
        if (!response.ok) {
          showToast("Erreur lors de l'insertion de la course ❌", true);
          throw new Error(
            "Erreur lors de l'insertion de la course en base de données"
          );
        }
        showToast("Course enregistrée avec succès", false);
        setNewRuns(initRuns);
        setShowAddRuns(1);
        getAllRuns();
      })
      .catch((error) => {
        console.error("Erreur:", error);
        showToast(error.message, true);
      })
      .then(() => {
        console.log(" ---- Fin saveRun");
        setLoading(false);
      });
  };

  // Fonction pour supprimer une course de la DB
  const deleteRun = (id) => {
    console.log(" ---- DeleteRun");
    setLoading(true);
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
        console.log(response);
        if (!response.ok) {
          showToast("Erreur lors de la suppression de la course ❌", true);
          throw new Error(
            "Erreur lors de la suppression de la course en base de données"
          );
        }
        showToast("Course supprimée avec succès", false);
        getAllRuns();
      })
      .catch((error) => {
        console.error("Erreur:", error);
        showToast(error.message, true);
      })
      .then(() => {
        console.log(" ---- Fin deleteRun");
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllRuns();
    getAllClasses();
  }, []);

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
          showToast={showToast}
          classes={classes}
          getAllRuns={getAllRuns}
        />
      )}

      {/* Form for adding new run */}
      {showAddRuns === 2 && (
        <div className="w-100 mx-auto space-y-6 bg-blue-500 text-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-left">
            Ajouter une nouvelle course
          </h2>
          <form className="space-y-4">
            <div className="mx-auto w-full max-w-md text-center">
              <label
                className="text-lg font-semibold text-center mb-4"
                htmlFor="estimatedTime">
                ⏳ Heure de départ estimée :
              </label>
              <input
                type="time"
                id="estimatedTime"
                name="estimatedTime"
                className="w-3/4 mx-auto mb-4 text-lg text-gray-900 border-b-2 bg-gray-100 border-gray-200 input input-ghost pl-4"
                value={newRuns.estimatedTime}
                onChange={(e) =>
                  setNewRuns({ ...newRuns, estimatedTime: e.target.value })
                }
              />
            </div>

            <div className="bg-gray-100 border border-gray-200 text-black p-4 rounded-lg">
              <h4 className="text-xl font-semibold text-center mb-2">
                Sélectionnez les classes participantes :
              </h4>

              {/* Search input */}
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une classe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setSearchTerm("")}>
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-48 overflow-y-auto border-1 border-blue-300 rounded-md inset-shadow-lg inset-shadow-blue-500">
                {filteredClasses.length > 0 &&
                  filteredClasses.map((classe) => (
                    <button
                      type="button"
                      key={classe.id}
                      onClick={() => toggleClass(classe.id.toString())}
                      className={`cursor-pointer p-2 rounded-md font-medium text-center transition-colors flex justify-center items-center ${
                        newRuns.classList.includes(classe.id.toString())
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}>
                      {classe.name}
                    </button>
                  ))}
                {filteredClasses.length === 0 && searchTerm !== "" && (
                  <div className="col-span-3 flex justify-center items-center h-32 text-gray-500">
                    Aucune classe ne correspond à votre recherche
                  </div>
                )}
                {filteredClasses.length === 0 && searchTerm === "" && (
                  <div className="col-span-3 flex justify-center items-center h-32 text-gray-500">
                    Aucune classe n'est disponible
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={saveRun}
                className="btn btn-success text-white"
                disabled={loading}>
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddRuns(1);
                  setNewRuns(initRuns);
                  setSearchTerm("");
                }}
                className="btn btn-soft">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 items-center">
        {runs.map((run) => {
          return (
            <div key={run.id}>
              <RunCardAdmin
                id={run.id}
                time={run.estimatedTime}
                className={run.classNameList}
                setShowUpdateRun={setShowUpdateRun}
                deleteRuns={() => deleteRun(run.id)}
                classes={classes}
                run={run}
              />
            </div>
          );
        })}

        {showAddRuns == 1 ? (
          // + btn
          <NewItem setShow={() => setShowAddRuns(2)} />
        ) : null}
      </div>
    </div>
  );
}
