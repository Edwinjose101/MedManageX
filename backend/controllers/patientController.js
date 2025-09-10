const Patient = require('../models/Patient');

exports.getPatient = async (req, res) => {
  try {
    const searchId = req.params.id;
    const department = req.query.department;

    const patient = await Patient.findOne({
      $or: [
        { patientId: searchId },
        { name: { $regex: searchId, $options: 'i' } }
      ]
    });

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    let records = patient.medicalRecords;
    if (department) {
      records = records.filter(rec => rec.department === department);
    }

    res.json({ ...patient.toObject(), medicalRecords: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { patientId, name, contact, medicalRecords } = req.body;

    const existingPatient = await Patient.findOne({ patientId });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient ID already exists' });
    }

    const newPatient = new Patient({
      patientId,
      name,
      contact,
      medicalRecords: medicalRecords || []
    });

    await newPatient.save();

    res.status(201).json(newPatient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addMedicalRecord = async (req, res) => {
  try {
    const patientId = req.params.id;
    const { department, report, date } = req.body;

    const patient = await Patient.findOne({ patientId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    patient.medicalRecords.push({ department, report, date: date || new Date() });

    await patient.save();

    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
