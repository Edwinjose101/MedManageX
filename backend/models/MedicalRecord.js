const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  department: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  createdByRole: {
    type: String,
    enum: ['admin', 'doctor'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
