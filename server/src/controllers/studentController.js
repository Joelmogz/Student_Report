const User = require("../models/User");
const Marks = require("../models/Marks");

// Get own profile (student)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// View own marks (student)
exports.getMyMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.user.id });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Remove student
exports.removeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findByIdAndDelete(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    // Optionally, delete marks associated with the student
    await Marks.deleteMany({ student: studentId });
    res.json({ message: "Student and their marks removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Update student
exports.updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updates = req.body;
    delete updates.password; // Don't allow password update here
    const student = await User.findByIdAndUpdate(studentId, updates, { new: true }).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Get one student
exports.getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId).select("-password");
    if (!student || student.role !== "student") return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Give remarks for marks
exports.giveRemarks = async (req, res) => {
  try {
    const { marksId } = req.params;
    const { remarks } = req.body;
    const marks = await Marks.findByIdAndUpdate(marksId, { remarks }, { new: true });
    if (!marks) return res.status(404).json({ message: "Marks not found" });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
