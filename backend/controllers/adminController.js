const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users excluding passwords
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Admin getAllUsers error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add more admin-specific controller functions as needed
