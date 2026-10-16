const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const authenticateToken = require("../middleware/auth");

/**
 * =======================
 *  PUBLIC COURSE ROUTES
 * =======================
 */

//  READ ALL - GET: Grabs all course objects. (Public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "createdBy",
      "firstName lastName email",
    );
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ONE DETAILED COURSE - GET: Fetches one course object populated with teacher name and email from JOIN REFERENCE User schema.
router.get("/detail/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "createdBy",
      "firstName lastName email",
    );

    if (!course) {
      return res
        .status(404)
        .json({ error: "Course not found in school catalog." });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ========================
 *  TEACHER COURSE ROUTES
 * ========================
 */

// READ ALL FILTERED (TEACHER) - GET: Fetches only the signed in teacher's classes.
router.get("/teacher", authenticateToken, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Not Authorized" });
  }

  try {
    const courses = await Course.find({ createdBy: req.user.userId }).populate(
      "students",
      "firstName lastName email username",
    );

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE COURSE - POST: Teachers create new course.
router.post("/", authenticateToken, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Not Authorized" });
  }

  try {
    const newCourse = new Course({ ...req.body, createdBy: req.user.userId });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE COURSE - PUT: Teachers update courses they own.
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }
    if (course.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not Authorized" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE COURSE - DELETE: Teachers may delete courses that they own.
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }
    if (course.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not Authorized" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course removed from catalog." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
