import React, { useState, useEffect } from "react";
import { Box, Button, Modal, MenuItem, Select, Checkbox, TextField } from "@mui/material";
import "../../../components/Modal.css";
export default function CreateTaskModal({
  open,
  setOpen,
  taskStatus,
  fetchTasks,
}) {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [hasDeadline, setHasDeadline] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/projects", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, []);

  if (!open) return null;
  const handleCreateTask = async () => {
    if (!taskName.trim()) {
      setError('Task name cannot be empty');
      return;
    }

    const response = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: taskName,
        description: taskDescription,
        projectId: projectId,
        status: taskStatus,
        deadline: hasDeadline ? taskDeadline : null,
      }),
    });

    if (response.ok) {
      handleClose();
      setTaskName("");
      setTaskDescription("");
      setProjectId("");
      setTaskDeadline("");
      fetchTasks();
    } else {
      console.error("Failed to create task");
    }
  };

  const handleClose = () => {
    setOpen(false)
    setError('');
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-name"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal">
        <h2>Create task</h2>
        <TextField
          label="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <br />
        <Select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Project
          </MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
        <br />
        <label className="custom-checkbox">
          <Checkbox
            checked={hasDeadline}
            onChange={(e) => setHasDeadline(e.target.checked)}
            sx={{
              color: "var(--neutral-color)",
              "&.Mui-checked": {
                color: "var(--neutral-color)",
              },
            }}
          />
          <span>Set a finish date</span>
        </label>
        {hasDeadline && (
          <TextField
            sx={{ marginTop: "10px" }}
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
          />
        )}
        <br />
        <TextField
          multiline
          minRows={4}
          maxRows={6}
          label="Descripion (optional)"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <div className="modal-buttons">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateTask}>Create</Button>
        </div>
      </Box>
    </Modal>
  );
}
