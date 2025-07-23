const Marks = require("../models/Marks");
const User = require("../models/User");

// Admin: Create marks for a student
exports.createMarks = async (req, res) => {
  try {
    const { studentId, subject, marks, grade, remarks } = req.body;
    if (!studentId || !subject || marks === undefined || !grade) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }
    const newMarks = new Marks({ student: studentId, subject, marks, grade, remarks });
    await newMarks.save();
    // Optionally, add marks to student's marks array
    student.marks.push(newMarks._id);
    await student.save();
    res.status(201).json(newMarks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Update marks for a student
exports.updateMarks = async (req, res) => {
  try {
    const { marksId } = req.params;
    const updates = req.body;
    const updatedMarks = await Marks.findByIdAndUpdate(marksId, updates, { new: true });
    if (!updatedMarks) return res.status(404).json({ message: "Marks not found" });
    res.json(updatedMarks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Delete marks for a student
exports.deleteMarks = async (req, res) => {
  try {
    const { marksId } = req.params;
    const marks = await Marks.findByIdAndDelete(marksId);
    if (!marks) return res.status(404).json({ message: "Marks not found" });
    // Optionally, remove marks from student's marks array
    await User.updateOne({ _id: marks.student }, { $pull: { marks: marksId } });
    res.json({ message: "Marks deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Student: View own marks (handled in studentController as well)
exports.getMarksByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const marks = await Marks.find({ student: studentId });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
