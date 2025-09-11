const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Get all users (admin only)
router.get(
  '/users',
  authMiddleware,
  roleMiddleware(['admin']),
  adminController.getAllUsers
);

// Additional admin endpoints can be added here

module.exports = router;
