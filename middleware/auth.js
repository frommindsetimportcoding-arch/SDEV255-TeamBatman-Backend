require("dotenv").config();
const jwt = require("jwt-simple");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.headers["x-auth"];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Access denied. Missing x-auth token." });
  }

  try {
    // Decode token using JWT_SECRET
    const decoded = jwt.decode(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).json({ error: "Session expired or invalid token." });
  }
};

module.exports = authenticateToken;
