const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

//  READ ALL - GET: Grabs all course objects.
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE - GET: Grabs one course object.
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE - POST: Adds new courses (teachers only!!!)
router.post("/", async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE - PUT: Edits existing courses (teachers only!!!)
router.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found." });
    }
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DESTROY - DELETE: Removes existing courses (teachers only!!!)
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found." });
    }
    res.json(deletedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
