import { useState } from "react";
import axios from "axios";

const TaskForm = ({ onTaskCreated }) => {
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState("medium");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim()) {
			setError("Task cannot be empty");
			return;
		}
		// test
		try {
			const res = await axios.post("/api/tasks", {
				title: title.trim(),
				priority,
				completed: false,
			});
			onTaskCreated(res.data);
			setTitle("");
			setPriority("medium");
			setError("");

			const formElement = document.querySelector(".task-form");
			if (formElement) {
				formElement.classList.add("form-submitted");
				setTimeout(() => formElement.classList.remove("form-submitted"), 500);
			}
		} catch (err) {
			console.error("Failed to create task:", err);
			setError("Error creating task");
		}
	};

	return (
		<>
			<form
				className="task-form"
				onSubmit={handleSubmit}
			>
				<input
					type="text"
					className="task-input"
					placeholder="Add a new task..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onFocus={() => setError("")}
				/>
				<select
					className="priority-select"
					value={priority}
					onChange={(e) => setPriority(e.target.value)}
				>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</select>
				<button
					className="task-submit"
					type="submit"
				>
					Add
				</button>
			</form>
			{error && <div className="error">{error}</div>}
		</>
	);
};

export default TaskForm;
