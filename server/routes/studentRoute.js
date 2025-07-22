const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/auth");

// Student: Get own profile
router.get("/me", protect, authorize(["student"]), studentController.getProfile);
// Student: View own marks
router.get("/me/marks", protect, authorize(["student"]), studentController.getMyMarks);

// Admin: Remove student
router.delete("/:studentId", protect, authorize(["admin"]), studentController.removeStudent);
// Admin: Update student
router.patch("/:studentId", protect, authorize(["admin"]), studentController.updateStudent);
// Admin: Get all students
router.get("/", protect, authorize(["admin"]), studentController.getAllStudents);
// Admin: Get one student
router.get("/:studentId", protect, authorize(["admin"]), studentController.getStudentById);
// Admin: Give remarks for marks
router.patch("/marks/:marksId/remarks", protect, authorize(["admin"]), studentController.giveRemarks);

module.exports = router;
