const express = require("express");
const router = express.Router();
const marksController = require("../controllers/marksController");
const { protect, authorize } = require("../middleware/auth");

// Admin: Create marks for a student
router.post("/", protect, authorize(["admin"]), marksController.createMarks);
// Admin: Update marks
router.patch("/:marksId", protect, authorize(["admin"]), marksController.updateMarks);
// Admin: Delete marks
router.delete("/:marksId", protect, authorize(["admin"]), marksController.deleteMarks);
// Student/Admin: View marks by student
router.get("/student/:studentId", protect, authorize(["admin", "student"]), marksController.getMarksByStudent);

module.exports = router;
