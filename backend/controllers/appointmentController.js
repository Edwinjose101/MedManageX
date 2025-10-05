// Get available slots and counts per time for a doctor and date
exports.getDoctorSlotCounts = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    if (!doctorId || !date) return res.status(400).json({ message: "doctorId and date required" });
    // Get all appointments for doctor and date
    const appointments = await Appointment.find({ doctorId, date, status: { $ne: "cancelled" } });
    // Count slots
    const slotCounts = {};
    appointments.forEach(a => {
      slotCounts[a.time] = (slotCounts[a.time] || 0) + 1;
    });
    res.json({ slotCounts });
  } catch (err) {
    console.error("Error fetching slot counts:", err);
    res.status(500).json({ message: "Server error fetching slot counts." });
  }
};
const Appointment = require("../models/Appointment");

// Create new appointment (patient booking)
exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, department, date, time, reason } = req.body;

    // Allow up to 3 people to book the same time slot
    const slotCount = await Appointment.countDocuments({
      doctorId,
      date,
      time,
      status: { $ne: "cancelled" }
    });
    if (slotCount >= 3) {
      return res.status(400).json({ message: "This time slot is fully booked (max 3 patients)." });
    }

  
    // Check if patient already has an appointment with any doctor of this speciality on this day, but allow multiple patients per slot
    const alreadyBooked = await Appointment.findOne({
      patientId,
      department,
      date,
      status: { $ne: "cancelled" }
    });
    if (alreadyBooked) {
      // If the patient is trying to book the same slot again, block it
      if (alreadyBooked.time === time) {
        return res.status(400).json({ message: "You have already booked this time slot for this speciality today." });
      }
      // Otherwise, block booking with another doctor of same speciality on same day
      return res.status(400).json({ message: "You can only book one appointment with a doctor of this speciality per day." });
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
    res.status(500).json({ message: "Server error while booking appointment." });
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
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error cancelling appointment" });
  }
};
