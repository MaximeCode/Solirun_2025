"use client";

import NewItem from "@/Components/NewItem";
import ToastAlert, { showToast } from "@/Components/ToastAlert";
import UpdateClass from "@/Components/UpdateClass";
import { useState, useEffect } from "react";

export default function ManageClasses() {
  const initClass = {
    name: "",
    nbStudents: 0,
  };

  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showUpdateClass, setShowUpdateClass] = useState(0); // 0 => Ne pas afficher, [nb] => Afficher le composant update pour la classe avec l'id [nb]
  const [dataRefresh, setDataRefresh] = useState(false);

  // Add class
  const [showAddClass, setShowAddClass] = useState(0); // 0 => Ne pas afficher, 1 => Afficher le +, 2 => Afficher le formulaire
  const [newClass, setNewClass] = useState(initClass);

  useEffect(() => {
    // Fonction pour récupérer les scores depuis l'API PHP
    async function fetchClasses() {
      try {
        // Appel à l'API pour obtenir les classes
        const response = await fetch(
          "http://localhost:3030/api.php?action=Classes"
        );
        // Convertir la réponse en format JSON
        const data = await response.json();
        // Mettre à jour l'état avec les données récupérées
        setClasses(data);
      } catch (error) {
        showToast(error.message, true);
      } finally {
        setLoading(false);
        setShowAddClass(1);
      }
    }

    // Appeler la fonction pour récupérer les classes
    fetchClasses();
  }, [dataRefresh]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [!showUpdateClass]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [showUpdateClass == false])

  // Fonction pour supprimer une classe
  const deleteClass = (classId) => {
    if (!confirm("Vouslez vous vraiment supprimer la classe ?")){
      return;
    }
    // suppression de la classe avec l'id [classId] de classes
    fetch("http://localhost:3030/api.php", {
      method : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "deleteClass",
        classId: classId,
      }),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          showToast("Erreur lors de l'insertion de la classe ❌", true)
          throw new Error(
            "Erreur lors de l'insertion de la classe en base de données"
          )
        }
        setDataRefresh(!dataRefresh)
        showToast(`Classe supprimée avec succès ✅`, false)
      })
      .catch((error) => {
        console.error("Erreur:", error)
        showToast(error.message, true)
      })
  }

  const saveClass = (classe) => {
    fetch("http://localhost:3030/api.php", {
      method : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "insertClass",
        classe: classe,
      }),
    })
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          showToast("Erreur lors de l'insertion de la classe ❌", true)
          throw new Error(
            "Erreur lors de l'insertion de la classe en base de données"
          )
        }
        setDataRefresh(!dataRefresh);
        showToast(`Classe supprimée avec succès ✅`, false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        showToast(error.message, true);
      });
  };

  const updateClass = (classe) => {
    fetch("http://localhost:3030/api.php", {
      method : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "updateClass",
        classe: classe,
      }),
    })
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          showToast("Erreur lors de la modification de la classe ❌", true)
          throw new Error(
            "Erreur lors de la modification de la classe en base de données"
          )
        }
        setDataRefresh(!dataRefresh)
        showToast("Classes modifiées avec succès ✅", false)
      })
      .catch((error) => {
        console.error("Erreur:", error)
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
          updateClassFunction={updateClass}
          onCancel={() => setShowUpdateClass(0)}
          onSuccess={() => {
            setShowUpdateClass(0);
          }}
          showToast={showToast}
        />
      ) : null}

      <p className="my-4">Nombre de classes participantes: {classes.length}</p>

      <div className="grid grid-cols-1 gap-4 justify-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((classe) => (
          <div
            key={classe.id}
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
              type="number"
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
                    alert("Veuillez remplir tous les champs");
                    return;
                  }
                  saveClass(newClass);
                  setShowAddClass(1);
                  setNewClass(initClass);
                  showToast("Classe ajoutée avec succès !", false);
                }}>
                Ajouter
              </button>

              <button
                className="btn btn-soft"
                onClick={() => {
                  setShowAddClass(1);
                  setNewClass(initClass);
                }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {showAddClass == 1 ? (
          // + btn
          <NewItem setShow={() => setShowAddClass(2)} />
        ) : null}
      </div>
    </div>
  );
}
