const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  department: { type: String, required: true },
  date: { type: Date, required: true },
  report: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  patientId: { type: String, required: true, unique: true },
  contact: String,
  demographics: {},
  medicalRecords: [medicalRecordSchema]
});

module.exports = mongoose.model('Patient', patientSchema);
