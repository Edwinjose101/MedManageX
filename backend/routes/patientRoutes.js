const express = require("express");
const router = express.Router();
const {
  getPatientRecords,
  updatePatientProfile,
  getPatientProfile, // Import the new function
} = require("../controllers/patientController");

const  authenticatePatient  = require("../middleware/authMiddleware");


router.get("/records", authenticatePatient, getPatientRecords);

router.get("/profile", authenticatePatient, getPatientProfile); // Add this line

router.put("/profile", authenticatePatient, updatePatientProfile);

module.exports = router;
