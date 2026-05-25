const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { getModel, isFallback } = require('../config/db');
const { UserSchema, UserLogSchema, BiltySchema } = require('../models/schemas');

const User = getModel('User', UserSchema);
const UserLog = getModel('UserLog', UserLogSchema);
const Bilty = getModel('Bilty', BiltySchema);

const JWT_SECRET = process.env.JWT_SECRET || 'roadwe-super-secret-key-12345';

// Unified Multi-Tenant Demo Data Seeder
const seedDemoData = async (company_id, customData = {}) => {
  try {
    const {
      companyName = 'TRANSCORE LOGISTICS',
      customers = [
        { name: 'TATA STEEL LTD', phone: '9876543210', email: 'logistics@tatasteel.com', gstin: '22AAAAA0000A1Z1', address: 'Jamshedpur Industrial Area', city: 'Jamshedpur' },
        { name: 'RELIANCE INDUSTRIES', phone: '9123456789', email: 'dispatch@ril.com', gstin: '27BBBBB1111B2Z2', address: 'Reliance Refinery', city: 'Jamnagar' }
      ],
      vehicles = [
        { vehicleNumber: 'UP-77-AN-4876', model: 'Tata Signa 4825.T', ownerName: 'Transcore Logistics Owner', ownerPhone: '8269203922' },
        { vehicleNumber: 'DL-01-GB-1234', model: 'Ashok Leyland 3520', ownerName: 'Subhash Transport', ownerPhone: '9988776655' }
      ],
      drivers = [
        { name: 'Ramesh Singh', licenseNumber: 'DL1234567890123', mobile: '9888877777', address: 'Kanpur, UP', commissionRate: 10 }
      ],
      biltyCount = 31,
      biltyNoPrefix = '1000011',
      biltyStartNum = 205,
      fromCity = 'Kanpur',
      toCity = 'Mumbai',
      goodsDescription = 'Iron Sheets / Coils'
    } = customData;

    const biltyCountExisting = await Bilty.countDocuments({ company_id });
    if (biltyCountExisting === 0) {
      console.log(`🌱 Database empty for ${companyName}. Seeding initial operational MERN records...`);

      // 1. Create logs
      await UserLog.create({
        company_id,
        description: `Updated Bilty No. ${biltyNoPrefix}${biltyStartNum} (${vehicles[0].vehicleNumber}) by ${companyName}.`,
        timestamp: new Date().toISOString()
      });
      await UserLog.create({
        company_id,
        description: `Created Bilty No. ${biltyNoPrefix}${biltyStartNum} (${vehicles[0].vehicleNumber}) by ${companyName}.`,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      });
      await UserLog.create({
        company_id,
        description: `Updated Loading Slip No. 504 by ${companyName}.`,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      });

      // 2. Customers
      const { CustomerSchema } = require('../models/schemas');
      const Customer = getModel('Customer', CustomerSchema);
      const createdCustomers = [];
      for (let c of customers) {
        const item = await Customer.create({ company_id, ...c });
        createdCustomers.push(item);
      }

      // 3. Vehicles
      const { VehicleSchema } = require('../models/schemas');
      const Vehicle = getModel('Vehicle', VehicleSchema);
      const createdVehicles = [];
      for (let v of vehicles) {
        const item = await Vehicle.create({
          company_id,
          ...v,
          insuranceExpiry: '2027-12-31',
          rcNumber: 'RC' + v.vehicleNumber.replace(/-/g, '')
        });
        createdVehicles.push(item);
      }

      // 4. Drivers
      const { DriverSchema } = require('../models/schemas');
      const Driver = getModel('Driver', DriverSchema);
      const createdDrivers = [];
      for (let d of drivers) {
        const item = await Driver.create({ company_id, ...d });
        createdDrivers.push(item);
      }

      // 4.1 Branch
      const { BranchSchema } = require('../models/schemas');
      const Branch = getModel('Branch', BranchSchema);
      await Branch.create({
        company_id,
        branchName: `${companyName} (${fromCity} HQ) (ADMIN)`,
        gstin: '09AAACT9211C1ZA',
        phone: '8269203922',
        city: fromCity
      });

      // 4.2 SubUsers
      const { SubUserSchema } = require('../models/schemas');
      const SubUser = getModel('SubUser', SubUserSchema);
      await SubUser.create({
        company_id,
        username: `${companyName.toLowerCase().replace(/\s/g, '_')}_clerk`,
        role: 'Loading Clerk',
        branchAccess: `${fromCity} Branch HQ`,
        mobile: '9876543210',
        status: 'Active Access'
      });

      // 4.3 CashBank
      const { CashBankSchema } = require('../models/schemas');
      const CashBank = getModel('CashBank', CashBankSchema);
      await CashBank.create({
        company_id,
        type: 'Cash',
        name: 'Main Cash Box',
        balance: 25000
      });
      await CashBank.create({
        company_id,
        type: 'Bank',
        name: 'HDFC Corporate Bank Account',
        accountNo: '50100223344',
        ifsc: 'HDFC0000112',
        balance: 450000
      });

      // 4.4 Quotations
      const { QuotationSchema } = require('../models/schemas');
      const Quotation = getModel('Quotation', QuotationSchema);
      await Quotation.create({
        company_id,
        quotationNo: 'Q-2026-001',
        date: new Date().toISOString().split('T')[0],
        type: 'Transport',
        partyName: createdCustomers[0].name,
        fromCity,
        toCity,
        rate: 35000,
        details: 'Freight charges include standard loading fees.'
      });

      // 5. Seed Bilties
      const c1 = createdCustomers[0];
      const c2 = createdCustomers[1] || createdCustomers[0];
      const v1 = createdVehicles[0];

      for (let i = 1; i <= biltyCount; i++) {
        const isTarget = i === biltyCount;
        const num = biltyStartNum - (biltyCount - i);
        const bNo = biltyNoPrefix + String(num).padStart(3, '0');
        await Bilty.create({
          company_id,
          biltyNo: isTarget ? `${biltyNoPrefix}${biltyStartNum}` : bNo,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          fromCity: isTarget ? fromCity : 'Mumbai',
          toCity: isTarget ? toCity : 'Ahmedabad',
          consignorId: c1._id,
          consignorName: c1.name,
          consigneeId: c2._id,
          consigneeName: c2.name,
          vehicleNumber: isTarget ? v1.vehicleNumber : (createdVehicles[1]?.vehicleNumber || v1.vehicleNumber),
          actualWeight: isTarget ? 25 : 15,
          chargedWeight: isTarget ? 26 : 16,
          noOfPackages: isTarget ? 400 : 250,
          goodsDescription: isTarget ? goodsDescription : 'General Logistics Cargo',
          rateType: 'Per Ton',
          rate: 1400,
          freightCharge: isTarget ? 36400 : 22400,
          laborCharge: 1000,
          otherCharges: 600,
          totalFreight: isTarget ? 38000 : 24000,
          paidBy: 'TBB',
          advancePaid: isTarget ? 15000 : 8000,
          balanceAmount: isTarget ? 23000 : 16000,
          deliveryStatus: isTarget ? 'Dispatched' : 'Delivered'
        });
      }
      console.log(`✅ Multi-Tenant data seeding complete for ${companyName}!`);
    }
  } catch (err) {
    console.error(`❌ Seeding failed for custom transporter datasets:`, err);
  }
};

