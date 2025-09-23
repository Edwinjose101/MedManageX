const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

// Protect all routes for admin only
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

// Get all users (admin only)
router.get("/users", adminController.getAllUsers);

// Get all pending doctors
router.get("/pending-doctors", adminController.getPendingDoctors);

// Approve a doctor by ID
router.patch("/approve-doctor/:id", adminController.approveDoctor);

// Reject or delete a pending doctor by ID (optional)
router.delete("/reject-doctor/:id", adminController.rejectDoctor);

// Get all patients for admin dropdown
router.get("/patients", adminController.getAllPatients);

// Get all approved doctors for admin dropdown
router.get("/doctors", adminController.getAllDoctors);

// Add medical record by admin
router.post("/medical-records", adminController.addMedicalRecordByAdmin);

// Update medical record by admin
router.put("/medical-records/:id", adminController.updateMedicalRecordByAdmin);

// Delete medical record by admin
router.delete(
  "/medical-records/:id",
  adminController.deleteMedicalRecordByAdmin
);

// Get all medical records (with filtering/pagination)
router.get("/medical-records", adminController.getAllMedicalRecords);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Admin routes are working!" });
});

module.exports = router;
