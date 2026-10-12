const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  description: { type: String, required: true },
  subjectArea: { type: String, required: true },
  credits: { type: Number, required: true },
  courseNumber: { type: String, required: true },
  semester: {
    type: String,
    required: true,
    enum: ["Fall", "Spring", "Summer"],
  },
  // Building relationship with User Schema to grab Teacher Obj ID.
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // Delete after successful implementation of user schema logic.
  // createdBy: { type: String, required: true },
});

module.exports = mongoose.model("Course", CourseSchema);
