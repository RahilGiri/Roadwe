const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 1. Transporter (User)
const UserSchema = new Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  company_id: { type: String }, // Links to itself
  address: { type: String, default: '' },
  gstin: { type: String, default: '' },
  transportType: { type: String, default: '' },
  subscriptionPlan: { type: String, default: 'Free Trial' },
  financialYear: { type: String, default: '26-27' },
  isSuperAdmin: { type: Boolean, default: false }
}, { timestamps: true });

// 2. Customer Master
const CustomerSchema = new Schema({
  company_id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  gstin: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, required: true }
}, { timestamps: true });

// 3. Vehicle Master
const VehicleSchema = new Schema({
  company_id: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  model: { type: String, default: '' },
  ownerName: { type: String, default: '' },
  ownerPhone: { type: String, default: '' },
  insuranceExpiry: { type: String, default: '' },
  rcNumber: { type: String, default: '' }
}, { timestamps: true });

// 4. Driver Master
const DriverSchema = new Schema({
  company_id: { type: String, required: true },
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, default: '' },
  commissionRate: { type: Number, default: 0 }
}, { timestamps: true });

// 5. Bilty (Lorry Receipt / LR)
const BiltySchema = new Schema({
  company_id: { type: String, required: true },
  biltyNo: { type: String, required: true },
  date: { type: String, required: true },
  fromCity: { type: String, required: true },
  toCity: { type: String, required: true },
  consignorId: { type: String, required: true },
  consignorName: { type: String, required: true },
  consigneeId: { type: String, required: true },
  consigneeName: { type: String, required: true },
  vehicleId: { type: String, default: '' },
  vehicleNumber: { type: String, required: true },
  actualWeight: { type: Number, default: 0 },
  chargedWeight: { type: Number, default: 0 },
  noOfPackages: { type: Number, default: 0 },
  goodsDescription: { type: String, default: '' },
  rateType: { type: String, enum: ['Per Ton', 'Fixed'], default: 'Fixed' },
  rate: { type: Number, default: 0 },
  freightCharge: { type: Number, default: 0 },
  laborCharge: { type: Number, default: 0 },
  otherCharges: { type: Number, default: 0 },
  totalFreight: { type: Number, default: 0 },
  paidBy: { type: String, enum: ['Consignor', 'Consignee', 'TBB'], default: 'TBB' },
  advancePaid: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  deliveryStatus: { type: String, enum: ['Pending', 'Dispatched', 'Delivered'], default: 'Pending' },
  receivingSignature: { type: String, default: '' } // Base64 or local sign path
}, { timestamps: true });

// 6. Loading Slip
const LoadingSlipSchema = new Schema({
  company_id: { type: String, required: true },
  slipNo: { type: String, required: true },
  date: { type: String, required: true },
  consignorName: { type: String, required: true },
  fromCity: { type: String, required: true },
  toCity: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  brokerName: { type: String, default: '' },
  freightPromised: { type: Number, default: 0 },
  driverAdvance: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  remarks: { type: String, default: '' }
}, { timestamps: true });

// 7. Truck Hire Chalan
const ChalanSchema = new Schema({
  company_id: { type: String, required: true },
  chalanNo: { type: String, required: true },
  date: { type: String, required: true },
  branchCode: { type: String, default: '' },
  financialYear: { type: String, default: '2026-2027' },
  supplierName: { type: String, required: true },
  supplierMobile: { type: String, default: '' },
  supplierPan: { type: String, default: '' },
  supplierAddress: { type: String, default: '' },
  consignorName: { type: String, default: '' },
  consigneeName: { type: String, default: '' },
  brokerName: { type: String, default: '' },
  vehicleNumber: { type: String, required: true },
  fromCity: { type: String, required: true },
  toCity: { type: String, required: true },
  driverName: { type: String, required: true },
  driverDl: { type: String, default: '' },
  driverMobile: { type: String, default: '' },
  biltyNo: { type: String, default: '' },
  biltyDate: { type: String, default: '' },
  materialName: { type: String, default: '' },
  freightType: { type: String, default: 'Select Freight Type' },
  weight: { type: Number, default: 0 },
  unit: { type: String, default: 'MT (Metric Ton)' },
  rate: { type: Number, default: 0 },
  isFixed: { type: Boolean, default: false },
  lorryFreight: { type: Number, default: 0 },
  haltingCharges: { type: Number, default: 0 },
  belowChargesType: { type: String, default: 'Plus (+) to Freight' },
  hamaliCharges: { type: Number, default: 0 },
  serviceCharge: { type: Number, default: 0 },
  otherCharge: { type: Number, default: 0 },
  shortageQty: { type: Number, default: 0 },
  shortageUnit: { type: String, default: 'MT (Metric Ton)' },
  shortageAmt: { type: Number, default: 0 },
  advAmt1: { type: Number, default: 0 },
  advMode1: { type: String, default: 'Select Advance Payment Mode' },
  advDate1: { type: String, default: '' },
  advAmt2: { type: Number, default: 0 },
  advMode2: { type: String, default: 'Select Advance Payment Mode' },
  advDate2: { type: String, default: '' },
  advAmt3: { type: Number, default: 0 },
  advMode3: { type: String, default: 'Select Advance Payment Mode' },
  advDate3: { type: String, default: '' },
  advAmt4: { type: Number, default: 0 },
  advMode4: { type: String, default: 'Select Advance Payment Mode' },
  advDate4: { type: String, default: '' },
  dieselAdvance: { type: Number, default: 0 },
  selectedPump: { type: String, default: 'Select Pump' },
  pumpPaymentMode: { type: String, default: 'Select Payment Mode' },
  advancePaid: { type: Number, default: 0 },
  dieselCardCharge: { type: Number, default: 0 },
  commissionType: { type: String, default: 'Fixed' },
  commissionAmount: { type: Number, default: 0 },
  commissionPlusMinus: { type: String, default: 'None' },
  commission: { type: Number, default: 0 },
  tdsAmount: { type: Number, default: 0 },
  officeExpenses: { type: Number, default: 0 },
  balanceToDriver: { type: Number, default: 0 },
  commissionStatus: { type: String, default: 'Commission Payment Status' },
  balancePayableAt: { type: String, default: '' },
  remarks: { type: String, default: '' },
  hideDatetime: { type: Boolean, default: false },
  signatureData: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
}, { timestamps: true });

