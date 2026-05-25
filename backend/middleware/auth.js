const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'roadwe-super-secret-key-12345';

module.exports = (req, res, next) => {
  // Support bypass for local testing or unauthenticated requests if needed,
  // but strictly enforce proper token checking for CRUD routes.
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Malformed token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};
