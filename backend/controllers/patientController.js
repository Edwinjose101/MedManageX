const MedicalRecord = require("../models/MedicalRecord");
const User = require("../models/User"); // Import User model

// Get paginated and optionally filtered patient medical records
exports.getPatientRecords = async (req, res) => {
  try {
    const patientId = req.user.userId; // Auth middleware sets req.user
    const { search = "", page = 1, limit = 10, sort = "desc" } = req.query;

    // Build query object for MedicalRecord collection
    const query = {
      patientId,
    };
    if (search) {
      query.notes = { $regex: search, $options: "i" };
    }

    const sortOrder = sort === "asc" ? 1 : -1;

    const total = await MedicalRecord.countDocuments(query);
    const records = await MedicalRecord.find(query)
      .sort({ createdAt: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("doctorId", "fullName");

    res.json({ total, records });
  } catch (err) {
    console.error("Error fetching patient records:", err);
    res.status(500).json({ message: "Server error fetching records" });
  }
};

// Get authenticated patient's profile excluding password
exports.getPatientProfile = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const user = await User.findById(patientId).select("-password"); // exclude sensitive info

    if (!user) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching patient profile:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Update authenticated patient's profile with validation and sanitization
exports.updatePatientProfile = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const { fullName, email, phone, address } = req.body;

    // Optional: Add input validation and sanitization here

    const updatedUser = await User.findByIdAndUpdate(
      patientId,
      { fullName, email, phone, address },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating patient profile:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
