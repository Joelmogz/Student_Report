const mongoose = require('mongoose');

const reevaluationRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  marks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marks',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminRemark: {
    type: String,
  },
}, { timestamps: true });

const ReevaluationRequest = mongoose.model('ReevaluationRequest', reevaluationRequestSchema);

module.exports = ReevaluationRequest; 