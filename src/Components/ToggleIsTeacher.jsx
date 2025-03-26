import React from "react";
import PropTypes from "prop-types";

export default function ToggleIsTeacher({ newClass, setNewClass }) {
	return (
		<div className="flex items-center space-x-2 mx-auto">
			<input
				id="isTeacher"
				type="checkbox"
				className="toggle toggle-success checked:bg-green-200"
				checked={newClass.isTeacher}
				onChange={(e) =>
					setNewClass({
						...newClass,
						isTeacher: e.target.checked ? 1 : 0,
					})
				}
			/>
			<label
				htmlFor="isTeacher"
				className={`text-${
					newClass.isTeacher && "success"
				} text-lg font-medium text-gray-900`}
			>
				Sont-ils professeurs ?
			</label>
		</div>
	);
}

ToggleIsTeacher.propTypes = {
	newClass: PropTypes.shape({
		isTeacher: PropTypes.number,
	}).isRequired,
	setNewClass: PropTypes.func.isRequired,
};
