const promisePool = require("../database");
const jwt = require("jsonwebtoken");

const TOKEN_SECRET = "your_secret_key";


exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = "SELECT * FROM users WHERE username = ?";
    const [users] = await promisePool.query(query, [username]);

    if (users.length > 0) {
      const user = users[0];
      if (password === user.password) {
        const token = jwt.sign({ userId: user.id }, TOKEN_SECRET, {
          expiresIn: "1h",
        });
        res.json({ message: "Login successful", token: token });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const [result] = await promisePool.query(query, [
      username,
      email,
      password,
    ]);
    const token = jwt.sign({ userId: result.insertId }, TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Signup successful", token: token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
