const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Student registration (pending approval)
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: "student",
      status: "pending",
      isApproved: false,
      isRejected: false,
    });
    await user.save();
    res.status(201).json({ message: "Registration successful. Awaiting admin approval." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login (for both admin and student)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.role === "student") {
      if (user.status === "pending") {
        return res.status(403).json({ message: "Your registration is pending approval." });
      }
      if (user.status === "rejected") {
        return res.status(403).json({ message: `Registration rejected: ${user.rejectedReason || "No reason provided"}` });
      }
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Get all pending students
exports.getPendingStudents = async (req, res) => {
  try {
    const pendingStudents = await User.find({ role: "student", status: "pending" });
    res.json(pendingStudents);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Approve student registration
exports.approveStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }
    student.status = "approved";
    student.isApproved = true;
    student.isRejected = false;
    student.rejectedReason = undefined;
    await student.save();
    res.json({ message: "Student approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Reject student registration with reason
exports.rejectStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { reason } = req.body;
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }
    student.status = "rejected";
    student.isRejected = true;
    student.isApproved = false;
    student.rejectedReason = reason || "No reason provided";
    await student.save();
    res.json({ message: "Student rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};