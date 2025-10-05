const User = require("../models/User");

// Use specialty field for "departments"
exports.getDepartments = async (req, res) => {
  try {
    const specialties = await User.distinct("specialty", { role: "doctor" });
    res.json({ departments: specialties }); // keep key as departments for frontend compatibility
  } catch (error) {
    res.status(500).json({ message: "Error fetching specialties" });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("fullName specialty");
    res.json({
      doctors: doctors.map(doc => ({
        ...doc._doc,
        department: doc.specialty // send specialty as department
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};
