const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Protect all routes for admin only
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Get all users (admin only)
router.get('/users', adminController.getAllUsers);

// Get all pending doctors
router.get('/pending-doctors', adminController.getPendingDoctors);

// Approve a doctor by ID
router.patch('/approve-doctor/:id', adminController.approveDoctor);

// Reject or delete a pending doctor by ID (optional)
router.delete('/reject-doctor/:id', adminController.rejectDoctor);

module.exports = router;
