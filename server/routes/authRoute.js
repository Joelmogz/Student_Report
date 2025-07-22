const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

// Student registration
router.post("/register", authController.register);
// Login (admin and student)
router.post("/login", authController.login);

// Admin: Get all pending students
router.get("/pending", protect, authorize(["admin"]), authController.getPendingStudents);
// Admin: Approve student
router.patch("/approve/:studentId", protect, authorize(["admin"]), authController.approveStudent);
// Admin: Reject student
router.patch("/reject/:studentId", protect, authorize(["admin"]), authController.rejectStudent);

module.exports = router;