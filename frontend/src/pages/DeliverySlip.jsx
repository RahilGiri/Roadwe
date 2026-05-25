import React, { useState, useEffect } from 'react';
import { Plus, Printer, FileText, Share2, Search, X, Check, Filter } from 'lucide-react';

const API_BASE = '/api';

export default function DeliverySlip({ token, activePage, setActivePage }) {
  // Local list of delivery slips with persistent storage fallback
  const [slips, setSlips] = useState(() => {
    const saved = localStorage.getItem('roadwe_delivery_slips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Pre-seeded high-fidelity slips matching dynamic dashboard and list items
    return [
      {
        _id: 'ds1',
        deliverySlipNo: 'DS-204',
        generateDate: '2026-05-23',
        branchCode: 'BR-VAL',
        financialYear: '2026-2027',
        senderName: 'RELIANCE INDUSTRIES',
        senderGst: '27AAACR5678Q2Z2',
        senderMobile: '9988776655',
        receiverName: 'TATA STEEL LTD',
        receiverGst: '34AAACT1234F1Z1',
        receiverMobile: '9876543210',
        transportName: 'TRANSCORE LOGISTICS',
        transportMobile: '8269203922',
        fromLocation: 'Vadodara Refinery',
        toLocation: 'Jamshedpur Works',
        materialName: 'Polyester Polymer Chips',
        biltyNo: 'LR-1000011205',
        numArticles: '280 Bags',
        truckNo: 'GJ-03-AX-8877',
        driverName: 'Suresh Yadav',
        driverMobile: '9123456789',
        driverLicense: 'DL-9211C194',
        
        // Detailed freight charges
        freightAmount: 40000,
        deliveryCharge: 1500,
        labourCharge: 2000,
        biltyCharge: 500,
        haltingCharge: 1000,
        warehouseCharge: 0,
        localTransportCharge: 0,
        otherCharge: 0,
        totalAmount: 45000,
        advanceAmount: 15000,
        balanceAmount: 30000,
        
        // Delivery courier and remarks
        deliveryByName: 'Rajesh Kumar',
        deliveryByMobile: '9345678901',
        remark: 'Received materials in sealed bags. No shortages observed during offloading.',
        hideDatetime: false,
        status: 'Delivered & Signed'
      },
      {
        _id: 'ds2',
        deliverySlipNo: 'DS-203',
        generateDate: '2026-05-20',
        branchCode: 'BR-KAN',
        financialYear: '2026-2027',
        senderName: 'TATA STEEL LTD',
        senderGst: '34AAACT1234F1Z1',
        senderMobile: '9876543210',
        receiverName: 'RELIANCE INDUSTRIES',
        receiverGst: '27AAACR5678Q2Z2',
        receiverMobile: '9988776655',
        transportName: 'ROADWE LOGISTICS SOLUTIONS',
        transportMobile: '8423295286',
        fromLocation: 'Jamshedpur Stockyard',
        toLocation: 'Thane Warehousing Hub',
        materialName: 'Cold Rolled Steel Sheets',
        biltyNo: 'LR-1000011204',
        numArticles: '16 Coils',
        truckNo: 'MH-12-PQ-9999',
        driverName: 'Satish Pandey',
        driverMobile: '9890123456',
        driverLicense: 'DL-4876H204',
        
        // Detailed freight charges
        freightAmount: 35000,
        deliveryCharge: 1000,
        labourCharge: 1500,
        biltyCharge: 500,
        haltingCharge: 0,
        warehouseCharge: 0,
        localTransportCharge: 0,
        otherCharge: 0,
        totalAmount: 38000,
        advanceAmount: 8000,
        balanceAmount: 30000,
        
        // Delivery courier and remarks
        deliveryByName: 'Amrit Pal',
        deliveryByMobile: '9456789012',
        remark: 'Steel sheets offloaded safely. Verified coils count and weights checklist.',
        hideDatetime: false,
        status: 'Delivered & Signed'
      }
    ];
  });

  // State variables for Creator Form (Screenshot 5)
  const [deliverySlipNo, setDeliverySlipNo] = useState('DS-205');
  const [generateDate, setGenerateDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [branchCode, setBranchCode] = useState('');
  const [financialYear, setFinancialYear] = useState('2026-2027');

  // Party Details
  const [senderName, setSenderName] = useState('');
  const [senderGst, setSenderGst] = useState('');
  const [senderMobile, setSenderMobile] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverGst, setReceiverGst] = useState('');
  const [receiverMobile, setReceiverMobile] = useState('');

  // Parcel Details
  const [transportName, setTransportName] = useState('');
  const [transportMobile, setTransportMobile] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  // Material Details
  const [materialName, setMaterialName] = useState('');
  const [biltyNo, setBiltyNo] = useState('');
  const [numArticles, setNumArticles] = useState('');

  // Truck Details (Grid layout)
  const [truckNo, setTruckNo] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverMobile, setDriverMobile] = useState('');
  const [driverLicense, setDriverLicense] = useState('');

  // --- High-Fidelity 8-Charge Surcharges state (Screenshots 1 & 2) ---
  const [freightAmount, setFreightAmount] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [labourCharge, setLabourCharge] = useState('');
  const [biltyCharge, setBiltyCharge] = useState('');
  const [haltingCharge, setHaltingCharge] = useState('');
  const [warehouseCharge, setWarehouseCharge] = useState('');
  const [localTransportCharge, setLocalTransportCharge] = useState('');
  const [otherCharge, setOtherCharge] = useState('');
  
  // Math calculations
  const [totalAmount, setTotalAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [balanceAmount, setBalanceAmount] = useState(0);

  // Delivery Courier & Print settings (Screenshot 2)
  const [deliveryByName, setDeliveryByName] = useState('');
  const [deliveryByMobile, setDeliveryByMobile] = useState('');
  const [remark, setRemark] = useState('');
  const [hideDatetime, setHideDatetime] = useState(false);

  // --- Double-Row Filter Modal states (Screenshot 5) ---
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterSender, setFilterSender] = useState('Select Sender Name');
  const [filterReceiver, setFilterReceiver] = useState('Select Receiver Name');
  const [filterTransport, setFilterTransport] = useState('Select Transport Name');
  const [filterTruck, setFilterTruck] = useState('Select Truck No.');
  const [filterSlip, setFilterSlip] = useState('Select Slip No.');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Active list filters
  const [appliedSender, setAppliedSender] = useState('');
  const [appliedReceiver, setAppliedReceiver] = useState('');
  const [appliedTransport, setAppliedTransport] = useState('');
  const [appliedTruck, setAppliedTruck] = useState('');
  const [appliedSlip, setAppliedSlip] = useState('');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  // --- Double-Row Report Options Dialog Modal states (Screenshot 4) ---
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSender, setReportSender] = useState('Select Sender Name');
  const [reportReceiver, setReportReceiver] = useState('Select Receiver Name');
  const [reportTransport, setReportTransport] = useState('Select Transport Name');
  const [reportTruck, setReportTruck] = useState('Select Truck No.');
  const [reportSlip, setReportSlip] = useState('Select Slip No.');
  const [reportFromDate, setReportFromDate] = useState('');
  const [reportToDate, setReportToDate] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [viewingSlip, setViewingSlip] = useState(null);
  const [printingRegister, setPrintingRegister] = useState(null); // Compiled report for printing

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('roadwe_delivery_slips', JSON.stringify(slips));
  }, [slips]);

  // Compute total amount and balance amount dynamically in real-time
  useEffect(() => {
    const f = parseFloat(freightAmount) || 0;
    const d = parseFloat(deliveryCharge) || 0;
    const l = parseFloat(labourCharge) || 0;
    const b = parseFloat(biltyCharge) || 0;
    const h = parseFloat(haltingCharge) || 0;
    const w = parseFloat(warehouseCharge) || 0;
    const lt = parseFloat(localTransportCharge) || 0;
    const o = parseFloat(otherCharge) || 0;
    
    const sum = f + d + l + b + h + w + lt + o;
    setTotalAmount(sum);

    const adv = parseFloat(advanceAmount) || 0;
    setBalanceAmount(sum - adv);
  }, [
    freightAmount, deliveryCharge, labourCharge, biltyCharge, haltingCharge, 
    warehouseCharge, localTransportCharge, otherCharge, advanceAmount
  ]);

  // Determine prefill sequence for new delivery slips
  useEffect(() => {
    if (activePage === 'delivery-create') {
      const nextNum = slips.length > 0 
        ? 'DS-' + (Math.max(...slips.map(s => {
            const matches = s.deliverySlipNo.match(/\d+/);
            return matches ? parseInt(matches[0]) : 0;
          })) + 1)
        : 'DS-205';
      setDeliverySlipNo(nextNum);
      setBranchCode('');
      setFinancialYear('2026-2027');
      setSenderName('');
      setSenderGst('');
      setSenderMobile('');
      setReceiverName('');
      setReceiverGst('');
      setReceiverMobile('');
      setTransportName('');
      setTransportMobile('');
      setFromLocation('');
      setToLocation('');
      setMaterialName('');
      setBiltyNo('');
      setNumArticles('');
      setTruckNo('');
      setDriverName('');
      setDriverMobile('');
      setDriverLicense('');
      
      // Reset Surcharges
      setFreightAmount('');
      setDeliveryCharge('');
      setLabourCharge('');
      setBiltyCharge('');
      setHaltingCharge('');
      setWarehouseCharge('');
      setLocalTransportCharge('');
      setOtherCharge('');
      setAdvanceAmount('');
      
      // Reset Courier & Remarks
      setDeliveryByName('');
      setDeliveryByMobile('');
      setRemark('');
      setHideDatetime(false);
    }
  }, [activePage, slips]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!deliverySlipNo.trim() || !generateDate) {
      alert('Delivery Slip Number and Generate Date are required.');
      return;
    }

    const newSlip = {
      _id: 'ds_' + Date.now(),
      deliverySlipNo,
      generateDate,
      branchCode,
      financialYear,
      senderName,
      senderGst,
      senderMobile,
      receiverName,
      receiverGst,
      receiverMobile,
      transportName,
      transportMobile,
      fromLocation,
      toLocation,
      materialName,
      biltyNo,
      numArticles,
      truckNo,
      driverName,
      driverMobile,
      driverLicense,
      
      // Charges mapping
      freightAmount: parseFloat(freightAmount) || 0,
      deliveryCharge: parseFloat(deliveryCharge) || 0,
      labourCharge: parseFloat(labourCharge) || 0,
      biltyCharge: parseFloat(biltyCharge) || 0,
      haltingCharge: parseFloat(haltingCharge) || 0,
      warehouseCharge: parseFloat(warehouseCharge) || 0,
      localTransportCharge: parseFloat(localTransportCharge) || 0,
      otherCharge: parseFloat(otherCharge) || 0,
      totalAmount: totalAmount || 0,
      advanceAmount: parseFloat(advanceAmount) || 0,
      balanceAmount: balanceAmount || 0,
      
      deliveryByName,
      deliveryByMobile,
      remark,
      hideDatetime,
      status: 'Delivered & Signed'
    };

    setSlips([newSlip, ...slips]);
    alert('Delivery Slip Generated Successfully!');
    setActivePage('delivery-list');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this delivery slip?')) {
      setSlips(slips.filter(s => s._id !== id));
    }
  };

  // Compile unique lists for filter/report dropdowns
  const uniqueSenders = Array.from(new Set(slips.map(s => s.senderName))).filter(Boolean);
  const uniqueReceivers = Array.from(new Set(slips.map(s => s.receiverName))).filter(Boolean);
  const uniqueTransports = Array.from(new Set(slips.map(s => s.transportName))).filter(Boolean);
  const uniqueTrucks = Array.from(new Set(slips.map(s => s.truckNo))).filter(Boolean);
  const uniqueSlips = Array.from(new Set(slips.map(s => s.deliverySlipNo))).filter(Boolean);

  // Apply filters to list
  const filteredSlips = slips.filter(s => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSearch = s.senderName.toLowerCase().includes(q) || 
                          s.receiverName.toLowerCase().includes(q) || 
                          s.deliverySlipNo.toLowerCase().includes(q) ||
                          s.truckNo.toLowerCase().includes(q) ||
                          (s.biltyNo && s.biltyNo.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    // 2. Sender Filter
    if (appliedSender && s.senderName !== appliedSender) return false;

    // 3. Receiver Filter
    if (appliedReceiver && s.receiverName !== appliedReceiver) return false;

    // 4. Transport Filter
    if (appliedTransport && s.transportName !== appliedTransport) return false;

    // 5. Truck Filter
    if (appliedTruck && s.truckNo !== appliedTruck) return false;

    // 6. Slip Filter
    if (appliedSlip && s.deliverySlipNo !== appliedSlip) return false;

    // 7. Date Filters
    if (appliedFromDate && s.generateDate < appliedFromDate) return false;
    if (appliedToDate && s.generateDate > appliedToDate) return false;

    return true;
  });

  const handleSearchFilter = () => {
    setAppliedSender(filterSender === 'Select Sender Name' ? '' : filterSender);
    setAppliedReceiver(filterReceiver === 'Select Receiver Name' ? '' : filterReceiver);
    setAppliedTransport(filterTransport === 'Select Transport Name' ? '' : filterTransport);
    setAppliedTruck(filterTruck === 'Select Truck No.' ? '' : filterTruck);
    setAppliedSlip(filterSlip === 'Select Slip No.' ? '' : filterSlip);
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilterSender('Select Sender Name');
    setFilterReceiver('Select Receiver Name');
    setFilterTransport('Select Transport Name');
    setFilterTruck('Select Truck No.');
    setFilterSlip('Select Slip No.');
    setFilterFromDate('');
    setFilterToDate('');
    
    setAppliedSender('');
    setAppliedReceiver('');
    setAppliedTransport('');
    setAppliedTruck('');
    setAppliedSlip('');
    setAppliedFromDate('');
    setAppliedToDate('');
  };

  // Compile report sheets
  const handleGenerateReport = () => {
    const reportData = slips.filter(s => {
      if (reportSender !== 'Select Sender Name' && s.senderName !== reportSender) return false;
      if (reportReceiver !== 'Select Receiver Name' && s.receiverName !== reportReceiver) return false;
      if (reportTransport !== 'Select Transport Name' && s.transportName !== reportTransport) return false;
      if (reportTruck !== 'Select Truck No.' && s.truckNo !== reportTruck) return false;
      if (reportSlip !== 'Select Slip No.' && s.deliverySlipNo !== reportSlip) return false;
      if (reportFromDate && s.generateDate < reportFromDate) return false;
      if (reportToDate && s.generateDate > reportToDate) return false;
      return true;
    });

    setPrintingRegister(reportData);
    setIsReportModalOpen(false);
  };

  const isListMode = activePage === 'delivery-list';
  const isCreateMode = activePage === 'delivery-create';

  return (
    <div style={styles.container}>
      {/* CREATOR FORM VIEW (Screenshot 1 & 2) */}
      {isCreateMode && (
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Delivery Slip Form</h2>
            <button 
              className="btn btn-secondary" 
              style={{ backgroundColor: '#0066cc', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '0.85rem' }}
              onClick={() => setActivePage('delivery-list')}
            >
              Delivery Slip List
            </button>
          </div>

          <form onSubmit={handleGenerate} style={{ marginTop: '20px' }}>
            {/* Metadata Section */}
            <div style={styles.row}>
              <div style={styles.col4}>
                <label style={styles.label}>Delivery Slip Number <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  value={deliverySlipNo}
                  onChange={(e) => setDeliverySlipNo(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div style={styles.col4}>
                <label style={styles.label}>Delivery Slip Generate Date <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="date" 
                  value={generateDate}
                  onChange={(e) => setGenerateDate(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div style={styles.col4}>
                <label style={styles.label}>Branch Code</label>
                <input 
                  type="text" 
                  placeholder="Branch Code" 
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col4}>
                <label style={styles.label}>Financial Year</label>
                <select 
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  className="form-control"
                >
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                  <option value="2027-2028">2027-2028</option>
                </select>
              </div>
            </div>

            {/* Party Details Divider */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Party Details</span>
            </div>

            <div style={styles.row}>
              {/* Sender info */}
              <div style={styles.col3}>
                <label style={styles.label}>Sender name</label>
                <input 
                  type="text" 
                  placeholder="Sender Name" 
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Sender GST Number</label>
                <input 
                  type="text" 
                  placeholder="Sender GST Number" 
                  value={senderGst}
                  onChange={(e) => setSenderGst(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Sender Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="Sender Mobile Number" 
                  value={senderMobile}
                  onChange={(e) => setSenderMobile(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ ...styles.row, marginTop: '12px' }}>
              {/* Receiver info */}
              <div style={styles.col3}>
                <label style={styles.label}>Receiver name</label>
                <input 
                  type="text" 
                  placeholder="Receiver Name" 
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Receiver GST Number</label>
                <input 
                  type="text" 
                  placeholder="Receiver GST Number" 
                  value={receiverGst}
                  onChange={(e) => setReceiverGst(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Receiver Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="Receiver Mobile Number" 
                  value={receiverMobile}
                  onChange={(e) => setReceiverMobile(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Parcel Details Divider */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Parcel Details</span>
            </div>

            <div style={styles.row}>
              <div style={styles.col3}>
                <label style={styles.label}>Transport Name</label>
                <input 
                  type="text" 
                  placeholder="Transport Name" 
                  value={transportName}
                  onChange={(e) => setTransportName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Transport Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="Transport Mobile Number" 
                  value={transportMobile}
                  onChange={(e) => setTransportMobile(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Parcel From Location</label>
                <input 
                  type="text" 
                  placeholder="Parcel From" 
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Parcel To Location</label>
                <input 
                  type="text" 
                  placeholder="Parcel To" 
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Material Details Divider */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Material Details</span>
            </div>

            <div style={styles.row}>
              <div style={styles.col3}>
                <label style={styles.label}>Material Name</label>
                <input 
                  type="text" 
                  placeholder="Material Name" 
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Bilty/LR Number</label>
                <input 
                  type="text" 
                  placeholder="Bilty/LR Number" 
                  value={biltyNo}
                  onChange={(e) => setBiltyNo(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Number of Article</label>
                <input 
                  type="text" 
                  placeholder="Number of Article" 
                  value={numArticles}
                  onChange={(e) => setNumArticles(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Truck Details Divider */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Truck Details</span>
            </div>

            <div style={styles.row}>
              <div style={styles.col3}>
                <label style={styles.label}>Truck Number</label>
                <input 
                  type="text" 
                  placeholder="Truck Number" 
                  value={truckNo}
                  onChange={(e) => setTruckNo(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Driver Name</label>
                <input 
                  type="text" 
                  placeholder="Driver Name" 
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Driver Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="Driver Mobile Number" 
                  value={driverMobile}
                  onChange={(e) => setDriverMobile(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>License Number</label>
                <input 
                  type="text" 
                  placeholder="License Number" 
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* High-Fidelity 8-Charge Freight Details (Screenshots 1 & 2) */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Freight Details</span>
            </div>

            {/* Charge inputs row 1 */}
            <div style={styles.row}>
              <div style={styles.col4}>
                <label style={styles.label}>Freight Amount</label>
                <input 
                  type="number" 
                  placeholder="Enter Freight Amount" 
                  value={freightAmount}
                  onChange={(e) => setFreightAmount(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col4}>
                <label style={styles.label}>Delivery Charge</label>
                <input 
                  type="number" 
                  placeholder="Enter Delivery Charge" 
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col4}>
                <label style={styles.label}>Labour Charge</label>
                <input 
                  type="number" 
                  placeholder="Enter Labour Charge" 
                  value={labourCharge}
                  onChange={(e) => setLabourCharge(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col4}>
                <label style={styles.label}>Bilty Charge</label>
                <input 
                  type="number" 
                  placeholder="Enter Bilty Charge" 
                  value={biltyCharge}
                  onChange={(e) => setBiltyCharge(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Charge inputs row 2 */}
            <div style={{ ...styles.row, marginTop: '12px' }}>
              <div style={styles.col4}>
                <label style={styles.label}>Halting Charge</label>
                <input 
                  type="number" 
                  placeholder="Enter Halting Charge" 
                  value={haltingCharge}
                  onChange={(e) => setHaltingCharge(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col4}>
                <label style={styles.label}>Warehouse Charge</label>
                <input 
                  type="number" 
                  placeholder="Enter Warehouse Charge" 
                  value={warehouseCharge}
                  onChange={(e) => setWarehouseCharge(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col4}>
                <label style={styles.label}>Local Transport Charge</label>
                <input 
                  type="number" 
                  placeholder="Enter Local Transport Charge" 
                  value={localTransportCharge}
                  onChange={(e) => setLocalTransportCharge(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col4}>
                <label style={styles.label}>Other Charge</label>
                <input 
                  type="number" 
                  placeholder="Enter Other Charge" 
                  value={otherCharge}
                  onChange={(e) => setOtherCharge(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Calculations Row */}
            <div style={{ ...styles.row, marginTop: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div style={styles.col3}>
                <label style={styles.label}>Total Amount</label>
                <input 
                  type="number" 
                  value={totalAmount}
                  className="form-control"
                  style={{ backgroundColor: '#ffffff', fontWeight: '700', color: '#0f172a' }}
                  readOnly
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Advance Amount</label>
                <input 
                  type="number" 
                  placeholder="Advance Amount" 
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Balance Amount</label>
                <input 
                  type="number" 
                  value={balanceAmount}
                  className="form-control"
                  style={{ backgroundColor: '#f1f5f9', fontWeight: '700', color: '#10b981' }}
                  readOnly
                />
              </div>
            </div>

            {/* Delivery By section (Screenshot 2) */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Delivery By</span>
            </div>
            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>Name</label>
                <input 
                  type="text" 
                  placeholder="Enter Name" 
                  value={deliveryByName}
                  onChange={(e) => setDeliveryByName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col}>
                <label style={styles.label}>Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="Enter Mobile Number" 
                  value={deliveryByMobile}
                  onChange={(e) => setDeliveryByMobile(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Remark section (Screenshot 2) */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Remark</span>
            </div>
            <div style={styles.row}>
              <div style={styles.col12}>
                <label style={styles.label}>Remark</label>
                <textarea 
                  placeholder="Remark" 
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="form-control"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Suppress DateTime configuration */}
            <div style={{ ...styles.row, marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="hideDatetimeCheck" 
                  checked={hideDatetime}
                  onChange={(e) => setHideDatetime(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="hideDatetimeCheck" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>
                  HIDE GENERATED DATETIME FROM PDF
                </label>
              </div>
            </div>

            {/* Action button centered */}
            <div style={styles.buttonContainer}>
              <button 
                type="submit" 
                className="btn" 
                style={styles.submitBtn}
              >
                Generate Delivery Slip
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REGISTRY LIST VIEW (Screenshot 3) */}
      {isListMode && (
        <div>
          <div style={styles.headerRow}>
            <h2 style={styles.title}>
              Delivery Slip List ({filteredSlips.length})
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn" 
                style={{ backgroundColor: '#008ecc', color: '#ffffff', border: 'none', fontWeight: '700', padding: '8px 16px', borderRadius: '4px', fontSize: '0.85rem' }}
                onClick={() => setIsReportModalOpen(true)}
              >
                Report
              </button>
              <button 
                className="btn" 
                style={{ backgroundColor: '#008ecc', color: '#ffffff', border: 'none', fontWeight: '700', padding: '8px 16px', borderRadius: '4px', fontSize: '0.85rem' }}
                onClick={() => setIsFilterModalOpen(true)}
              >
                Filter
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#0066cc', color: '#ffffff', border: 'none', fontWeight: '700', padding: '8px 16px', borderRadius: '4px', fontSize: '0.85rem' }}
                onClick={() => setActivePage('delivery-create')}
              >
                Create Delivery Slip
              </button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(appliedSender || appliedReceiver || appliedTransport || appliedTruck || appliedSlip || appliedFromDate || appliedToDate) && (
            <div style={styles.filterAlert}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0369a1' }}>Active Filters:</span>
                {appliedSender && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Sender: {appliedSender}
                  </span>
                )}
                {appliedReceiver && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Receiver: {appliedReceiver}
                  </span>
                )}
                {appliedTransport && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Transport: {appliedTransport}
                  </span>
                )}
                {appliedTruck && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Truck: {appliedTruck}
                  </span>
                )}
                {appliedSlip && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Slip No: {appliedSlip}
                  </span>
                )}
                {(appliedFromDate || appliedToDate) && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Date: {appliedFromDate || 'Any'} ➔ {appliedToDate || 'Any'}
                  </span>
                )}
                <button onClick={handleClearFilters} style={styles.clearLink}>
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {filteredSlips.length > 0 ? (
            <div style={{ marginTop: '16px' }}>
              {/* Search bar */}
              <div style={styles.filterBar}>
                <div style={{ position: 'relative', width: '320px' }}>
                  <input 
                    type="text" 
                    placeholder="Search by sender, receiver, truck or LR..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                    style={{ paddingRight: '32px' }}
                  />
                  <Search size={16} style={{ position: 'absolute', right: 10, top: 12, color: '#94a3b8' }} />
                </div>
              </div>

              {/* Table */}
              <div className="table-container" style={{ marginTop: '16px' }}>
                <table className="custom-table">
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th>Slip No</th>
                      <th>Generate Date</th>
                      <th>Sender Name</th>
                      <th>Receiver Name</th>
                      <th>Truck Number</th>
                      <th>Freight Amount</th>
                      <th>Total Charges</th>
                      <th>Outstanding Balance</th>
                      <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSlips.map((s) => (
                      <tr key={s._id}>
                        <td style={{ fontWeight: '700', color: '#0066cc' }}>{s.deliverySlipNo}</td>
                        <td style={{ fontWeight: '500' }}>
                          {s.generateDate.split('-').reverse().join('/')}
                        </td>
                        <td style={{ fontWeight: '600' }}>{s.senderName || '—'}</td>
                        <td style={{ fontWeight: '600' }}>{s.receiverName || '—'}</td>
                        <td style={{ fontWeight: '700', color: '#475569' }}>{s.truckNo || '—'}</td>
                        <td style={{ fontWeight: '700' }}>₹{(s.freightAmount || s.totalFreight || 0).toLocaleString()}</td>
                        <td style={{ fontWeight: '700', color: '#10b981' }}>₹{(s.totalAmount || s.totalFreight || 0).toLocaleString()}</td>
                        <td style={{ fontWeight: '700', color: '#ef4444' }}>₹{s.balanceAmount.toLocaleString()}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button 
                              className="btn-icon" 
                              onClick={() => setViewingSlip(s)} 
                              title="Print & View Delivery Memo"
                              style={{ color: '#0066cc', border: '1px solid #cbd5e1', padding: '6px', borderRadius: '4px', backgroundColor: '#f8fafc' }}
                            >
                              <Printer size={14} />
                            </button>
                            <button 
                              className="btn-icon btn-danger" 
                              onClick={() => handleDelete(s._id)} 
                              title="Delete"
                              style={{ padding: '6px', borderRadius: '4px' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Center Aligned Empty State Registry (Screenshot 3)
            <div style={styles.emptyContainer}>
              <h3 style={styles.emptyTitle}>No Data Found</h3>
              <div style={styles.emptyPaginator}>
                1
              </div>
            </div>
          )}
        </div>
      )}

      {/* FILTER OPTIONS DIALOG MODAL (Screenshot 5) */}
      {isFilterModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Filter Options</h3>
              <button onClick={() => setIsFilterModalOpen(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Row 1 Dropdowns */}
              <div style={styles.row}>
                <div style={styles.col}>
                  <label style={styles.label}>Sender Name</label>
                  <select 
                    value={filterSender}
                    onChange={(e) => setFilterSender(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Sender Name</option>
                    {uniqueSenders.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>Receiver Name</label>
                  <select 
                    value={filterReceiver}
                    onChange={(e) => setFilterReceiver(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Receiver Name</option>
                    {uniqueReceivers.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 Dropdowns */}
              <div style={{ ...styles.row, marginTop: '14px' }}>
                <div style={styles.col}>
                  <label style={styles.label}>Transport Name</label>
                  <select 
                    value={filterTransport}
                    onChange={(e) => setFilterTransport(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Transport Name</option>
                    {uniqueTransports.map((t, i) => (
                      <option key={i} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>Truck No.</label>
                  <select 
                    value={filterTruck}
                    onChange={(e) => setFilterTruck(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Truck No.</option>
                    {uniqueTrucks.map((tk, i) => (
                      <option key={i} value={tk}>{tk}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3 Dropdowns & Date Pickers */}
              <div style={{ ...styles.row, marginTop: '14px' }}>
                <div style={styles.col}>
                  <label style={styles.label}>Slip No.</label>
                  <select 
                    value={filterSlip}
                    onChange={(e) => setFilterSlip(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Slip No.</option>
                    {uniqueSlips.map((sl, i) => (
                      <option key={i} value={sl}>{sl}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4 Date Ranges */}
              <div style={{ ...styles.row, marginTop: '14px' }}>
                <div style={styles.col}>
                  <label style={styles.label}>From Date</label>
                  <input 
                    type="date" 
                    value={filterFromDate}
                    onChange={(e) => setFilterFromDate(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>To Date</label>
                  <input 
                    type="date" 
                    value={filterToDate}
                    onChange={(e) => setFilterToDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  onClick={handleSearchFilter}
                  style={styles.modalSearchBtn}
                >
                  Search
                </button>
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  style={styles.modalCloseBtn}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT OPTIONS DIALOG MODAL (Screenshot 4) */}
      {isReportModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Report Options</h3>
              <button onClick={() => setIsReportModalOpen(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Row 1 Dropdowns */}
              <div style={styles.row}>
                <div style={styles.col}>
                  <label style={styles.label}>Sender Name</label>
                  <select 
                    value={reportSender}
                    onChange={(e) => setReportSender(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Sender Name</option>
                    {uniqueSenders.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>Receiver Name</label>
                  <select 
                    value={reportReceiver}
                    onChange={(e) => setReportReceiver(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Receiver Name</option>
                    {uniqueReceivers.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 Dropdowns */}
              <div style={{ ...styles.row, marginTop: '14px' }}>
                <div style={styles.col}>
                  <label style={styles.label}>Transport Name</label>
                  <select 
                    value={reportTransport}
                    onChange={(e) => setReportTransport(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Transport Name</option>
                    {uniqueTransports.map((t, i) => (
                      <option key={i} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>Truck No.</label>
                  <select 
                    value={reportTruck}
                    onChange={(e) => setReportTruck(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Truck No.</option>
                    {uniqueTrucks.map((tk, i) => (
                      <option key={i} value={tk}>{tk}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3 Dropdowns */}
              <div style={{ ...styles.row, marginTop: '14px' }}>
                <div style={styles.col}>
                  <label style={styles.label}>Slip No.</label>
                  <select 
                    value={reportSlip}
                    onChange={(e) => setReportSlip(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Slip No.</option>
                    {uniqueSlips.map((sl, i) => (
                      <option key={i} value={sl}>{sl}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4 Date Ranges */}
              <div style={{ ...styles.row, marginTop: '14px' }}>
                <div style={styles.col}>
                  <label style={styles.label}>From Date</label>
                  <input 
                    type="date" 
                    value={reportFromDate}
                    onChange={(e) => setReportFromDate(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>To Date</label>
                  <input 
                    type="date" 
                    value={reportToDate}
                    onChange={(e) => setReportToDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  onClick={handleGenerateReport}
                  style={styles.modalSearchBtn}
                >
                  Download
                </button>
                <button 
                  onClick={() => setIsReportModalOpen(false)}
                  style={styles.modalCloseBtn}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY REGISTER STATEMENT PRINT MODAL */}
      {printingRegister && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '850px', padding: 0 }}>
            <div style={{ ...styles.modalHeader, padding: '16px 20px', borderBottom: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: 0 }}>🖨️ Delivery Register Print Preview</h3>
              <button onClick={() => setPrintingRegister(null)} style={styles.closeBtn}><X size={18}/></button>
            </div>
            
            {/* Printable Frame */}
            <div style={styles.printFrame} className="print-only-document">
              <div style={styles.printHeader}>
                <div>
                  <h1 style={{ color: '#0066cc', margin: 0, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif' }}>TRANSCORE LOGISTICS</h1>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    GSTIN: 09AAACT9211C1ZA • Official Consignment Delivery Register
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ color: '#64748b', margin: 0 }}>DELIVERY SLIP REGISTER</h3>
                  <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}><b>Date of Compilation:</b> {new Date().toLocaleDateString('en-GB')}</p>
                  <p style={{ fontSize: '0.8rem', margin: '2px 0 0 0' }}><b>Records Found:</b> {printingRegister.length}</p>
                </div>
              </div>

              <div style={styles.printBody}>
                {printingRegister.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Slip No.</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Date</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Sender (Consignor)</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Receiver (Consignee)</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Truck Number</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Freight</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total Charges</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Balance Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printingRegister.map((s, idx) => (
                        <tr key={s._id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: '700' }}>{s.deliverySlipNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{s.generateDate.split('-').reverse().join('/')}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: '500' }}>{s.senderName || '—'}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: '500' }}>{s.receiverName || '—'}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: '700' }}>{s.truckNo || '—'}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>₹{(s.freightAmount || s.totalFreight || 0).toLocaleString()}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: '700', color: '#10b981' }}>₹{(s.totalAmount || s.totalFreight || 0).toLocaleString()}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: '700', color: '#ef4444' }}>₹{s.balanceAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                      {/* Summary Aggregates Row */}
                      <tr style={{ background: '#f8fafc', fontWeight: '800', borderTop: '2px solid #cbd5e1' }}>
                        <td colSpan="5" style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>TOTAL AGGREGATES:</td>
                        <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>
                          ₹{printingRegister.reduce((acc, curr) => acc + (curr.freightAmount || curr.totalFreight || 0), 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#10b981' }}>
                          ₹{printingRegister.reduce((acc, curr) => acc + (curr.totalAmount || curr.totalFreight || 0), 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#ef4444' }}>
                          ₹{printingRegister.reduce((acc, curr) => acc + curr.balanceAmount, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No matching records found for this custom criteria.</p>
                )}
              </div>
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8fafc' }}>
              <button 
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ backgroundColor: '#0066cc', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
              >
                <Printer size={16} /> Print Register
              </button>
              <button 
                onClick={() => setPrintingRegister(null)}
                className="btn btn-secondary"
                style={{ fontWeight: '600' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY CONFIRMATION INDIVIDUAL MEMO PRINT PREVIEW SHEET */}
      {viewingSlip && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '800px', padding: 0 }}>
            <div style={{ ...styles.modalHeader, padding: '16px 20px', borderBottom: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: 0 }}>🖨️ Delivery Slip Print Preview</h3>
              <button onClick={() => setViewingSlip(null)} style={styles.closeBtn}><X size={18}/></button>
            </div>
            
            {/* Printable Frame */}
            <div style={styles.printFrame} className="print-only-document">
              <div style={styles.printHeader}>
                <div>
                  <h1 style={{ color: '#0066cc', margin: 0, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif' }}>TRANSCORE LOGISTICS</h1>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                    GSTIN: 09AAACT9211C1ZA • Branch: {viewingSlip.branchCode || 'BR-HQ'} • FY: {viewingSlip.financialYear}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ color: '#64748b', margin: 0 }}>DELIVERY CONFIRMATION SLIP</h3>
                  <p style={{ fontSize: '0.85rem', margin: '4px 0 0 0' }}><b>Slip #:</b> {viewingSlip.deliverySlipNo}</p>
                  <p style={{ fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                    <b>Date:</b> {viewingSlip.generateDate.split('-').reverse().join('/')}
                    {!viewingSlip.hideDatetime && ` ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                  </p>
                </div>
              </div>

              <div style={styles.printBody}>
                {/* Party Row Grid */}
                <div style={styles.printGrid}>
                  <div style={styles.printCol}>
                    <h4 style={styles.printSecTitle}>Sender (Consignor)</h4>
                    <p style={styles.printP}><b>Name:</b> {viewingSlip.senderName || '—'}</p>
                    <p style={styles.printP}><b>GSTIN:</b> {viewingSlip.senderGst || '—'}</p>
                    <p style={styles.printP}><b>Mobile:</b> {viewingSlip.senderMobile || '—'}</p>
                  </div>
                  <div style={styles.printCol}>
                    <h4 style={styles.printSecTitle}>Receiver (Consignee)</h4>
                    <p style={styles.printP}><b>Name:</b> {viewingSlip.receiverName || '—'}</p>
                    <p style={styles.printP}><b>GSTIN:</b> {viewingSlip.receiverGst || '—'}</p>
                    <p style={styles.printP}><b>Mobile:</b> {viewingSlip.receiverMobile || '—'}</p>
                  </div>
                </div>

                {/* Logistics & Carrier Row Grid */}
                <div style={{ ...styles.printGrid, marginTop: '20px' }}>
                  <div style={styles.printCol}>
                    <h4 style={styles.printSecTitle}>Logistics & Route</h4>
                    <p style={styles.printP}><b>Carrier:</b> {viewingSlip.transportName || '—'}</p>
                    <p style={styles.printP}><b>Carrier Phone:</b> {viewingSlip.transportMobile || '—'}</p>
                    <p style={styles.printP}><b>From Location:</b> {viewingSlip.fromLocation || '—'}</p>
                    <p style={styles.printP}><b>To Location:</b> {viewingSlip.toLocation || '—'}</p>
                  </div>
                  <div style={styles.printCol}>
                    <h4 style={styles.printSecTitle}>Consignment & Vehicle</h4>
                    <p style={styles.printP}><b>Material Name:</b> {viewingSlip.materialName || '—'}</p>
                    <p style={styles.printP}><b>Bilty/LR #:</b> {viewingSlip.biltyNo || '—'}</p>
                    <p style={styles.printP}><b>Articles:</b> {viewingSlip.numArticles || '—'}</p>
                    <p style={styles.printP}><b>Truck Number:</b> {viewingSlip.truckNo || '—'}</p>
                  </div>
                </div>

                {/* Driver Row Grid */}
                <div style={{ ...styles.printGrid, marginTop: '20px' }}>
                  <div style={styles.printCol}>
                    <h4 style={styles.printSecTitle}>Driver Information</h4>
                    <p style={styles.printP}><b>Driver Name:</b> {viewingSlip.driverName || '—'}</p>
                    <p style={styles.printP}><b>Driver Phone:</b> {viewingSlip.driverMobile || '—'}</p>
                    <p style={styles.printP}><b>License Number:</b> {viewingSlip.driverLicense || '—'}</p>
                  </div>
                  <div style={styles.printCol}>
                    <h4 style={styles.printSecTitle}>Freight & Settlement</h4>
                    <p style={styles.printP}><b>Freight Charges:</b> ₹{(viewingSlip.freightAmount || viewingSlip.totalFreight || 0).toLocaleString()}</p>
                    <p style={styles.printP}><b>Total Aggregated Charges:</b> ₹{(viewingSlip.totalAmount || viewingSlip.totalFreight || 0).toLocaleString()}</p>
                    <p style={styles.printP}><b>Advance Paid:</b> ₹{viewingSlip.advanceAmount.toLocaleString()}</p>
                    <p style={styles.printP}><b>Outstanding Balance:</b> ₹{viewingSlip.balanceAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Delivery Courier details */}
                <div style={{ ...styles.printGrid, marginTop: '20px' }}>
                  <div style={{ ...styles.printCol, flex: '1 1 100%' }}>
                    <h4 style={styles.printSecTitle}>Delivery Recipient Info & Narration Notes</h4>
                    <p style={styles.printP}><b>Received & Handled By:</b> {viewingSlip.deliveryByName || '—'} {viewingSlip.deliveryByMobile ? `(Mobile: ${viewingSlip.deliveryByMobile})` : ''}</p>
                    <p style={styles.printP}><b>Transporter Remarks:</b> {viewingSlip.remark || 'No delivery remarks recorded.'}</p>
                  </div>
                </div>

                {/* Delivery Confirmation Signature Stamps */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', borderTop: '1px dashed #cbd5e1', paddingTop: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '160px', borderBottom: '1px solid #cbd5e1', height: '40px', marginBottom: '6px' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Receiver's Signature</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '160px', borderBottom: '1px solid #cbd5e1', height: '40px', marginBottom: '6px' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Driver's Signature</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '160px', borderBottom: '1px solid #cbd5e1', height: '40px', marginBottom: '6px' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Authorized Dispatcher</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8fafc' }}>
              <button 
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ backgroundColor: '#0066cc', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
              >
                <Printer size={16} /> Print Confirmation
              </button>
              <button 
                onClick={() => setViewingSlip(null)}
                className="btn btn-secondary"
                style={{ fontWeight: '600' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '0 4px'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px'
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  col: {
    flex: '1 1 200px'
  },
  col4: {
    flex: '1 1 220px'
  },
  col3: {
    flex: '1 1 280px'
  },
  col12: {
    flex: '1 1 100%'
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '6px'
  },
  sectionHeader: {
    borderBottom: '1px solid #e2e8f0',
    margin: '24px 0 16px 0',
    paddingBottom: '6px'
  },
  sectionTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    padding: '4px 12px',
    borderRadius: '4px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px'
  },
  submitBtn: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.95rem',
    padding: '12px 36px',
    borderRadius: '4px',
    border: 'none',
    boxShadow: '0 2px 4px rgba(0, 176, 80, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  filterAlert: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  clearLink: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ef4444',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    marginLeft: '10px'
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 0',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    marginTop: '16px'
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '24px'
  },
  emptyPaginator: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '0.9rem',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
    width: '100%',
    maxWidth: '650px',
    overflow: 'hidden'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  modalTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '24px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px'
  },
  modalSearchBtn: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.85rem',
    padding: '8px 24px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 176, 80, 0.15)'
  },
  modalCloseBtn: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.85rem',
    padding: '8px 20px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    cursor: 'pointer'
  },
  printFrame: {
    padding: '40px',
    backgroundColor: '#ffffff',
    minHeight: '600px',
    position: 'relative'
  },
  printHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '2px solid #0066cc',
    paddingBottom: '16px',
    marginBottom: '20px'
  },
  printBody: {
    marginTop: '20px'
  },
  printGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  printCol: {
    flex: '1 1 300px',
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1'
  },
  printSecTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#0066cc',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '6px',
    margin: '0 0 10px 0'
  },
  printP: {
    margin: '4px 0',
    fontSize: '0.85rem',
    color: '#334155'
  }
};
