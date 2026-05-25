const jwt = require('jsonwebtoken');
const { getModel } = require('../config/db');
const { UserSchema, SubUserSchema } = require('../models/schemas');

const User = getModel('User', UserSchema);
const SubUser = getModel('SubUser', SubUserSchema);
const JWT_SECRET = process.env.JWT_SECRET || 'roadwe-super-secret-key-12345';

module.exports = async (req, res, next) => {
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

    // Verify company workspace state (Lock out suspended companies)
    let company = await User.findById(decoded.userId);
    if (!company) {
      const subuser = await SubUser.findById(decoded.userId);
      if (subuser) {
        company = await User.findById(subuser.company_id);
      }
    }

    if (company && company.subscriptionPlan === 'Suspended') {
      return res.status(403).json({ 
        error: 'Access Denied. Your company workspace has been suspended. Please contact admin@roadwe.com to manage billing or renew your plan.' 
      });
    }

    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};
