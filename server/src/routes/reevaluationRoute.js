const express = require('express');
const router = express.Router();
const reevaluationController = require('../controllers/reevaluationController');
const { protect, authorize } = require('../middleware/auth');

// Student: Create re-evaluation request
router.post('/', protect, authorize(['student']), reevaluationController.createRequest);
// Admin: Get all re-evaluation requests
router.get('/', protect, authorize(['admin']), reevaluationController.getAllRequests);
// Student: Get own re-evaluation requests
router.get('/my', protect, authorize(['student']), reevaluationController.getRequestsByStudent);
// Admin: Update request status
router.patch('/:id/status', protect, authorize(['admin']), reevaluationController.updateRequestStatus);

module.exports = router; 