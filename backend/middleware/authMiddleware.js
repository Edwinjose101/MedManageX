const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info from token to request object
    req.user = decoded; // e.g., { userId, role }

    console.log('Authenticated user:', req.user);

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please login again' });
    }
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