exports.register = async (req, res) => {
  try {
    const { name, companyName, email, mobile, gstin, transportType, address, password } = req.body;

    // 1. Validation checks
    if (!name || !companyName || !email || !mobile || !password) {
      return res.status(400).json({ error: 'All required fields must be completed' });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // 3. Password strength check
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // 4. Duplicate email check
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email address is already registered.' });
    }

    // 5. Duplicate mobile check
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({ error: 'Mobile number is already registered.' });
    }

    const newId = isFallback() 
      ? (Math.random().toString(36).substring(2, 11) + Date.now().toString(36))
      : new mongoose.Types.ObjectId().toString();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      _id: newId,
      name,
      companyName,
      email,
      mobile,
      gstin: gstin || '',
      transportType: transportType || 'Full Truck Load (FTL)',
      address: address || '',
      password: hashedPassword,
      company_id: newId
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { 
        name: user.name, 
        companyName: user.companyName, 
        email: user.email, 
        id: user._id,
        company_id: user.company_id
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Account not found. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Lock out suspended companies immediately
    if (user.subscriptionPlan === 'Suspended') {
      return res.status(403).json({ 
        error: 'Access Denied. Your company workspace has been suspended. Please contact admin@roadwe.com to manage billing or renew your plan.' 
      });
    }

    // Dynamic Multi-tenant seeding checks on user login
    if (user.isSuperAdmin !== true) {
      const matchConfig = transportersConfig.find(tc => tc.email === user.email);
      await seedDemoData(user._id, matchConfig ? matchConfig.customSeeding : {});
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        name: user.name, 
        companyName: user.companyName, 
        email: user.email, 
        id: user._id,
        company_id: user.company_id || user._id,
        role: user.isSuperAdmin ? 'Super Admin' : (user.role || 'Transporter'),
        isSuperAdmin: !!user.isSuperAdmin 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      name: user.name,
      companyName: user.companyName,
      email: user.email,
      mobile: user.mobile,
      gstin: user.gstin,
      transportType: user.transportType,
      address: user.address,
      id: user._id,
      company_id: user.company_id || user._id,
      role: user.isSuperAdmin ? 'Super Admin' : (user.role || 'Transporter'),
      isSuperAdmin: !!user.isSuperAdmin
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Seed configurations definition
const transportersConfig = [
  {
    email: 'transcore@roadwe.com',
    name: 'Transcore Admin',
    companyName: 'TRANSCORE LOGISTICS',
    mobile: '8269203922',
    gstin: '09AAACT9211C1ZA',
    subscriptionPlan: 'Premium Transporter',
    customSeeding: {
      companyName: 'TRANSCORE LOGISTICS',
      customers: [
        { name: 'TATA STEEL LTD', phone: '9876543210', email: 'logistics@tatasteel.com', gstin: '22AAAAA0000A1Z1', address: 'Jamshedpur Industrial Area', city: 'Jamshedpur' },
        { name: 'RELIANCE INDUSTRIES', phone: '9123456789', email: 'dispatch@ril.com', gstin: '27BBBBB1111B2Z2', address: 'Reliance Refinery', city: 'Jamnagar' }
      ],
      vehicles: [
        { vehicleNumber: 'UP-77-AN-4876', model: 'Tata Signa 4825.T', ownerName: 'Transcore Logistics Owner', ownerPhone: '8269203922' },
        { vehicleNumber: 'DL-01-GB-1234', model: 'Ashok Leyland 3520', ownerName: 'Subhash Transport', ownerPhone: '9988776655' }
      ],
      drivers: [
        { name: 'Ramesh Singh', licenseNumber: 'DL1234567890123', mobile: '9888877777', address: 'Kanpur, UP', commissionRate: 10 }
      ],
      biltyCount: 31,
      biltyNoPrefix: '1000011',
      biltyStartNum: 205,
      fromCity: 'Kanpur',
      toCity: 'Mumbai',
      goodsDescription: 'Iron Sheets / Coils'
    }
  },
  {
    email: 'gujaratfreight@roadwe.com',
    name: 'Gujarat Movers Admin',
    companyName: 'GUJARAT FREIGHT MOVERS',
    mobile: '9174076214',
    gstin: '24BBBBM1111B2Z2',
    subscriptionPlan: 'Free Trial',
    customSeeding: {
      companyName: 'GUJARAT FREIGHT MOVERS',
      customers: [
        { name: 'AMBUJA CEMENT LTD', phone: '9000000001', email: 'logistics@ambuja.com', gstin: '24AAAAA0000A1Z1', address: 'Mehsana Road', city: 'Vadodara' },
        { name: 'ADANI PORTS & SEZ', phone: '9000000002', email: 'dispatch@adani.com', gstin: '24BBBBB1111B2Z2', address: 'Mundra Port', city: 'Mundra' }
      ],
      vehicles: [
        { vehicleNumber: 'GJ-01-XX-9999', model: 'Tata Signa 4021.S', ownerName: 'Ahmedabad Transport', ownerPhone: '9000000003' },
        { vehicleNumber: 'GJ-03-YY-7777', model: 'BharatBenz 3523R', ownerName: 'Rajkot Roadlines', ownerPhone: '9000000004' }
      ],
      drivers: [
        { name: 'Devendra Patel', licenseNumber: 'GJ1234567890123', mobile: '9000000005', address: 'Ahmedabad, GJ', commissionRate: 8 }
      ],
      biltyCount: 15,
      biltyNoPrefix: '2000044',
      biltyStartNum: 105,
      fromCity: 'Vadodara',
      toCity: 'Jamnagar',
      goodsDescription: 'Cement Bags'
    }
  },
  {
    email: 'fasttrack@roadwe.com',
    name: 'FastTrack Cargo Admin',
    companyName: 'FASTTRACK CARGO',
    mobile: '9888877777',
    gstin: '27CCCCM1111B2Z2',
    subscriptionPlan: 'Enterprise Gold',
    customSeeding: {
      companyName: 'FASTTRACK CARGO',
      customers: [
        { name: 'AMAZON SELLER SERVICES', phone: '9000000006', email: 'logistics@amazon.com', gstin: '27AAAAA0000A1Z1', address: 'Bhiwandi Warehouse', city: 'Mumbai' },
        { name: 'FLIPKART LOGISTICS', phone: '9000000007', email: 'dispatch@flipkart.com', gstin: '27BBBBB1111B2Z2', address: 'Pune Fulfillment Center', city: 'Pune' }
      ],
      vehicles: [
        { vehicleNumber: 'MH-12-FT-8888', model: 'Tata Ultra 1918', ownerName: 'Mumbai Fast Fleet', ownerPhone: '9000000008' },
        { vehicleNumber: 'MH-43-EX-1111', model: 'Eicher Pro 6028', ownerName: 'Pune Logistics Group', ownerPhone: '9000000009' }
      ],
      drivers: [
        { name: 'Sukhwinder Singh', licenseNumber: 'MH1234567890123', mobile: '9000000010', address: 'Mumbai, MH', commissionRate: 12 }
      ],
      biltyCount: 28,
      biltyNoPrefix: '3000055',
      biltyStartNum: 308,
      fromCity: 'Pune',
      toCity: 'Bangalore',
      goodsDescription: 'E-Commerce Consignments'
    }
  }
];

// Check and auto-seed admin if database is empty on start
exports.ensureAdminSeeded = async () => {
  try {
    // 1. Seed Platform Super Admin
    const superAdmin = await User.findOne({ email: 'admin@roadwe.com' });
    if (!superAdmin) {
      console.log('👑 Seeding default Platform Super Admin user: admin@roadwe.com / admin');
      const adminId = isFallback()
        ? (Math.random().toString(36).substring(2, 11) + Date.now().toString(36))
        : new mongoose.Types.ObjectId().toString();
      const hashedPassword = await bcrypt.hash('admin', 10);
      await User.create({
        _id: adminId,
        name: 'Platform Super Admin',
        companyName: 'Roadwe Platform HQ',
        email: 'admin@roadwe.com',
        mobile: '9999999999',
        password: hashedPassword,
        isSuperAdmin: true,
        financialYear: '26-27',
        company_id: adminId
      });
    }

    // 2. Seed all 3 distinct Transporter Companies
    for (let tConfig of transportersConfig) {
      let tenant = await User.findOne({ email: tConfig.email });
      const newTenantId = isFallback()
        ? (Math.random().toString(36).substring(2, 11) + Date.now().toString(36))
        : new mongoose.Types.ObjectId().toString();
      
      if (!tenant) {
        console.log(`👤 Seeding client Transporter user: ${tConfig.email} (${tConfig.companyName})`);
        const hashedPassword = await bcrypt.hash('admin', 10);
        tenant = await User.create({
          _id: newTenantId,
          name: tConfig.name,
          companyName: tConfig.companyName,
          email: tConfig.email,
          mobile: tConfig.mobile,
          password: hashedPassword,
          gstin: tConfig.gstin,
          subscriptionPlan: tConfig.subscriptionPlan,
          isSuperAdmin: false,
          financialYear: '26-27',
          company_id: newTenantId
        });
        await seedDemoData(tenant._id, tConfig.customSeeding);
      } else {
        // Force update to make sure they are not Super Admin and have correct plans
        let updates = {};
        if (tenant.isSuperAdmin === true) updates.isSuperAdmin = false;
        if (tenant.subscriptionPlan !== tConfig.subscriptionPlan) updates.subscriptionPlan = tConfig.subscriptionPlan;
        if (!tenant.company_id) updates.company_id = tenant._id;
        
        if (Object.keys(updates).length > 0) {
          await User.findByIdAndUpdate(tenant._id, updates);
        }
        await seedDemoData(tenant._id, tConfig.customSeeding);
      }
    }
  } catch (err) {
    console.error('Error seeding admins:', err);
  }
};
