const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

// Protect all routes for admin only
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

// Add Appointment Load route (only once)
router.get("/appointments/load", adminController.getAppointmentLoad);

// Other routes ...
router.get("/users", adminController.getAllUsers);
router.get("/pending-doctors", adminController.getPendingDoctors);
router.patch("/approve-doctor/:id", adminController.approveDoctor);
router.delete("/reject-doctor/:id", adminController.rejectDoctor);

router.get("/patients", adminController.getAllPatients);
router.get("/doctors", adminController.getAllDoctors);

router.post("/medical-records", adminController.addMedicalRecordByAdmin);
router.put("/medical-records/:id", adminController.updateMedicalRecordByAdmin);
router.delete(
  "/medical-records/:id",
  adminController.deleteMedicalRecordByAdmin
);
router.get("/medical-records", adminController.getAllMedicalRecords);

router.get("/appointments/pending", adminController.getPendingAppointments);
router.patch("/appointments/:id/approve", adminController.approveAppointment);
router.patch("/appointments/:id/reject", adminController.rejectAppointment);

router.get("/test", (req, res) => {
  res.json({ message: "Admin routes are working!" });
});

module.exports = router;
