const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, email, password, phone, address, dob, age, gender, bloodGroup } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already in use' });

    const newUser = new User({
      fullName,
      email,
      password, // plain text password (not recommended)
      phone,
      address,
      dob,
      age,
      gender,
      bloodGroup,
      role: 'patient',
      isApproved: true, // patients auto-approved
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).send('Server error');
  }
};

exports.registerDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    fullName, email, password, phone, address,
    dob, age, gender, bloodGroup, specialty
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already in use' });

    const newUser = new User({
      fullName,
      email,
      password, // plain text password (not recommended)
      phone,
      address,
      dob,
      age,
      gender,
      bloodGroup,
      role: 'doctor',
      specialty,
      isApproved: false, // doctors need admin approval
    });

    await newUser.save();

    res.status(201).json({ msg: 'Doctor registered successfully, pending approval' });
  } catch (err) {
    console.error('Doctor registration error:', err);
    return res.status(500).send('Server error');
  }
};

exports.adminRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, email, password, phone, address, role, dob, age, gender, bloodGroup } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already in use' });

    const newUser = new User({
      fullName,
      email,
      password, // plain text password (not recommended)
      phone,
      address,
      role,
      dob,
      age,
      gender,
      bloodGroup,
      isApproved: role === 'doctor' ? false : true,
    });

    await newUser.save();

    res.status(201).json({ msg: `User with role ${role} registered successfully` });
  } catch (err) {
    console.error('Admin registration error:', err);
    return res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password)
      return res.status(400).json({ msg: 'Invalid credentials' });

    if (user.role === 'doctor' && !user.isApproved)
      return res.status(403).json({ msg: 'Doctor account pending approval' });

    const payload = { userId: user._id, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        age: user.age,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        specialty: user.specialty,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).send('Server error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Get Profile error:', err);
    return res.status(500).send('Server error');
  }
};
