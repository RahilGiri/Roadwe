const { getModel } = require('../config/db');
const { 
  BiltySchema, 
  LoadingSlipSchema, 
  ChalanSchema, 
  InvoiceSchema, 
  VoucherSchema,
  UserLogSchema,
  CustomerSchema,
  DriverSchema
} = require('../models/schemas');

const Bilty = getModel('Bilty', BiltySchema);
const LoadingSlip = getModel('LoadingSlip', LoadingSlipSchema);
const Chalan = getModel('Chalan', ChalanSchema);
const Invoice = getModel('Invoice', InvoiceSchema);
const Voucher = getModel('Voucher', VoucherSchema);
const UserLog = getModel('UserLog', UserLogSchema);
const Customer = getModel('Customer', CustomerSchema);
const Driver = getModel('Driver', DriverSchema);

// Fetch total counters for dashboard tiles and live activity streams
exports.getDashboardStats = async (req, res) => {
  try {
    const transporterId = req.userId;

    const biltyCount = await Bilty.countDocuments({ transporterId });
    const loadingSlipCount = await LoadingSlip.countDocuments({ transporterId });
    const invoiceCount = await Invoice.countDocuments({ transporterId });
    const chalanCount = await Chalan.countDocuments({ transporterId });
    const voucherCount = await Voucher.countDocuments({ transporterId });
    const customerCount = await Customer.countDocuments({ transporterId });
    const driverCount = await Driver.countDocuments({ transporterId });

    // Get today's activity logs, sorted descending by timestamp
    const logs = await UserLog.find({ transporterId });
    const sortedLogs = logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8); // Top 8 recent events

    res.json({
      counts: {
        bilty: biltyCount,
        loadingSlip: loadingSlipCount,
        invoice: invoiceCount,
        chalan: chalanCount,
        voucher: voucherCount,
        customer: customerCount,
        driver: driverCount,
        letterhead: 0,
        deliverySlip: 0,
        quotation: 0,
        locationTracking: 3 // Active mock vehicles
      },
      logs: sortedLogs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Return active coordinates and checkpoints of mock cargo trucks on Indian routes
exports.getLiveTrucks = async (req, res) => {
  try {
    const mockTrucks = [
      {
        id: 'T1',
        vehicleNumber: 'UP-77-AN-4876',
        driver: 'Ramesh Singh',
        from: 'Kanpur',
        to: 'Mumbai',
        cargo: 'Iron Sheets / Coils',
        status: 'In Transit',
        speed: '58 km/h',
        progress: 62,
        routeCoords: [
          [26.4499, 80.3319], // Kanpur
          [25.4484, 78.5685], // Jhansi
          [23.2599, 77.4126], // Bhopal
          [22.7196, 75.8577], // Indore
          [20.9980, 75.3467], // Jalgaon
          [19.0760, 72.8777]  // Mumbai
        ],
        currentLocation: [23.125, 77.214], // Near Bhopal
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'T2',
        vehicleNumber: 'DL-01-GB-1234',
        driver: 'Sukhdev Singh',
        from: 'Jamshedpur',
        to: 'Jamnagar',
        cargo: 'Chemical Barrels',
        status: 'Loading Party',
        speed: '0 km/h (Stopped)',
        progress: 100,
        routeCoords: [
          [22.8046, 86.2029], // Jamshedpur
          [22.4707, 70.0577]  // Jamnagar
        ],
        currentLocation: [22.4707, 70.0577], // Arrived
        lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: 'T3',
        vehicleNumber: 'MH-12-PQ-9999',
        driver: 'Amit Kumar',
        from: 'Delhi',
        to: 'Kolkata',
        cargo: 'Electronics Part',
        status: 'In Transit',
        speed: '72 km/h',
        progress: 35,
        routeCoords: [
          [28.7041, 77.1025], // Delhi
          [26.8467, 80.9462], // Lucknow
          [25.3176, 82.9739], // Varanasi
          [22.5726, 88.3639]  // Kolkata
        ],
        currentLocation: [26.112, 81.350], // Near Rae Bareli
        lastUpdated: new Date().toISOString()
      }
    ];

    res.json(mockTrucks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
