import React from "react";
import PropTypes from "prop-types";

const RunCardAdmin = ({
  id,
  time,
  className,
  setShowUpdateRun,
  deleteRuns,
  run,
}) => {
  // Determine run status
  const getRunStatus = () => {
    console.log(run);
    if (run.startTime !== null) {
      if (run.endTime !== null) {
        return 2; // Terminée
      }
      return 1; // En cours
    }
    return 0; // Pas encore commencée
  };

  const renderStatusMessage = () => {
    if (status === 2) {
      return (
        <p className="text-center text-xl font-semibold text-green-500">
          Terminée !
        </p>
      );
    } else if (status === 1) {
      return (
        <p className="text-center text-xl font-semibold text-blue-500">
          En cours...
        </p>
      );
    } else {
      return (
        <p className="text-lg text-center mb-4">
          ⏳ Heure de départ estimée :{" "}
          <span className="font-semibold">{time}</span>
        </p>
      );
    }
  };

  const status = getRunStatus();
  return (
    <div
      className={`text-black shadow-lg rounded-xl p-6 mx-auto w-full max-w-md transition-transform duration-300 text-left border-none cursor-default relative space-y-4`}>
      {/* Edit & Bin */}
      <div className="absolute top-0 right-0 p-2 flex space-x-2">
        <svg
          onClick={() => setShowUpdateRun(id)}
          className="w-6 h-6 text-blue-500 cursor-pointer"
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
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>

        <svg
          onClick={() => document.getElementById(`my_modal_${id}`).showModal()}
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
      <h3 className="text-2xl font-bold text-center mb-4">Course #{id}</h3>
      {renderStatusMessage()}
      <div className="bg-gray-100 border border-gray-200 text-black p-4 rounded-lg">
        <h4 className="text-xl font-semibold text-center mb-2">
          Classes participantes :
        </h4>
        <ul className="space-y-2">
          {className.map((classe) => (
            <li
              key={classe}
              className="p-2 bg-gray-200 rounded-md text-center font-medium">
              {classe}
            </li>
          ))}
        </ul>
      </div>
      <dialog
        id={`my_modal_${id}`}
        className="modal">
        <div className="modal-box border-2 border-blue-500">
          <h3 className="font-bold text-lg text-blue-500">
            Suppression de la course <span className="font-extrabold">#{id}</span>
          </h3>
          <hr className="text-blue-500 mt-2" />
          <p className="py-4">
            Êtes-vous sûr de vouloir supprimer cette course ?
          </p>
          <p className="text-red-500 font-bold">
            Les classes participantes seront définitivement supprimées du
            classement si la course est terminée.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <div className="space-x-4">
                <button
                  onClick={() => deleteRuns(id)}
                  className="btn btn-outline btn-error">
                  Supprimer
                </button>
                <button className="btn">Annuler</button>
              </div>
              <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2 text-blue-500">
                ✕
              </button>
            </form>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};
RunCardAdmin.propTypes = {
  id: PropTypes.number,
  time: PropTypes.string,
  className: PropTypes.array,
  setShowUpdateRun: PropTypes.func,
  deleteRuns: PropTypes.func,
  run: PropTypes.object,
};

export default RunCardAdmin;
