const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Training', trainingSchema);
