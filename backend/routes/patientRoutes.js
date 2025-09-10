const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, patientController.createPatient);
router.get('/:id', authMiddleware, patientController.getPatient);
router.post('/:id/record', authMiddleware, patientController.addMedicalRecord);

module.exports = router;
