import React from "react";
import PropTypes from "prop-types";

export default function ToggleShowTeacher({ showTeacher, setShowTeacher }) {
	return (
		<div className="flex justify-center items-center space-x-2 my-4">
			<input
				id="showTeacher"
				type="checkbox"
				className="toggle toggle-success checked:bg-green-200"
				checked={showTeacher}
				onChange={(e) => setShowTeacher(e.target.checked)}
			/>
			<label
				htmlFor="showTeacher"
				className={`text-md font-medium text-gray-900 text-balance`}
			>
				Afficher les équipes d'{showTeacher ? "élèves" : "enseignants"}
			</label>
		</div>
	);
}

ToggleShowTeacher.propTypes = {
	showTeacher: PropTypes.bool.isRequired,
	setShowTeacher: PropTypes.func.isRequired,
};
