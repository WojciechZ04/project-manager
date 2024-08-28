import React, { useEffect, useState } from "react";
import TaskColumn from "./components/TaskColumn";
import "./Tasks.css";
import { BASE_URL } from "../../config";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(`${BASE_URL}/api/tasks`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const notStartedTasks = tasks
    ? tasks.filter((task) => task.status === "Not started")
    : [];
  const inProgressTasks = tasks
    ? tasks.filter((task) => task.status === "In progress")
    : [];
  const doneTasks = tasks ? tasks.filter((task) => task.status === "Done") : [];

  return (
    <div className="container">
      <div className="title">
        <h1>Your Tasks</h1>
      </div>
      <div className="control-panel"></div>
      <div className="task-columns">
        <TaskColumn
          value="Not started"
          tasks={notStartedTasks}
          fetchTasks={fetchTasks}
        />
        <TaskColumn
          value="In progress"
          tasks={inProgressTasks}
          fetchTasks={fetchTasks}
        />
        <TaskColumn 
          value="Done" 
          tasks={doneTasks} 
          fetchTasks={fetchTasks} 
        />
      </div>
    </div>
  );
}
