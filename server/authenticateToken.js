const jwt = require("jsonwebtoken");

const TOKEN_SECRET = "your_secret_key";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.userId = user.userId;
    next();
  });
};

module.exports = authenticateToken;
