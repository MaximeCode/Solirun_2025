import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

export default function UpdateRun({
  index,
  run,
  setRuns,
  onCancel,
  onSuccess,
  showToast,
  classes,
}) {
  const [formData, setFormData] = useState({
    estimatedTime: run.estimatedTime || "00:00",
    class_idList: run.class_idList || ["Rien"],
  })
  const [loading, setLoading] = useState(false) // true => Afficher the loader, false => Ne rien afficher

  useEffect(() => {
    if (formData) {
      console.log("formData: ", formData)
    }
  }, [formData])

  console.log("classIdList: ", formData.class_idList)
  classes.map((classe) => {
    // console.log("classe: ", classe)
    formData.class_idList.includes(classe.id)
      ? console.log(`classe ${classe.name} selected`)
      : console.log(`classe ${classe.name} not selected`)
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Update de la run ds la list des runs avant l'envoi vers la db
  const updateRun = () => {
    setLoading(true)
    setRuns((prevRuns) => {
      return prevRuns.map((cl) => {
        if (cl.id === run.id) {
          return {
            ...cl,
            estimatedTime: formData.estimatedTime,
            class_idList: formData.class_idList,
          }
        }
        return cl
      })
    })
    setLoading(false)
    showToast(`Course mise à jour avec succès`, false)
    onSuccess()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateRun()
  }

  return (
    <div className="w-100 mx-auto space-y-6 bg-info/75 text-white rounded-lg shadow-lg p-6 mb-6 ${updateStatus != null ? 'hidden' : 'block'}">
      <h2 className="text-2xl font-bold text-left">
        Modifier la course #{index}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4">
        <input
          type="hidden"
          name="runId"
          value={run.id}
        />
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
            className="w-3/4 mx-auto mb-4 text-lg text-gray-900 border-b-2 border-gray-200 input input-ghost pl-4"
            value={formData.estimatedTime}
            onChange={handleChange}
          />
        </div>

        <div className="bg-gray-100 border border-gray-200 text-black p-4 rounded-lg">
          <h4 className="text-xl font-semibold text-center mb-2">
            Sélectionnez les classes participantes :
          </h4>
          <select
            multiple
            name="class_idList"
            value={formData.class_idList}
            className="space-y-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={(e) => {
              const selectedClasses = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              )
              setFormData({ ...formData, class_idList: selectedClasses })
            }}>
            {classes.map((classe) => (
              <option
                key={classe.id}
                value={classe.id}
                className={`p-2 bg-gray-200 rounded-md text-center font-medium ${
                  formData.class_idList.includes(classe.id)
                    ? "bg-blue-500 text-white"
                    : ""
                }`}>
                {classe.name}
              </option>
            ))}
          </select>
        </div>

        {loading && <span className="loading loading-bars loading-md"></span>}

        <div className="flex gap-4">
          <button
            type="submit"
            className="btn btn-success text-white"
            disabled={loading}>
            Mettre à jour
          </button>
          <button
            type="button"
            onClick={() => {
              onCancel()
              setFormData({
                estimatedTime: "",
                class_idList: [],
              })
            }}
            className="btn btn-soft">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

UpdateRun.propTypes = {
  index: PropTypes.number.isRequired,
  run: PropTypes.object.isRequired,
  setRuns: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  classes: PropTypes.array.isRequired,
}
