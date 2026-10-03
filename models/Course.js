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
  //   createdBy: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: true,
  //   },
  createdBy: { type: String, required: true },
});

module.exports = mongoose.model("Course", CourseSchema);
