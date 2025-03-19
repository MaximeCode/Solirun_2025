import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function UpdateClass({
  classe,
  setClasses,
  onCancel,
  onSuccess,
  showToast,
}) {
  const [formData, setFormData] = useState({
    name: "",
    nbStudents: 0,
  });
  const [loading, setLoading] = useState(false); // true => Afficher the loader, false => Ne rien afficher

  useEffect(() => {
    if (classe) {
      setFormData({
        name: classe.name || "",
        nbStudents: classe.nbStudents || 0,
      });
    }
  }, [classe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Update de la classe ds la list des classes avant l'envoi vers la db
  const updateClass = () => {
    setLoading(true);
    setClasses((prevClasses) => {
      return prevClasses.map((cl) => {
        if (cl.id === classe.id) {
          return {
            ...cl,
            name: formData.name,
            nbStudents: formData.nbStudents,
          };
        }
        return cl;
      });
    });
    setLoading(false);
    showToast(`Classe ${formData.name} mise à jour avec succès`, false);
    onSuccess();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateClass();
  };

  return (
    <div className="w-100 mx-auto space-y-6 border border-gray-200 rounded-lg shadow-sm p-6 ${updateStatus != null ? 'hidden' : 'block'}">
      <h2 className="text-2xl font-bold text-left">
        Modifier la classe {classe.name}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4">
        <input
          type="hidden"
          name="classId"
          value={classe.id}
        />
        <div>
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

        <div>
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
            onClick={() => onCancel()}
            className="btn btn-soft">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

UpdateClass.propTypes = {
  classe: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    nbStudents: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  setClasses: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
};
