import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ToggleShowTeacher from "@/Components/ToggleShowTeacher";

export default function UpdateRun({
	index,
	run,
	onCancel,
	showToast,
	classes,
	getAllRuns,
	showTeacher,
	setShowTeacher,
}) {
	console.log("run: ", run);
	useEffect(() => {
		console.log("run: ", run);
	}, []);

	const [formData, setFormData] = useState({
		estimatedTime: run.estimatedTime || "00:00",
		class_idList: run.classIdList || ["Rien"],
	});

	const [loading, setLoading] = useState(false); // true => Afficher the loader, false => Ne rien afficher
	const [searchTerm, setSearchTerm] = useState(""); // State for search input

	useEffect(() => {
		if (formData) {
			console.log("formData: ", formData);
		}
	}, [formData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		updateRun(
			run.id,
			formData.estimatedTime,
			formData.class_idList,
			run.classIdList
		);
	};

	// Function to toggle class selection
	const toggleClass = (classId) => {
		setFormData((prevData) => {
			// Check if the class is already selected
			if (prevData.class_idList.includes(classId)) {
				// Remove the class if already selected
				return {
					...prevData,
					class_idList: prevData.class_idList.filter((id) => id !== classId),
				};
			} else {
				// Add the class if not selected
				return {
					...prevData,
					class_idList: [...prevData.class_idList, classId],
				};
			}
		});
	};

	// Filter classes based on search term and if its student class
	const filteredStudentsClasses = classes.filter(
		(classe) =>
			classe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			!classe.isTeacher
	);

	// Filter classes based on search term and if its teacher class
	const filteredTeacherClasses = classes.filter(
		(classe) =>
			classe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			classe.isTeacher
	);

	const filteredClasses = showTeacher
		? filteredTeacherClasses
		: filteredStudentsClasses;

	// Fonction pour mettre à jour une course dans la DB
	const updateRun = (run_id, estimatedTime, newListId, oldListId) => {
		console.log(" ---- UpdateRun");
		setLoading(true);
		// Envoi des données vers l'API
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/api.php`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				action: "updateRun",
				run_id: run_id,
				estimatedTime: estimatedTime,
				newListId: newListId,
				oldListId: oldListId,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					showToast("Erreur lors de la mise à jour de la course ❌", true);
					throw new Error("Erreur lors de la mise à jour de la course");
				}
				showToast("Course mise à jour avec succès ✅", false);
			})
			.catch((error) => {
				console.error("Erreur:", error);
				showToast(error.message, true);
				setLoading(false);
				throw new Error("Erreur lors de la mise à jour de la course");
			})
			.then(() => {
				console.log(" ---- Fin update");
				setLoading(false);
				setFormData({
					estimatedTime: "",
					class_idList: [],
				});
				onCancel();
				getAllRuns();
			});
	};

	return (
		<div className="w-100 mx-auto space-y-6 bg-info/75 text-white rounded-lg shadow-lg p-6 mb-6 ${updateStatus != null ? 'hidden' : 'block'}">
			<h2 className="text-2xl font-bold text-left">
				Modifier la course #{index}
			</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-4"
			>
				<input
					type="hidden"
					name="runId"
					value={run.id}
				/>
				<div className="mx-auto w-full max-w-md text-center">
					<label
						className="text-lg font-semibold text-center mb-4"
						htmlFor="estimatedTime"
					>
						⏳ Heure de départ estimée :
					</label>
					<input
						type="time"
						id="estimatedTime"
						name="estimatedTime"
						className="w-3/4 mx-auto mb-4 text-lg text-gray-900 bg-gray-100 border-b-2 border-gray-200 input input-ghost pl-4"
						value={formData.estimatedTime}
						onChange={handleChange}
					/>
				</div>

				<div className="bg-gray-100 border border-gray-200 text-black p-4 rounded-lg">
					<h4 className="text-xl font-semibold text-center mb-2">
						Sélectionnez les{" "}
						{showTeacher ? "équipes de professeurs" : "classes d'élèves"}{" "}
						participantes :
					</h4>

					<ToggleShowTeacher
						showTeacher={showTeacher}
						setShowTeacher={setShowTeacher}
					/>

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
									onClick={() => setSearchTerm("")}
								>
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
										formData.class_idList.includes(classe.id.toString())
											? "bg-blue-500 text-white"
											: "bg-gray-200 hover:bg-gray-300"
									}`}
								>
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

				{loading && <span className="loading loading-bars loading-md"></span>}

				<div className="flex gap-4">
					<button
						type="submit"
						className="btn btn-success text-white"
						disabled={loading}
					>
						Mettre à jour
					</button>
					<button
						type="button"
						onClick={() => {
							onCancel();
							setFormData({
								estimatedTime: "",
								class_idList: [],
							});
						}}
						className="btn btn-soft"
					>
						Annuler
					</button>
				</div>
			</form>
		</div>
	);
}

UpdateRun.propTypes = {
	index: PropTypes.number.isRequired,
	run: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
	getAllRuns: PropTypes.func.isRequired,
	showToast: PropTypes.func.isRequired,
	classes: PropTypes.array.isRequired,
	showTeacher: PropTypes.bool.isRequired,
	setShowTeacher: PropTypes.func.isRequired,
};
