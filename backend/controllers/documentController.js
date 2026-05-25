const { getModel } = require('../config/db');
const { 
  BiltySchema, 
  LoadingSlipSchema, 
  ChalanSchema, 
  InvoiceSchema, 
  VoucherSchema,
  UserLogSchema,
  UserSchema,
  SupplierAdvanceSchema
} = require('../models/schemas');

const Bilty = getModel('Bilty', BiltySchema);
const LoadingSlip = getModel('LoadingSlip', LoadingSlipSchema);
const Chalan = getModel('Chalan', ChalanSchema);
const Invoice = getModel('Invoice', InvoiceSchema);
const Voucher = getModel('Voucher', VoucherSchema);
const UserLog = getModel('UserLog', UserLogSchema);
const User = getModel('User', UserSchema);
const SupplierAdvance = getModel('SupplierAdvance', SupplierAdvanceSchema);

// Helper to log user activity
const logActivity = async (userId, description) => {
  try {
    const user = await User.findById(userId);
    const company = user ? user.companyName : 'TRANSCORE LOGISTICS';
    await UserLog.create({
      company_id: userId,
      description: `${description} by ${company}.`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Logging error:', err);
  }
};

// --- BILTY CRUD ---
exports.getBilties = async (req, res) => {
  try {
    const bilties = await Bilty.find({ company_id: req.userId });
    res.json(bilties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBilty = async (req, res) => {
  try {
    const data = req.body;
    
    // Auto-calculate Bilty math
    const rate = Number(data.rate) || 0;
    const weight = Number(data.chargedWeight) || Number(data.actualWeight) || 0;
    const freightCharge = data.rateType === 'Per Ton' ? (rate * weight) : rate;
    const laborCharge = Number(data.laborCharge) || 0;
    const otherCharges = Number(data.otherCharges) || 0;
    const totalFreight = freightCharge + laborCharge + otherCharges;
    const advancePaid = Number(data.advancePaid) || 0;
    const balanceAmount = totalFreight - advancePaid;

    const bilty = await Bilty.create({
      company_id: req.userId,
      ...data,
      freightCharge,
      totalFreight,
      balanceAmount
    });

    await logActivity(req.userId, `Created Bilty No. ${bilty.biltyNo} (${bilty.vehicleNumber})`);
    res.status(201).json(bilty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBilty = async (req, res) => {
  try {
    const data = req.body;
    
    // Recalculate Bilty math
    const rate = Number(data.rate) || 0;
    const weight = Number(data.chargedWeight) || Number(data.actualWeight) || 0;
    const freightCharge = data.rateType === 'Per Ton' ? (rate * weight) : rate;
    const laborCharge = Number(data.laborCharge) || 0;
    const otherCharges = Number(data.otherCharges) || 0;
    const totalFreight = freightCharge + laborCharge + otherCharges;
    const advancePaid = Number(data.advancePaid) || 0;
    const balanceAmount = totalFreight - advancePaid;

    const bilty = await Bilty.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      {
        ...data,
        freightCharge,
        totalFreight,
        balanceAmount
      },
      { new: true }
    );

    if (!bilty) {
      return res.status(404).json({ error: 'Bilty not found or unauthorized' });
    }

    await logActivity(req.userId, `Updated Bilty No. ${bilty.biltyNo} (${bilty.vehicleNumber})`);
    res.json(bilty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBilty = async (req, res) => {
  try {
    const bilty = await Bilty.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!bilty) {
      return res.status(404).json({ error: 'Bilty not found or unauthorized' });
    }
    await logActivity(req.userId, `Deleted Bilty No. ${bilty.biltyNo}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- LOADING SLIP CRUD ---
exports.getLoadingSlips = async (req, res) => {
  try {
    const slips = await LoadingSlip.find({ company_id: req.userId });
    res.json(slips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLoadingSlip = async (req, res) => {
  try {
    const data = req.body;
    const freightPromised = Number(data.freightPromised) || 0;
    const driverAdvance = Number(data.driverAdvance) || 0;
    const balance = freightPromised - driverAdvance;

    const slip = await LoadingSlip.create({
      company_id: req.userId,
      ...data,
      balance
    });

    await logActivity(req.userId, `Created Loading Slip No. ${slip.slipNo}`);
    res.status(201).json(slip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLoadingSlip = async (req, res) => {
  try {
    const data = req.body;
    const freightPromised = Number(data.freightPromised) || 0;
    const driverAdvance = Number(data.driverAdvance) || 0;
    const balance = freightPromised - driverAdvance;

    const slip = await LoadingSlip.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      { ...data, balance },
      { new: true }
    );

    if (!slip) {
      return res.status(404).json({ error: 'Loading slip not found or unauthorized' });
    }

    await logActivity(req.userId, `Updated Loading Slip No. ${slip.slipNo}`);
    res.json(slip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLoadingSlip = async (req, res) => {
  try {
    const slip = await LoadingSlip.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!slip) {
      return res.status(404).json({ error: 'Loading slip not found or unauthorized' });
    }
    await logActivity(req.userId, `Deleted Loading Slip No. ${slip.slipNo}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- CHALAN CRUD ---
exports.getChalans = async (req, res) => {
  try {
    const chalans = await Chalan.find({ company_id: req.userId });
    res.json(chalans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createChalan = async (req, res) => {
  try {
    const data = req.body;
    const lorryFreight = Number(data.lorryFreight) || 0;
    const advancePaid = data.advancePaid !== undefined ? Number(data.advancePaid) : (Number(data.advancePaid) || 0);
    const dieselCardCharge = Number(data.dieselAdvance) || Number(data.dieselCardCharge) || 0;
    const commission = Number(data.commissionAmount) || Number(data.commission) || 0;
    const officeExpenses = Number(data.officeExpenses) || 0;
    const balanceToDriver = data.balanceToDriver !== undefined ? Number(data.balanceToDriver) : (lorryFreight - advancePaid - dieselCardCharge - commission - officeExpenses);

    const chalan = await Chalan.create({
      company_id: req.userId,
      ...data,
      advancePaid,
      balanceToDriver
    });

    await logActivity(req.userId, `Created Chalan No. ${chalan.chalanNo}`);
    res.status(201).json(chalan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateChalan = async (req, res) => {
  try {
    const data = req.body;
    const lorryFreight = Number(data.lorryFreight) || 0;
    const advancePaid = data.advancePaid !== undefined ? Number(data.advancePaid) : (Number(data.advancePaid) || 0);
    const dieselCardCharge = Number(data.dieselAdvance) || Number(data.dieselCardCharge) || 0;
    const commission = Number(data.commissionAmount) || Number(data.commission) || 0;
    const officeExpenses = Number(data.officeExpenses) || 0;
    const balanceToDriver = data.balanceToDriver !== undefined ? Number(data.balanceToDriver) : (lorryFreight - advancePaid - dieselCardCharge - commission - officeExpenses);

    const chalan = await Chalan.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      { 
        ...data, 
        advancePaid,
        balanceToDriver 
      },
      { new: true }
    );

    if (!chalan) {
      return res.status(404).json({ error: 'Chalan not found or unauthorized' });
    }

    await logActivity(req.userId, `Updated Chalan No. ${chalan.chalanNo}`);
    res.json(chalan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteChalan = async (req, res) => {
  try {
    const chalan = await Chalan.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!chalan) {
      return res.status(404).json({ error: 'Chalan not found or unauthorized' });
    }
    await logActivity(req.userId, `Deleted Chalan No. ${chalan.chalanNo}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- INVOICE CRUD ---
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ company_id: req.userId });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const data = req.body;
    const totalFreight = Number(data.totalFreight) || 0;
    const sgst = Number(data.sgst) || 0;
    const cgst = Number(data.cgst) || 0;
    const igst = Number(data.igst) || 0;
    const grandTotal = totalFreight + sgst + cgst + igst;
    const amountPaid = Number(data.amountPaid) || 0;
    const balance = grandTotal - amountPaid;

    const invoice = await Invoice.create({
      company_id: req.userId,
      ...data,
      grandTotal,
      balance
    });

    await logActivity(req.userId, `Created Invoice No. ${invoice.invoiceNo}`);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const data = req.body;
    const totalFreight = Number(data.totalFreight) || 0;
    const sgst = Number(data.sgst) || 0;
    const cgst = Number(data.cgst) || 0;
    const igst = Number(data.igst) || 0;
    const grandTotal = totalFreight + sgst + cgst + igst;
    const amountPaid = Number(data.amountPaid) || 0;
    const balance = grandTotal - amountPaid;

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      { ...data, grandTotal, balance },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found or unauthorized' });
    }

    await logActivity(req.userId, `Updated Invoice No. ${invoice.invoiceNo}`);
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found or unauthorized' });
    }
    await logActivity(req.userId, `Deleted Invoice No. ${invoice.invoiceNo}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- VOUCHER CRUD ---
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({ company_id: req.userId });
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.create({
      company_id: req.userId,
      ...req.body
    });
    await logActivity(req.userId, `Recorded ${voucher.type} Voucher No. ${voucher.voucherNo}`);
    res.status(201).json(voucher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      req.body,
      { new: true }
    );
    if (!voucher) {
      return res.status(404).json({ error: 'Voucher not found or unauthorized' });
    }
    await logActivity(req.userId, `Updated Voucher No. ${voucher.voucherNo}`);
    res.json(voucher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!voucher) {
      return res.status(404).json({ error: 'Voucher not found or unauthorized' });
    }
    await logActivity(req.userId, `Deleted Voucher No. ${voucher.voucherNo}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- SUPPLIER ADVANCE CRUD ---
exports.getSupplierAdvances = async (req, res) => {
  try {
    const advances = await SupplierAdvance.find({ company_id: req.userId });
    res.json(advances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSupplierAdvance = async (req, res) => {
  try {
    const data = req.body;
    const amount = Number(data.amount) || 0;
    const settledAmount = Number(data.settledAmount) || 0;
    const balance = amount - settledAmount;

    const advance = await SupplierAdvance.create({
      company_id: req.userId,
      ...data,
      balance
    });

    await logActivity(req.userId, `Recorded Supplier Advance of ₹${amount} for ${advance.supplierName}`);
    res.status(201).json(advance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSupplierAdvance = async (req, res) => {
  try {
    const data = req.body;
    const amount = Number(data.amount) || 0;
    const settledAmount = Number(data.settledAmount) || 0;
    const balance = amount - settledAmount;

    const advance = await SupplierAdvance.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      { ...data, balance },
      { new: true }
    );

    if (!advance) {
      return res.status(404).json({ error: 'Supplier advance not found or unauthorized' });
    }

    await logActivity(req.userId, `Updated Supplier Advance for ${advance.supplierName}`);
    res.json(advance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSupplierAdvance = async (req, res) => {
  try {
    const advance = await SupplierAdvance.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!advance) {
      return res.status(404).json({ error: 'Supplier advance not found or unauthorized' });
    }
    await logActivity(req.userId, `Deleted Supplier Advance for ${advance.supplierName}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
