import React from "react";
import PropTypes from "prop-types";

export default function FormRuns({
	runs,
	classes,
	newRuns,
	setNewRuns,
	saveRun,
	onCancel,
}) {
	return (
		<div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm relative flex flex-col space-y-4">
			<div className="text-black shadow-xl rounded-xl p-6 mx-auto w-full max-w-md text-center">
				<h3 className="text-2xl font-bold text-center mb-4">
					Course #{runs.length + 1}
				</h3>
				<div>
					<label
						className="text-lg font-semibold text-center mb-4"
						htmlFor="estimatedTime"
					>
						⏳ Heure de départ estimée :
					</label>
					<input
						type="time"
						id="estimatedTime"
						className="w-3/4 mx-auto mb-4 text-lg text-gray-900 border-b-2 border-gray-200 input input-ghost pl-4"
						onChange={(e) =>
							setNewRuns({ ...newRuns, estimatedTime: e.target.value })
						}
					/>
				</div>
				<div className="bg-gray-100 border border-gray-200 text-black p-4 rounded-lg">
					<h4 className="text-xl font-semibold text-center mb-2">
						Sélectionnez les classes participantes :
					</h4>
					<select
						multiple
						className="space-y-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						onChange={(e) => {
							const selectedClasses = Array.from(
								e.target.selectedOptions,
								(option) => option.value
							);
							setNewRuns({ ...newRuns, classList: selectedClasses });
						}}
					>
						{classes.map((classe) => (
							<option
								key={classe.id}
								value={classe.id}
								className="p-2 bg-gray-200 rounded-md text-center font-medium"
							>
								{classe.name}
							</option>
						))}
					</select>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-4">
					<button
						className="btn btn-success"
						onClick={() => {
							if (
								newRuns.estimatedTime === "" ||
								newRuns.classList.length === 0
							) {
								alert("Veuillez remplir tous les champs");
								return;
							}
							saveRun(newRuns);
						}}
					>
						Ajouter
					</button>

					<button
						className="btn btn-soft"
						onClick={() => onCancel()}
					>
						Annuler
					</button>
				</div>
			</div>
		</div>
	);
}

FormRuns.propTypes = {
	runs: PropTypes.array.isRequired,
	classes: PropTypes.array.isRequired,
	newRuns: PropTypes.object.isRequired,
	setNewRuns: PropTypes.func.isRequired,
	saveRun: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};
