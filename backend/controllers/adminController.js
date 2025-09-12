const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Admin getAllUsers error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// List all unapproved doctors
exports.getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await User.find({ role: 'doctor', isApproved: false }).select('-password');
    res.json(pendingDoctors);
  } catch (err) {
    console.error('Error fetching pending doctors:', err);
    res.status(500).send('Server error');
  }
};

// Approve a doctor by ID
exports.approveDoctor = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    doctor.isApproved = true;
    await doctor.save();
    res.json({ msg: 'Doctor approved successfully' });
  } catch (err) {
    console.error('Error approving doctor:', err);
    res.status(500).send('Server error');
  }
};

// Optional: Reject or delete a pending doctor registration
exports.rejectDoctor = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    await doctor.deleteOne();
    res.json({ msg: 'Doctor registration rejected and deleted' });
  } catch (err) {
    console.error('Error rejecting doctor:', err);
    res.status(500).send('Server error');
  }
};
