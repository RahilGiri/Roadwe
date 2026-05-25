const { getModel } = require('../config/db');
const { 
  CustomerSchema, 
  VehicleSchema, 
  DriverSchema,
  BranchSchema,
  QuotationSchema,
  SubUserSchema,
  CashBankSchema,
  RoleSchema,
  AuditLogSchema,
  PermissionHistorySchema
} = require('../models/schemas');

const Customer = getModel('Customer', CustomerSchema);
const Vehicle = getModel('Vehicle', VehicleSchema);
const Driver = getModel('Driver', DriverSchema);
const Branch = getModel('Branch', BranchSchema);
const Quotation = getModel('Quotation', QuotationSchema);
const SubUser = getModel('SubUser', SubUserSchema);
const CashBank = getModel('CashBank', CashBankSchema);
const Role = getModel('Role', RoleSchema);
const AuditLog = getModel('AuditLog', AuditLogSchema);
const PermissionHistory = getModel('PermissionHistory', PermissionHistorySchema);

// --- Customer CRUD ---
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ company_id: req.userId });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      company_id: req.userId,
      ...req.body
    });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      req.body,
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found or unauthorized' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found or unauthorized' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Vehicle CRUD ---
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ company_id: req.userId });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({
      company_id: req.userId,
      ...req.body
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      req.body,
      { new: true }
    );
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Driver CRUD ---
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ company_id: req.userId });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDriver = async (req, res) => {
  try {
    const driver = await Driver.create({
      company_id: req.userId,
      ...req.body
    });
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      req.body,
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found or unauthorized' });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found or unauthorized' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Branch CRUD ---
exports.getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ company_id: req.userId });
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBranch = async (req, res) => {
  try {
    const branch = await Branch.create({
      company_id: req.userId,
      ...req.body
    });
    res.status(201).json(branch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      req.body,
      { new: true }
    );
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found or unauthorized' });
    }
    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Branch deletion requires strict company ownership
exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found or unauthorized' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Quotation CRUD ---
exports.getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ company_id: req.userId });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.create({
      company_id: req.userId,
      ...req.body
    });
    res.status(201).json(quotation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      req.body,
      { new: true }
    );
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found or unauthorized' });
    }
    res.json(quotation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found or unauthorized' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- SubUser CRUD ---
exports.getSubUsers = async (req, res) => {
  try {
    const subusers = await SubUser.find({ company_id: req.userId });
    res.json(subusers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSubUser = async (req, res) => {
  try {
    const subuser = await SubUser.create({
      company_id: req.userId,
      ...req.body
    });
    res.status(201).json(subuser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSubUser = async (req, res) => {
  try {
    const subuser = await SubUser.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      req.body,
      { new: true }
    );
    if (!subuser) {
      return res.status(404).json({ error: 'Sub-user not found or unauthorized' });
    }
    res.json(subuser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSubUser = async (req, res) => {
  try {
    const subuser = await SubUser.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!subuser) {
      return res.status(404).json({ error: 'Sub-user not found or unauthorized' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- CashBank CRUD ---
exports.getCashBanks = async (req, res) => {
  try {
    const cashbanks = await CashBank.find({ company_id: req.userId });
    res.json(cashbanks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCashBank = async (req, res) => {
  try {
    const cashbank = await CashBank.create({
      company_id: req.userId,
      ...req.body
    });
    res.status(201).json(cashbank);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCashBank = async (req, res) => {
  try {
    const cashbank = await CashBank.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      req.body,
      { new: true }
    );
    if (!cashbank) {
      return res.status(404).json({ error: 'Cash/Bank account not found or unauthorized' });
    }
    res.json(cashbank);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCashBank = async (req, res) => {
  try {
    const cashbank = await CashBank.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    if (!cashbank) {
      return res.status(404).json({ error: 'Cash/Bank account not found or unauthorized' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Roles CRUD ---
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ company_id: req.userId });
    
    // Seed default roles if none exist for this transporter
    if (roles.length === 0) {
      const defaultRoles = [
        {
          name: 'Super Admin',
          key: 'super_admin',
          description: 'Full corporate operational & administrative permissions.',
          isPredefined: true,
          permissions: [
            { moduleName: 'Bilty', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
            { moduleName: 'Loading Slip', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
            { moduleName: 'Invoice', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
            { moduleName: 'Chalan', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true }
          ]
        },
        {
          name: 'Company Admin',
          key: 'company_admin',
          description: 'Full operations within single company scope.',
          isPredefined: true,
          permissions: [
            { moduleName: 'Bilty', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
            { moduleName: 'Loading Slip', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
            { moduleName: 'Invoice', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
            { moduleName: 'Chalan', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true }
          ]
        },
        {
          name: 'Operations Executive',
          key: 'operations_executive',
          description: 'Create & manage Lorry Bilties & Loading Slips.',
          isPredefined: true,
          permissions: [
            { moduleName: 'Bilty', view: true, create: true, edit: true, delete: false, export: true, approve: false, assign: true },
            { moduleName: 'Loading Slip', view: true, create: true, edit: true, delete: false, export: true, approve: false, assign: false },
            { moduleName: 'Invoice', view: false, create: false, edit: false, delete: false, export: false, approve: false, assign: false },
            { moduleName: 'Chalan', view: true, create: false, edit: false, delete: false, export: false, approve: false, assign: false }
          ]
        },
        {
          name: 'Accountant',
          key: 'accountant',
          description: 'Manage Tax Invoices, ledgers, & payment logs.',
          isPredefined: true,
          permissions: [
            { moduleName: 'Bilty', view: true, create: false, edit: false, delete: false, export: true, approve: false, assign: false },
            { moduleName: 'Loading Slip', view: false, create: false, edit: false, delete: false, export: false, approve: false, assign: false },
            { moduleName: 'Invoice', view: true, create: true, edit: true, delete: false, export: true, approve: true, assign: false },
            { moduleName: 'Chalan', view: true, create: false, edit: false, delete: false, export: true, approve: false, assign: false }
          ]
        }
      ];

      const seeded = [];
      for (let r of defaultRoles) {
        const item = await Role.create({
          company_id: req.userId,
          ...r
        });
        seeded.push(item);
      }
      return res.json(seeded);
    }
    
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const role = await Role.create({
      company_id: req.userId,
      isPredefined: false,
      ...req.body
    });
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, company_id: req.userId },
      req.body,
      { new: true }
    );
    if (!role) {
      return res.status(404).json({ error: 'Role not found or unauthorized' });
    }
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, company_id: req.userId });
    if (!role) {
      return res.status(404).json({ error: 'Role not found or unauthorized' });
    }
    if (role.isPredefined) {
      return res.status(400).json({ error: 'Cannot delete predefined system roles.' });
    }
    await Role.findOneAndDelete({ _id: req.params.id, company_id: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Logs & Audit Tracks ---
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ company_id: req.userId });
    
    // Fallback seed
    if (logs.length === 0) {
      const { UserSchema } = require('../models/schemas');
      const User = getModel('User', UserSchema);
      const user = await User.findById(req.userId);
      const company = user ? user.companyName : 'TRANSCORE LOGISTICS';

      const dummyLogs = [
        {
          company_id: req.userId,
          userId: req.userId,
          operatorName: 'Transcore Admin',
          action: 'LOGIN',
          description: 'Login successful from IP 192.168.1.1 (Chrome - MacOS)',
          timestamp: new Date().toISOString()
        },
        {
          company_id: req.userId,
          userId: req.userId,
          operatorName: 'Transcore Admin',
          action: 'PERM_CHANGE',
          description: 'Modified Accountant role permissions matrix.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          company_id: req.userId,
          userId: req.userId,
          operatorName: 'Transcore Admin',
          action: 'BRANCH_ASSIGN',
          description: 'Assigned Kanpur Branch HQ access to Ramesh Singh.',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        }
      ];

      const seeded = [];
      for (let l of dummyLogs) {
        const item = await AuditLog.create(l);
        seeded.push(item);
      }
      return res.json(seeded);
    }

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPermissionHistory = async (req, res) => {
  try {
    const history = await PermissionHistory.find({ company_id: req.userId });
    
    if (history.length === 0) {
      const dummyHistory = [
        {
          company_id: req.userId,
          operatorName: 'Ramesh Singh',
          changedByName: 'Transcore Admin',
          changeDescription: 'Toggled view/create options for Loading Slips module.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          company_id: req.userId,
          operatorName: 'Sukhdev Singh',
          changedByName: 'Transcore Admin',
          changeDescription: 'Cloned Accountant role permissions to Custom Accountant Role.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ];

      const seeded = [];
      for (let h of dummyHistory) {
        const item = await PermissionHistory.create(h);
        seeded.push(item);
      }
      return res.json(seeded);
    }

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
