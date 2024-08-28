const promisePool = require("../database");

exports.getTasks = async (req, res) => {
  const userId = req.userId;
  try {
    const sql = `
      SELECT tasks.*, projects.name AS project_name
      FROM tasks
      LEFT JOIN projects ON tasks.project_id = projects.id
      WHERE projects.user_id = ?
    `;
    const [tasks] = await promisePool.query(sql, [userId]);
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createTask = async (req, res) => {
  const { name, description, projectId, deadline, status } = req.body;

  try {
    const sql =
      "INSERT INTO tasks (name, description, project_id, deadline, status) VALUES (?, ?, ?, ?, ?)";
    const values = [name, description, projectId, deadline, status];
    const [result] = await promisePool.query(sql, values);

    const insertedTask = {
      id: result.insertId,
      name,
      description,
      projectId,
      deadline,
      status,
    };

    res.status(201).json(insertedTask);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTask = async (req, res) => {
  const { projectId, taskId } = req.params;

  try {
    const sql = "DELETE FROM tasks WHERE id = ? AND project_id = ?";
    const values = [taskId, projectId];
    const [result] = await promisePool.query(sql, values);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: `Task ${taskId} deleted successfully.` });
    } else {
      res.status(404).json({ message: "Task not found." });
    }
  } catch (err) {
    console.error("Error deleting task from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const sql = "UPDATE tasks SET status = ? WHERE id = ?";
    const values = [status, taskId];
    const [result] = await promisePool.query(sql, values);

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: `Task ${taskId} updated successfully.` });
    } else {
      res.status(404).json({ message: "Task not found." });
    }
  } catch (err) {
    console.error("Error completing task from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
