const ReevaluationRequest = require('../models/ReevaluationRequest');

// Create a new re-evaluation request (student)
exports.createRequest = async (req, res) => {
  try {
    const { marks, subject, reason } = req.body;
    const student = req.user.id;
    const request = new ReevaluationRequest({ student, marks, subject, reason });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all re-evaluation requests (admin)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ReevaluationRequest.find().populate('student').populate('marks');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get requests by student (student)
exports.getRequestsByStudent = async (req, res) => {
  try {
    const requests = await ReevaluationRequest.find({ student: req.user.id }).populate('marks');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update request status (admin)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;
    const request = await ReevaluationRequest.findByIdAndUpdate(
      req.params.id,
      { status, adminRemark },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 