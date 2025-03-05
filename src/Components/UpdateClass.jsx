import React, { useState, useEffect } from "react"

export default function UpdateClass({
  classe,
  onCancel,
  onSuccess,
  isRefresh,
}) {
  const [formData, setFormData] = useState({
    name: "",
    nbStudents: 0,
  })
  const [mes, setMes] = useState("")
  const [classUpdate, setClassUpdate] = useState(false) // true => Afficher message de succès, false => Afficher message d'erreur
  const [updateStatus, setUpdateStatus] = useState(null) // null = Pas de message, "success" = succès, "error" = échec

  useEffect(() => {
    if (classe) {
      setFormData({
        name: classe.name || "",
        nbStudents: classe.nbStudents || 0,
      })
    }
  }, [classe])

  useEffect(() => {
    setUpdateStatus(null)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Fonction asynchrone -> envoi des données vers le serveur
  const updateClass = async () => {
    try {
      const response = await fetch(
        "http://localhost:3030/api.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "UpdateClass",
            classId: classe.id,
            name: formData.name,
            nbStudents: formData.nbStudents,
          }),
        }
      )
      const result = await response.json()
      if (result.success) {
        setMes("Class successfully updated !")
        setUpdateStatus("success") // ✅ Déclenche l'affichage du message de succès
        onSuccess()
      } else {
        setMes("Error updating class !")
        setUpdateStatus("error") // ✅ Déclenche l'affichage du message d'erreur
        console.error(result.message)
      }
    } catch (error) {
      console.error("Erreur lors de l'update: ", error)
      setUpdateStatus("error") // ✅ Gère les erreurs réseau
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateClass()
  }

  return (
    <>
      {updateStatus === null && (
        <div className="w-100 mx-auto border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-left mb-4">
            Modifier la classe {classe.name}
          </h2>
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="classId" value={classe.id} />
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block mb-2 text-lg font-medium text-gray-900">
                Modifier le nom de la classe
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="nbStudents"
                className="block mb-2 text-lg font-medium text-gray-900">
                Modifier le nombre d'élève de la classe
              </label>
              <input
                type="text"
                id="nbStudents"
                name="nbStudents"
                value={formData.nbStudents}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Mettre à jour
              </button>
              <button
                type="button"
                onClick={() => onCancel()}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
      {updateStatus === "success" && (
        <div
          id="closeAlert-1"
          class="w-fit mx-auto flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert">
          <svg
            class="shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span class="sr-only">Info</span>
          <div class="ms-3 text-sm font-medium">
            La classe {classe.name} a été mise à jour avec succès !
          </div>
          <button
            type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
            data-dismiss-target="#closeAlert-1"
            aria-label="Close">
            <span class="sr-only">Close</span>
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}

      {updateStatus === "error" && (
        <div
          id="closeAlert-2"
          class="w-fit mx-auto flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert">
          <svg
            class="shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span class="sr-only">Info</span>
          <span className="font-medium">Erreur!</span> La mise à jour a échoué.
          Veuillez réessayer ou contacter les développeurs.
          <button
            type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
            data-dismiss-target="#closeAlert-2"
            aria-label="Close">
            <span class="sr-only">Close</span>
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
