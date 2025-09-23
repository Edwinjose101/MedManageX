const MedicalRecord = require("../models/MedicalRecord");
const User = require("../models/User");

// List patients for logged-in doctor based on their department, with search filtering
exports.getMyPatients = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.userId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const search = req.query.search || "";

    // Find distinct patient IDs with records in doctor's specialty
    const records = await MedicalRecord.find({
      department: doctor.specialty,
    }).distinct("patientId");

    // Build MongoDB filter for patients
    const filter = {
      _id: { $in: records },
      role: "patient",
    };

    // If search string is provided, filter by patient name (case-insensitive)
    if (search) {
      filter.fullName = { $regex: search, $options: "i" };
    }

    // Fetch patient details (excluding password)
    const patients = await User.find(filter).select("-password");

    res.json(patients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// List medical records for a patient (filtered by doctor's department), exclude admin-created records, with doctor name populated
exports.getPatientRecords = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.userId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { id: patientId } = req.params;

    // Check if patient exists and role is patient
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ msg: "Patient not found" });
    }

    // Fetch records for this patient and department, exclude admin created records
    const records = await MedicalRecord.find({
      patientId,
      department: doctor.specialty,
      createdByRole: { $ne: "admin" },
    })
      .sort("createdAt")
      .populate("doctorId", "fullName");

    res.json(records);
  } catch (err) {
    console.error("Error fetching medical records:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Add a medical record for patient (only for doctor's department)
exports.addMedicalRecord = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.userId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { id: patientId } = req.params;
    const { notes } = req.body;

    if (!notes || notes.trim() === "") {
      return res.status(400).json({ msg: "Notes are required" });
    }

    // Validate patient existence
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ msg: "Patient not found" });
    }

    const newRecord = new MedicalRecord({
      patientId,
      department: doctor.specialty,
      doctorId: doctor._id,
      notes,
      createdByRole: "doctor",
    });

    await newRecord.save();

    res
      .status(201)
      .json({ msg: "Medical record added successfully", record: newRecord });
  } catch (err) {
    console.error("Error adding medical record:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update medical record - doctors can only update their own records, and only notes field
exports.updateMedicalRecord = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.userId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const recordId = req.params.id;
    const { notes } = req.body;

    if (!notes || notes.trim() === "") {
      return res.status(400).json({ msg: "Notes are required for update" });
    }

    const record = await MedicalRecord.findById(recordId);
    if (!record) return res.status(404).json({ msg: "Record not found" });

    // Ensure the doctor owns this record
    if (record.doctorId.toString() !== doctor._id.toString()) {
      return res
        .status(403)
        .json({ msg: "Not authorized to edit this record" });
    }

    // Update notes only
    record.notes = notes;
    await record.save();

    res.json({ msg: "Medical record updated successfully", record });
  } catch (err) {
    console.error("Error updating medical record:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete medical record - doctors can delete own, admins can delete any record
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || (user.role !== "admin" && user.role !== "doctor")) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const recordId = req.params.id;
    const record = await MedicalRecord.findById(recordId);
    if (!record) return res.status(404).json({ msg: "Record not found" });

    // Admin can delete any record, doctor only own
    if (
      user.role === "admin" ||
      (record.doctorId && record.doctorId.toString() === user._id.toString())
    ) {
      await record.deleteOne();
      return res.json({ msg: "Medical record deleted successfully" });
    }

    return res
      .status(403)
      .json({ msg: "Not authorized to delete this record" });
  } catch (err) {
    console.error("Error deleting medical record:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
