const Appointment = require("../models/Appointment");

// Get available slots and counts per time for a doctor and date
exports.getDoctorSlotCounts = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    if (!doctorId || !date)
      return res.status(400).json({ message: "doctorId and date required" });
    // Get all appointments for doctor and date
    const appointments = await Appointment.find({
      doctorId,
      date,
      status: { $ne: "cancelled" },
    });
    // Count slots
    const slotCounts = {};
    appointments.forEach((a) => {
      slotCounts[a.time] = (slotCounts[a.time] || 0) + 1;
    });
    res.json({ slotCounts });
  } catch (err) {
    console.error("Error fetching slot counts:", err);
    res.status(500).json({ message: "Server error fetching slot counts." });
  }
};

// Create new appointment (patient booking)
exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, department, date, time, reason } = req.body;

    // Allow up to 3 people to book the same time slot
    const slotCount = await Appointment.countDocuments({
      doctorId,
      date,
      time,
      status: { $ne: "cancelled" },
    });
    if (slotCount >= 3) {
      return res
        .status(400)
        .json({ message: "This time slot is fully booked (max 3 patients)." });
    }

    // Check if patient already has an appointment with any doctor of this speciality on this day, but allow multiple patients per slot
    const alreadyBooked = await Appointment.findOne({
      patientId,
      department,
      date,
      status: { $ne: "cancelled" },
    });
    if (alreadyBooked) {
      // If the patient is trying to book the same slot again, block it
      if (alreadyBooked.time === time) {
        return res
          .status(400)
          .json({
            message:
              "You have already booked this time slot for this speciality today.",
          });
      }
      // Otherwise, block booking with another doctor of same speciality on same day
      return res
        .status(400)
        .json({
          message:
            "You can only book one appointment with a doctor of this speciality per day.",
        });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      department,
      date,
      time,
      reason,
      status: "pending",
    });

    const saved = await appointment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error booking appointment:", err);
    res
      .status(500)
      .json({ message: "Server error while booking appointment." });
  }
};

// Get appointments by patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.params.id;

    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "fullName role")
      .sort({ date: 1, time: 1 });

    res.json({ appointments });
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ message: "Server error fetching appointments." });
  }
};

// Cancel Appointments
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error cancelling appointment" });
  }
};

// Get all appointments for logged-in doctor with optional filters
exports.getMyAppointments = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { status, date } = req.query;

    if (!doctorId)
      return res.status(400).json({ message: "Doctor ID missing" });

    const query = { doctorId };
    if (status) query.status = status;
    if (date) query.date = date;

    const appointments = await Appointment.find(query)
      .populate("patientId", "fullName email")
      .sort({ date: 1, time: 1 });

    res.json({ appointments });
  } catch (err) {
    console.error("Error fetching doctor's appointments:", err);
    res.status(500).json({ message: "Server error fetching appointments" });
  }
};

// Update appointment status (e.g. completed, cancelled) by doctor
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const appointmentId = req.params.id;
    const { status } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    if (appointment.doctorId.toString() !== doctorId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    // Validate status value
    const allowedStatuses = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
      "no-show",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: "Appointment status updated", appointment });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ message: "Server error updating appointment" });
  }
};
