const promisePool = require("../database");

exports.getHome = async (req, res) => {
  try {
    const userId = req.userId;
  
    const [users] = await promisePool.query("SELECT * FROM users WHERE id = ?", [userId]);

    const [projects] = await promisePool.query("SELECT * FROM projects WHERE user_id = ?", [userId]);
    
    const [tasks] = await promisePool.query(
      "SELECT * FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE user_id = ?)", [userId]
    );

    const data = {
      users,
      tasks,
      projects,
    };

    res.json(data);
  } catch (error) {
    console.error("Error fetching home data from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
