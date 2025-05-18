import React from "react";
import axios from "axios";

function TaskList({ tasks = [], setTasks }) {
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleToggle = async (task) => {
		try {
			const res = await axios.put(`/api/tasks/${task._id}`, {
				...task,
				completed: !task.completed,
			});
			setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
		} catch (err) {
			console.error("Failed to update task:", err);
		}
	};

	const handleDelete = async (taskId) => {
		try {
			await axios.delete(`/api/tasks/${taskId}`);
			setTasks((prev) => prev.filter((t) => t._id !== taskId));
		} catch (err) {
			console.error("Failed to delete task:", err);
		}
	};

	return (
		<ul className="task-list">
			{tasks.map((task) => (
				<li
					key={task._id}
					className={`task-item ${task.completed ? "done" : ""}`}
					data-id={task._id}
				>
					<input
						type="checkbox"
						className="task-checkbox"
						checked={task.completed}
						onChange={() => handleToggle(task)}
					/>
					<div className="task-content">
						<span className="task-text">{task.title}</span>
						<div className="task-meta">
							{task.createdAt && (
								<span className="task-date">{formatDate(task.createdAt)}</span>
							)}
							<span
								className={`task-priority priority-${
									task.priority || "medium"
								}`}
							>
								{task.priority || "Medium"}
							</span>
						</div>
					</div>
					<div className="task-actions">
						<button
							className="task-btn delete-btn"
							onClick={() => handleDelete(task._id)}
							aria-label="Delete task"
						>
							×
						</button>
					</div>
				</li>
			))}
		</ul>
	);
}

export default TaskList;
