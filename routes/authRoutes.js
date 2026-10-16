require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

// Account Registration
router.post("/user", async (req, res) => {
  const { username, password, email, firstName, lastName, accessCode } =
    req.body;

  if (!username || !password || !email || !firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "Missing required registration fields" });
  }

  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ error: "Username is already taken" });

    // --- Password security. Salt and hash password before sending it to the DB.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = accessCode === "BATMAN123" ? "teacher" : "student";
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      role: userRole,
    });
    await newUser.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failure" });
  }
});

// User Login and Validation
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ error: "Incorrect Username or Password" });

    // Decryption of password salt. Compare hash values to determine password match.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Incorrect Username or Password" });

    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.encode(payload, JWT_SECRET);
    res.json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token,
      auth: 1,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failure" });
  }
});

module.exports = router;
