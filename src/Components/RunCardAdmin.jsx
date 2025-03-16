import React from "react"
import PropTypes from "prop-types"

const RunCardAdmin = ({
  id,
  idTxt,
  time,
  className,
  setShowUpdateRun,
  deleteRuns,
}) => {
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
          onClick={() => deleteRuns(id)}
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
      <h3 className="text-2xl font-bold text-center mb-4">Course #{idTxt}</h3>
      <p className="text-lg text-center mb-4">
        ⏳ Heure de départ estimée :{" "}
        <span className="font-semibold">{time}</span>
      </p>
      <div className="bg-gray-100 border border-gray-200 text-black p-4 rounded-lg">
        <h4 className="text-xl font-semibold text-center mb-2">
          Classes participantes :
        </h4>
        <ul className="space-y-2">
          {className.map((classe, index) => (
            <li
              key={index}
              className="p-2 bg-gray-200 rounded-md text-center font-medium">
              {classe}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
RunCardAdmin.propTypes = {
  id: PropTypes.number,
  idTxt: PropTypes.number,
  time: PropTypes.string,
  className: PropTypes.array,
  setShowUpdateRun: PropTypes.func,
  deleteRuns: PropTypes.func,
}

export default RunCardAdmin
