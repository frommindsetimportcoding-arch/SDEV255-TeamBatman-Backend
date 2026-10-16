const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
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
  // req.user.userId (userId comes from the x-auth token payload after being decoded by the middleware auth.js)
  // newCourseId is assigned an array of selected hex IDs that come from the ScheduleBuilder cart (userState array from React).
  const studentId = req.user.userId;
  const newCourseIds = req.body.courseIds;

  try {
    // Clear this student out of any of the Teachers' course rosters they just dropped.
    await Course.updateMany(
      { students: studentId },
      { $pull: { students: studentId } },
    );

    // Push this student into the Teachers' course rosters of selected classes
    if (newCourseIds && newCourseIds.length > 0) {
      await Course.updateMany(
        { _id: { $in: newCourseIds } },
        { $addToSet: { students: studentId } }, // $addToSet prevents duplecat entries using the 'unique' property traditional to a set and applying it against an array.
      );
    }

    // Update the student's personal profile enrolledCourses array.
    const updatedStudent = await User.findByIdAndUpdate(
      req.user.userId,
      { enrolledCourses: req.body.courseIds },
      { new: true },
    ).populate("enrolledCourses");

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    res.json(updatedStudent.enrolledCourses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
