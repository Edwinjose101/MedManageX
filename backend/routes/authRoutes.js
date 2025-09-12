const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Allowed blood groups
const allowedBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Public patient registration
router.post(
  '/register',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional(),
    body('address').optional(),
    body('bloodGroup')
      .isIn(allowedBloodGroups)
      .withMessage(`Blood Group must be one of: ${allowedBloodGroups.join(', ')}`),
  ],
  authController.register
);

// New public doctor registration route (updated)
router.post(
  '/register-doctor',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional(),
    body('address').optional(),
    body('specialty').notEmpty().withMessage('Specialty is required'),
    body('bloodGroup')
      .isIn(allowedBloodGroups)
      .withMessage(`Blood Group must be one of: ${allowedBloodGroups.join(', ')}`),
    // Removed department validation as per update
  ],
  authController.registerDoctor
);

// User login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  authController.login
);

// Protected user profile route
router.get('/profile', authMiddleware, authController.getProfile);

// Admin-only registration to create users with specific roles
router.post(
  '/admin/register',
  authMiddleware,
  roleMiddleware(['admin']),
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['user', 'doctor', 'admin', 'staff']).withMessage('Invalid role'),
    body('phone').optional(),
    body('address').optional(),
    body('bloodGroup')
      .isIn(allowedBloodGroups)
      .withMessage(`Blood Group must be one of: ${allowedBloodGroups.join(', ')}`),
  ],
  authController.adminRegister
);

module.exports = router;
