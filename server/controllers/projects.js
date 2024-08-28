const promisePool = require("../database");

exports.getProjects = async (req, res) => {
  try {
    const userId = req.userId;
    const query = `
      SELECT 
        p.id AS project_id, 
        p.name AS project_name, 
        p.deadline AS project_deadline, 
        p.description AS project_description,
        t.id AS task_id, 
        t.name AS task_name, 
        t.deadline AS task_deadline, 
        t.description AS task_description,
        t.status AS task_status
      FROM 
        projects p
      LEFT JOIN 
        tasks t 
      ON 
        p.id = t.project_id
      WHERE 
        p.user_id = ?
    `;
    const [projectsWithTasks] = await promisePool.query(query, [userId]);

    const projects = projectsWithTasks.reduce((acc, row) => {
      const project = acc.find((p) => p.id === row.project_id);
      if (project) {
        project.tasks.push({
          id: row.task_id,
          name: row.task_name,
          deadline: row.task_deadline,
          description: row.task_description,
          status: row.task_status,
        });
      } else {
        acc.push({
          id: row.project_id,
          name: row.project_name,
          deadline: row.project_deadline,
          description: row.project_description,
          tasks: row.task_id
            ? [
                {
                  id: row.task_id,
                  name: row.task_name,
                  deadline: row.task_deadline,
                  description: row.task_description,
                  status: row.task_status,
                },
              ]
            : [],
        });
      }
      return acc;
    }, []);

    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createProject = async (req, res) => {
  const { name, deadline, description } = req.body;
  const userId = req.userId;


  try {
    const sql =
      "INSERT INTO projects (name, deadline, description, user_id) VALUES (?, ?, ?, ?)";
    const values = [name, deadline, description, userId];
    const [result] = await promisePool.query(sql, values);

    const insertedProject = {
      id: result.insertId,
      name,
      deadline,
      description,
    };

    res.status(201).json(insertedProject);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProject = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.userId;

  try {
    const [projects] = await promisePool.query(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?",
      [projectId, userId]
    );

    if (projects.length === 0) {
      res.status(403).json();
      return;
    }

    const project = projects[0];

    const [tasks] = await promisePool.query(
      "SELECT * FROM tasks WHERE project_id = ?",
      [projectId]
    );

    const response = {
      ...project,
      tasks: tasks,
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching project from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    await promisePool.query("DELETE FROM tasks WHERE project_id = ?", [
      projectId,
    ]);
    await promisePool.query("DELETE FROM projects WHERE id = ?", [projectId]);

    res.status(204).end();
  } catch (err) {
    console.error("Error deleting project from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.editProject = async (req, res) => {
  const { projectId } = req.params;
  const { name } = req.body;
  const { deadline } = req.body;
  const { description } = req.body;

  try {
    const [result] = await promisePool.query(
      "UPDATE projects SET name = ?, deadline = ?, description = ? WHERE id = ?",
      [name, deadline, description, projectId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project updated successfully" });
  } catch (err) {
    console.error("Error updating project in database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
