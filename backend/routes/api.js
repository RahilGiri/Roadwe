const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/authAdmin');

// Controllers
const authController = require('../controllers/authController');
const masterController = require('../controllers/masterController');
const documentController = require('../controllers/documentController');
const dashboardController = require('../controllers/dashboardController');
const adminController = require('../controllers/adminController');

// --- 1. Auth & Profiles ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', auth, authController.getProfile);

// --- 2. Master Databases ---
// Customers
router.get('/masters/customers', auth, masterController.getCustomers);
router.post('/masters/customers', auth, masterController.createCustomer);
router.put('/masters/customers/:id', auth, masterController.updateCustomer);
router.delete('/masters/customers/:id', auth, masterController.deleteCustomer);

// Vehicles
router.get('/masters/vehicles', auth, masterController.getVehicles);
router.post('/masters/vehicles', auth, masterController.createVehicle);
router.put('/masters/vehicles/:id', auth, masterController.updateVehicle);
router.delete('/masters/vehicles/:id', auth, masterController.deleteVehicle);

// Drivers
router.get('/masters/drivers', auth, masterController.getDrivers);
router.post('/masters/drivers', auth, masterController.createDriver);
router.put('/masters/drivers/:id', auth, masterController.updateDriver);
router.delete('/masters/drivers/:id', auth, masterController.deleteDriver);

// Branches
router.get('/masters/branches', auth, masterController.getBranches);
router.post('/masters/branches', auth, masterController.createBranch);
router.put('/masters/branches/:id', auth, masterController.updateBranch);
router.delete('/masters/branches/:id', auth, masterController.deleteBranch);

// Quotations
router.get('/masters/quotations', auth, masterController.getQuotations);
router.post('/masters/quotations', auth, masterController.createQuotation);
router.put('/masters/quotations/:id', auth, masterController.updateQuotation);
router.delete('/masters/quotations/:id', auth, masterController.deleteQuotation);

// SubUsers
router.get('/masters/subusers', auth, masterController.getSubUsers);
router.post('/masters/subusers', auth, masterController.createSubUser);
router.put('/masters/subusers/:id', auth, masterController.updateSubUser);
router.delete('/masters/subusers/:id', auth, masterController.deleteSubUser);

// Dynamic Roles & Permissions Matrix CRUD
router.get('/masters/roles', auth, masterController.getRoles);
router.post('/masters/roles', auth, masterController.createRole);
router.put('/masters/roles/:id', auth, masterController.updateRole);
router.delete('/masters/roles/:id', auth, masterController.deleteRole);

// Audit & Logs Registers
router.get('/masters/rbac-logs', auth, masterController.getAuditLogs);
router.get('/masters/rbac-history', auth, masterController.getPermissionHistory);

// CashBanks
router.get('/masters/cashbanks', auth, masterController.getCashBanks);
router.post('/masters/cashbanks', auth, masterController.createCashBank);
router.put('/masters/cashbanks/:id', auth, masterController.updateCashBank);
router.delete('/masters/cashbanks/:id', auth, masterController.deleteCashBank);

// --- 3. Transport Billing Documents ---
// Bilties (Lorry Receipts)
router.get('/documents/bilties', auth, documentController.getBilties);
router.post('/documents/bilties', auth, documentController.createBilty);
router.put('/documents/bilties/:id', auth, documentController.updateBilty);
router.delete('/documents/bilties/:id', auth, documentController.deleteBilty);

// Loading Slips
router.get('/documents/loading-slips', auth, documentController.getLoadingSlips);
router.post('/documents/loading-slips', auth, documentController.createLoadingSlip);
router.put('/documents/loading-slips/:id', auth, documentController.updateLoadingSlip);
router.delete('/documents/loading-slips/:id', auth, documentController.deleteLoadingSlip);

// Chalans
router.get('/documents/chalans', auth, documentController.getChalans);
router.post('/documents/chalans', auth, documentController.createChalan);
router.put('/documents/chalans/:id', auth, documentController.updateChalan);
router.delete('/documents/chalans/:id', auth, documentController.deleteChalan);

// Invoices
router.get('/documents/invoices', auth, documentController.getInvoices);
router.post('/documents/invoices', auth, documentController.createInvoice);
router.put('/documents/invoices/:id', auth, documentController.updateInvoice);
router.delete('/documents/invoices/:id', auth, documentController.deleteInvoice);

// Vouchers
router.get('/documents/vouchers', auth, documentController.getVouchers);
router.post('/documents/vouchers', auth, documentController.createVoucher);
router.put('/documents/vouchers/:id', auth, documentController.updateVoucher);
router.delete('/documents/vouchers/:id', auth, documentController.deleteVoucher);

// Supplier Advances
router.get('/documents/supplier-advances', auth, documentController.getSupplierAdvances);
router.post('/documents/supplier-advances', auth, documentController.createSupplierAdvance);
router.put('/documents/supplier-advances/:id', auth, documentController.updateSupplierAdvance);
router.delete('/documents/supplier-advances/:id', auth, documentController.deleteSupplierAdvance);

// --- 4. Dashboards & Analytics ---
router.get('/reports/dashboard-stats', auth, dashboardController.getDashboardStats);
router.get('/reports/live-trucks', auth, dashboardController.getLiveTrucks);

// --- 5. Super Admin API ---
router.get('/admin/transporters', auth, adminOnly, adminController.getTransporters);
router.post('/admin/transporters', auth, adminOnly, adminController.createTransporter);
router.put('/admin/transporters/:id', auth, adminOnly, adminController.updateTransporter);
router.delete('/admin/transporters/:id', auth, adminOnly, adminController.deleteTransporter);
router.post('/admin/impersonate/:id', auth, adminOnly, adminController.impersonateTransporter);

module.exports = router;
