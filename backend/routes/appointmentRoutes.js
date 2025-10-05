const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
// Get available slots and counts per time for a doctor and date
router.get("/doctor/:doctorId/slotCounts", appointmentController.getDoctorSlotCounts);

// Routes for patient booking and viewing appointments
router.post("/", appointmentController.bookAppointment);
router.get("/patient/:id", appointmentController.getPatientAppointments);
router.patch("/:id/cancel", appointmentController.cancelAppointment);


// Add more routes for doctor/admin as needed

module.exports = router;
