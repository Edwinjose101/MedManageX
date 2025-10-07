const User = require("../models/User");
const MedicalRecord = require("../models/MedicalRecord");
const Appointment = require("../models/Appointment");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Admin getAllUsers error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// List all unapproved doctors
exports.getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await User.find({
      role: "doctor",
      isApproved: false,
    }).select("-password");
    res.json(pendingDoctors);
  } catch (err) {
    console.error("Error fetching pending doctors:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Approve a doctor by ID
exports.approveDoctor = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    doctor.isApproved = true;
    await doctor.save();
    res.json({ msg: "Doctor approved successfully" });
  } catch (err) {
    console.error("Error approving doctor:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Reject or delete a pending doctor registration
exports.rejectDoctor = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    await doctor.deleteOne();
    res.json({ msg: "Doctor registration rejected and deleted" });
  } catch (err) {
    console.error("Error rejecting doctor:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all patients for admin dropdown
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.json(patients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all approved doctors for admin dropdown
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: "doctor",
      isApproved: true,
    }).select("-password");
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Add medical record by admin, with createdByRole
exports.addMedicalRecordByAdmin = async (req, res) => {
  try {
    const { patientId, department, doctorId, notes } = req.body;

    if (!patientId || !department || !notes || !notes.trim()) {
      return res
        .status(400)
        .json({ msg: "patientId, department and notes are required" });
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ msg: "Patient not found or invalid" });
    }

    let doctor = null;
    if (doctorId) {
      doctor = await User.findById(doctorId);
      if (!doctor || doctor.role !== "doctor" || !doctor.isApproved) {
        return res
          .status(404)
          .json({ msg: "Doctor not found, invalid, or not approved" });
      }
    }

    const newRecord = new MedicalRecord({
      patientId,
      department,
      doctorId: doctor ? doctor._id : null,
      notes,
      createdByRole: "admin",
    });

    await newRecord.save();

    res
      .status(201)
      .json({ msg: "Medical record added successfully", record: newRecord });
  } catch (err) {
    console.error("Error adding medical record by admin:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update a medical record (admin only)
exports.updateMedicalRecordByAdmin = async (req, res) => {
  try {
    const recordId = req.params.id;
    const { patientId, department, doctorId, notes } = req.body;

    const record = await MedicalRecord.findById(recordId);
    if (!record)
      return res.status(404).json({ msg: "Medical record not found" });

    if (patientId) record.patientId = patientId;
    if (department) record.department = department;
    if (doctorId !== undefined) record.doctorId = doctorId; // can be null
    if (notes) record.notes = notes;

    record.createdByRole = "admin";

    await record.save();

    res.json({ msg: "Medical record updated successfully", record });
  } catch (err) {
    console.error("Error updating medical record by admin:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a medical record (admin only)
exports.deleteMedicalRecordByAdmin = async (req, res) => {
  try {
    const recordId = req.params.id;
    const record = await MedicalRecord.findById(recordId);
    if (!record)
      return res.status(404).json({ msg: "Medical record not found" });

    await record.deleteOne();

    res.json({ msg: "Medical record deleted successfully" });
  } catch (err) {
    console.error("Error deleting medical record by admin:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all medical records with optional search and filters (for overview)
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const {
      search = "",
      patientId,
      doctorId,
      department,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (search.trim()) {
      query.notes = { $regex: search.trim(), $options: "i" };
    }
    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (department) query.department = department;

    const records = await MedicalRecord.find(query)
      .populate("patientId", "fullName")
      .populate("doctorId", "fullName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await MedicalRecord.countDocuments(query);

    res.json({ records, total });
  } catch (err) {
    console.error("Error fetching medical records:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Appointment approval workflow methods

// Get appointments with status "pending" for admin review
exports.getPendingAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: "pending" })
      .populate("patientId", "fullName email")
      .populate("doctorId", "fullName specialty")
      .sort({ date: 1, time: 1 });

    res.json({ appointments });
  } catch (err) {
    console.error("Error fetching pending appointments:", err);
    res
      .status(500)
      .json({ msg: "Server error fetching pending appointments." });
  }
};

// Approve appointment (set status to "confirmed")
exports.approveAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ msg: "Appointment not found" });

    if (appointment.status !== "pending")
      return res.status(400).json({ msg: "Appointment is not pending" });

    appointment.status = "confirmed";
    await appointment.save();

    res.json({ msg: "Appointment approved successfully", appointment });
  } catch (err) {
    console.error("Error approving appointment:", err);
    res.status(500).json({ msg: "Server error while approving appointment." });
  }
};

// Reject appointment (set status to "cancelled")
exports.rejectAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ msg: "Appointment not found" });

    if (appointment.status !== "pending")
      return res.status(400).json({ msg: "Appointment is not pending" });

    appointment.status = "cancelled"; // Or use "rejected" if preferred
    await appointment.save();

    res.json({ msg: "Appointment rejected successfully", appointment });
  } catch (err) {
    console.error("Error rejecting appointment:", err);
    res.status(500).json({ msg: "Server error while rejecting appointment." });
  }
};

// New - Get appointment load dashboard data for admin
exports.getAppointmentLoad = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: { doctorId: "$doctorId", date: "$date", status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { doctorId: "$_id.doctorId", date: "$_id.date" },
          statusCounts: {
            $push: { status: "$_id.status", count: "$count" },
          },
          total: { $sum: "$count" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $project: {
          doctorId: "$_id.doctorId",
          doctorName: "$doctor.fullName",
          date: "$_id.date",
          total: 1,
          pending: {
            $sum: {
              $map: {
                input: "$statusCounts",
                as: "sc",
                in: {
                  $cond: [{ $eq: ["$$sc.status", "pending"] }, "$$sc.count", 0],
                },
              },
            },
          },
          confirmed: {
            $sum: {
              $map: {
                input: "$statusCounts",
                as: "sc",
                in: {
                  $cond: [
                    { $eq: ["$$sc.status", "confirmed"] },
                    "$$sc.count",
                    0,
                  ],
                },
              },
            },
          },
          cancelled: {
            $sum: {
              $map: {
                input: "$statusCounts",
                as: "sc",
                in: {
                  $cond: [
                    { $eq: ["$$sc.status", "cancelled"] },
                    "$$sc.count",
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      { $sort: { date: 1, doctorName: 1 } },
    ];

    const appointmentLoad = await Appointment.aggregate(pipeline);

    // Calculate summary totals
    const totalsPipeline = [
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];
    const totalsResults = await Appointment.aggregate(totalsPipeline);

    const summary = {
      totalAppointments: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
    };

    totalsResults.forEach((item) => {
      summary.totalAppointments += item.count;
      if (item._id === "pending") summary.pending = item.count;
      else if (item._id === "confirmed") summary.confirmed = item.count;
      else if (item._id === "cancelled") summary.cancelled = item.count;
    });

    res.json({ summary, appointmentLoad });
  } catch (err) {
    console.error("Error in getAppointmentLoad:", err);
    res.status(500).json({ msg: "Server error getting appointment load" });
  }
};
