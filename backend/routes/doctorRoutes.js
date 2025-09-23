const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const doctorController = require("../controllers/doctorController");

router.use(authMiddleware);
router.use(roleMiddleware(["doctor"]));

router.get("/patients", doctorController.getMyPatients);
router.get("/patients/:id/records", doctorController.getPatientRecords);
router.post("/patients/:id/records", doctorController.addMedicalRecord);

// Update medical record - doctor can only update own records
router.put("/medical-records/:id", doctorController.updateMedicalRecord);

// Delete medical record - doctor can only delete own records
router.delete("/medical-records/:id", doctorController.deleteMedicalRecord);

module.exports = router;
