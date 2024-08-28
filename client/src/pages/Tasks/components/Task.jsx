import "./Task.css";
import React, { useState } from "react";
import DeleteTaskModal from "./DeleteTaskModal";

export default function Task({ task, fetchTasks }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        fetchTasks(); 
      } else {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status", error);
    }
  };

  return (
    <div className="task">
      <div className="checkbox">
        <label class="checkbox-btn">
          <label for="checkbox"></label>
          <input
            id="checkbox"
            type="checkbox"
            onChange={() => updateTaskStatus(task.id, "Done")}
            checked={task.status === "Done"}
          />
          <span class="checkmark"></span>
        </label>
      </div>
      <div className="task-details">
        <div className="grid">
          <p className="project-assigned">
            {" "}
            {">"}
            {task.project_name}
          </p>
          <h2 className="task__title">{task.name}</h2>
          <p className="task__deadline">
            {" "}
            {task.deadline ? new Date(task.deadline).toLocaleDateString() : ""}
          </p>
        </div>
        <p className="task__description">{task.description}</p>
      </div>

      <div className="task-controls">
        <span onClick={confirmDelete}>
          <i className="material-icons task-icon">close</i>
        </span>
        {task.status === "Not started" && (
          <span
            className="edit-status"
            onClick={() => updateTaskStatus(task.id, "In progress")}
            title="Start Task"
          >
            <i className="material-icons task-icon">arrow_forward</i>
          </span>
        )}
        {task.status === "In progress" && (
          <span
            className="edit-status"
            onClick={() => updateTaskStatus(task.id, "Not started")}
            title="Change status to not started"
          >
            <i className="material-icons task-icon">arrow_back</i>
          </span>
        )}
      </div>

      <DeleteTaskModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        task={task}
        fetchTasks={fetchTasks}
      />
    </div>
  );
}
