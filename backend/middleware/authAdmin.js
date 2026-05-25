const { getModel } = require('../config/db');
const { UserSchema } = require('../models/schemas');
const User = getModel('User', UserSchema);

module.exports = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Access Denied. Unauthenticated.' });
    }

    const user = await User.findById(req.userId);
    if (!user || user.isSuperAdmin !== true) {
      return res.status(403).json({ error: 'Access Denied. Super Admin privileges required.' });
    }

    next();
  } catch (err) {
    console.error('🛡️ Super Admin Auth Error:', err);
    res.status(500).json({ error: 'Internal server authorization error.' });
  }
};
