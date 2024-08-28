import "./TaskColumn.css";
import Task from "./Task";
import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";

export default function TaskColumn(props) {
  const [open, setOpen] = useState(false);
  const taskStatus = props.value;
  const handleOpen = () => setOpen(true);

  

  const className =
    props.value === "Not started"
      ? "column to-do-column"
      : props.value === "In progress"
      ? "column in-progress-column"
      : props.value === "Done"
      ? "column done-column"
      : "column default-column";

  return (
    <div className={className}>
      <h2 className="label">{props.value}</h2>
      <hr />

      {props.tasks.map((task, index) => (
        <Task
          className={className}
          key={index}
          task={task}
          fetchTasks={props.fetchTasks}
        />
      ))}

      <div className="create-task-section" onClick={handleOpen}>
        <p>Add a Task</p>
        <i className="material-icons">add</i>
      </div>
      <CreateTaskModal open={open} setOpen={setOpen} taskStatus={taskStatus} fetchTasks={props.fetchTasks}/>
    </div>
  );
}
