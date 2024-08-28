const promisePool = require("../database");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const [profile] = await promisePool.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { username, email, password } = req.body;

  try {
    const query = `
		UPDATE users
		SET username = ?, email = ?, password = ?
		WHERE id = ?
	  `;
    await promisePool.query(query, [username, email, password, userId]);
    const [updatedProfile] = await promisePool.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    res.json(updatedProfile[0]);
  } catch (err) {
    console.error("Error updating profile in database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteProfile = async (req, res) => {
  const userId = req.userId;

  try {
    await promisePool.query("DELETE FROM users WHERE id = ?", [userId]);
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting profile from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
