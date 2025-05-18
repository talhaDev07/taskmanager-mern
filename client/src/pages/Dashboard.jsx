import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "../styles/Dashboard.css";

function Dashboard() {
	const [tasks, setTasks] = useState([]);
	const [filter, setFilter] = useState("all");
	const [isLoaded, setIsLoaded] = useState(false);
	const [stats, setStats] = useState({ total: 0, completed: 0, remaining: 0 });

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const res = await axios.get("/api/tasks");
				console.log("Fetched tasks:", res.data); // Optional for debugging

				if (Array.isArray(res.data)) {
					setTasks(res.data);
				} else {
					console.error("Expected tasks array but got:", res.data);
					setTasks([]);
				}
				setIsLoaded(true);
			} catch (err) {
				console.error("Failed to fetch tasks:", err);
				setTasks([]); // fallback to safe default
			}
		};
		fetchTasks();
	}, []);

	useEffect(() => {
		if (!Array.isArray(tasks)) return;

		const completed = tasks.filter((t) => t.completed).length;
		setStats({
			total: tasks.length,
			completed,
			remaining: tasks.length - completed,
		});
	}, [tasks]);

	const handleTaskCreated = (task) => {
		setTasks((prev) => [...prev, task]);
		setTimeout(() => {
			const taskItems = document.querySelectorAll(".task-item");
			if (taskItems.length > 0) {
				taskItems[taskItems.length - 1].classList.add("task-added");
			}
		}, 10);
	};

	const clearCompleted = async () => {
		const completedTasks = tasks.filter((t) => t.completed);
		for (const task of completedTasks) {
			try {
				const taskItem = document.querySelector(
					`.task-item[data-id="${task._id}"]`
				);
				if (taskItem) taskItem.classList.add("task-removed");
				await axios.delete(`/api/tasks/${task._id}`);
			} catch (err) {
				console.error("Failed to delete task:", err);
			}
		}
		setTimeout(() => {
			setTasks((prev) => prev.filter((t) => !t.completed));
		}, 300);
	};

	const filteredTasks = Array.isArray(tasks)
		? tasks.filter((task) => {
				if (filter === "active") return !task.completed;
				if (filter === "completed") return task.completed;
				return true;
		  })
		: [];

	return (
		<div className={`dashboard-container ${isLoaded ? "loaded" : ""}`}>
			<div className="dashboard-header">
				<h1>My Tasks</h1>
				<div className="task-stats">
					{["total", "completed", "remaining"].map((key) => (
						<div
							className="stat-item"
							key={key}
						>
							<span className="stat-value">{stats[key]}</span>
							<span className="stat-label">
								{key.charAt(0).toUpperCase() + key.slice(1)}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className="dashboard-content">
				<TaskForm onTaskCreated={handleTaskCreated} />

				<div className="task-filter">
					{["all", "active", "completed"].map((f) => (
						<button
							key={f}
							className={`filter-btn ${filter === f ? "active" : ""}`}
							onClick={() => setFilter(f)}
						>
							{f.charAt(0).toUpperCase() + f.slice(1)}
						</button>
					))}
					{stats.completed > 0 && (
						<button
							className="clear-btn"
							onClick={clearCompleted}
						>
							Clear Completed
						</button>
					)}
				</div>

				<TaskList
					tasks={filteredTasks}
					setTasks={setTasks}
				/>

				{filteredTasks.length === 0 && (
					<div className="empty-state">
						<div className="empty-icon">📝</div>
						<p>
							{filter === "all"
								? "You have no tasks yet. Add one above!"
								: filter === "active"
								? "No active tasks remaining. Great job!"
								: "No completed tasks yet."}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default Dashboard;