// 8. Invoice
const InvoiceSchema = new Schema({
  company_id: { type: String, required: true },
  invoiceNo: { type: String, required: true },
  date: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  bilties: { type: [String], default: [] }, // Array of Bilty numbers or IDs
  totalFreight: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  dueDate: { type: String, default: '' }
}, { timestamps: true });

// 9. Voucher (Receipts/Payments)
const VoucherSchema = new Schema({
  company_id: { type: String, required: true },
  voucherNo: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['Receipt', 'Payment'], required: true },
  partyName: { type: String, required: true },
  description: { type: String, default: '' },
  amount: { type: Number, default: 0 }
}, { timestamps: true });

// 10. User Activity Log (For Dashboard logs stream)
const UserLogSchema = new Schema({
  company_id: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: String, required: true }
});

// 11. Branch Schema
const BranchSchema = new Schema({
  company_id: { type: String, required: true },
  branchName: { type: String, required: true },
  gstin: { type: String, default: '' },
  phone: { type: String, default: '' },
  city: { type: String, required: true }
}, { timestamps: true });

// 12. Quotation Schema
const QuotationSchema = new Schema({
  company_id: { type: String, required: true },
  quotationNo: { type: String, required: true },
  date: { type: String, required: true },
  type: { type: String, enum: ['Transport', 'P&M'], default: 'Transport' },
  partyName: { type: String, required: true },
  fromCity: { type: String, required: true },
  toCity: { type: String, required: true },
  rate: { type: Number, default: 0 },
  details: { type: String, default: '' }
}, { timestamps: true });

// 13. SubUser Schema
const SubUserSchema = new Schema({
  company_id: { type: String, required: true },
  username: { type: String, required: true },
  role: { type: String, required: true },
  branchAccess: { type: String, required: true },
  mobile: { type: String, default: '' },
  email: { type: String, default: '' },
  empCode: { type: String, default: '' },
  status: { type: String, enum: ['Active Access', 'Inactive'], default: 'Active Access' },
  twoFactorEnabled: { type: Boolean, default: false },
  allowedBranches: { type: [String], default: [] },
  loginLogs: { type: Array, default: [] }
}, { timestamps: true });

// 14. Cash/Bank Schema
const CashBankSchema = new Schema({
  company_id: { type: String, required: true },
  type: { type: String, enum: ['Cash', 'Bank'], required: true },
  name: { type: String, required: true },
  accountNo: { type: String, default: '' },
  ifsc: { type: String, default: '' },
  balance: { type: Number, default: 0 }
}, { timestamps: true });

// 15. Supplier Advance Schema
const SupplierAdvanceSchema = new Schema({
  company_id: { type: String, required: true },
  supplierName: { type: String, required: true },
  supplierPan: { type: String, default: '' },
  paymentDate: { type: String, required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  settledAmount: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  createdBy: { type: String, default: 'Transcore Admin' }
}, { timestamps: true });

// 16. Dynamic Role Schema
const RoleSchema = new Schema({
  company_id: { type: String, required: true },
  name: { type: String, required: true },
  key: { type: String, required: true },
  description: { type: String, default: '' },
  isPredefined: { type: Boolean, default: false },
  permissions: { type: Array, default: [] }, // Array of modules with sub-actions
  allowedBranches: { type: [String], default: ['ALL'] }
}, { timestamps: true });

// 17. Detailed Audit Log Schema
const AuditLogSchema = new Schema({
  company_id: { type: String, required: true },
  userId: { type: String, required: true },
  operatorName: { type: String, required: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: String, required: true }
});

// 18. Permission Change History Schema
const PermissionHistorySchema = new Schema({
  company_id: { type: String, required: true },
  operatorName: { type: String, required: true },
  changedByName: { type: String, required: true },
  changeDescription: { type: String, required: true },
  timestamp: { type: String, required: true }
});

module.exports = {
  UserSchema,
  CustomerSchema,
  VehicleSchema,
  DriverSchema,
  BiltySchema,
  LoadingSlipSchema,
  ChalanSchema,
  InvoiceSchema,
  VoucherSchema,
  UserLogSchema,
  BranchSchema,
  QuotationSchema,
  SubUserSchema,
  CashBankSchema,
  SupplierAdvanceSchema,
  RoleSchema,
  AuditLogSchema,
  PermissionHistorySchema
};
