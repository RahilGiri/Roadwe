const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { getModel, isFallback } = require('../config/db');
const { UserSchema } = require('../models/schemas');

const User = getModel('User', UserSchema);
const JWT_SECRET = process.env.JWT_SECRET || 'roadwe-super-secret-key-12345';

// 1. Get all transporters (client company accounts)
exports.getTransporters = async (req, res) => {
  try {
    const transporters = await User.find({ isSuperAdmin: { $ne: true } });
    res.json(transporters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Register/Create a new transporter company directly
exports.createTransporter = async (req, res) => {
  try {
    const { name, companyName, email, mobile, password, subscriptionPlan } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const newId = isFallback()
      ? (Math.random().toString(36).substring(2, 11) + Date.now().toString(36))
      : new mongoose.Types.ObjectId().toString();

    const hashedPassword = await bcrypt.hash(password || 'admin', 10);
    const newTransporter = await User.create({
      _id: newId,
      name,
      companyName,
      email,
      mobile,
      password: hashedPassword,
      subscriptionPlan: subscriptionPlan || 'Free Trial',
      isSuperAdmin: false,
      financialYear: '26-27',
      company_id: newId
    });

    res.status(201).json(newTransporter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update subscription plan and details
exports.updateTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, companyName, email, mobile, subscriptionPlan, financialYear } = req.body;
    
    const updated = await User.findByIdAndUpdate(id, {
      name,
      companyName,
      email,
      mobile,
      subscriptionPlan,
      financialYear
    }, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'Transporter not found.' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Terminate transporter account
exports.deleteTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Transporter not found.' });
    }
    res.json({ message: 'Transporter deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Impersonate / Assist Transporter (Generate direct client token)
exports.impersonateTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    const clientUser = await User.findById(id);
    if (!clientUser) {
      return res.status(404).json({ error: 'Transporter company not found.' });
    }

    // Sign a fresh token bound to the selected transporter company user
    const token = jwt.sign({ userId: clientUser._id }, JWT_SECRET, { expiresIn: '2h' });

    res.json({
      token,
      user: {
        name: clientUser.name,
        companyName: clientUser.companyName,
        email: clientUser.email,
        id: clientUser._id,
        company_id: clientUser.company_id || clientUser._id,
        isSuperAdmin: false
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
