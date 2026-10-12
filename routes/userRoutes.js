const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");

// GET /api/users/schedule --- Fetches logged in student's saved schedule. (enrolledCourses)
router.get("/schedule", authenticateToken, async (req, res) => {
  try {
    const studentData = await User.findById(req.user.userId).populate(
      "enrolledCourses",
    );
    res.json(studentData.enrolledCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/schedule --- Updates student schedule with saved changes. (enrolledCourses)
router.put("/schedule", authenticateToken, async (req, res) => {
  try {
    const updatedStudent = await User.findByIdAndUpdate(
      req.user.userId,
      { enrolledCourses: req.body.courseIds },
      { new: true },
    ).populate("enrolledCourses");

    res.json(updatedStudent.enrolledCourses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
