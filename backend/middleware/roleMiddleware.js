const User = require('../models/User');

const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
      }

      // For doctors, check if approved
      if (req.user.role === 'doctor') {
        const user = await User.findById(req.user.userId);
        if (!user || !user.isApproved) {
          return res.status(403).json({ msg: 'Access denied: doctor account not approved' });
        }
      }

      next();
    } catch (err) {
      console.error('Role middleware error:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
  };
};

module.exports = roleMiddleware;
