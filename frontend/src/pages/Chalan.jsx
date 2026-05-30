import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Printer, Home, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

export default function Chalan({ 
  chalans, vehicles, drivers, bilties, slips, headingColor, logoImg, stampImg, initialOpen,
  onCreateChalan, onUpdateChalan, onDeleteChalan, setActivePage 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormPage, setShowFormPage] = useState(initialOpen || false);
  const [editingChalan, setEditingChalan] = useState(null);
  const [printingChalan, setPrintingChalan] = useState(null);

  // High-Fidelity Creation Desk States
  const [activeTab, setActiveTab] = useState('Bilty'); // Bilty | LoadingSlip | Manual
  const [biltySupplier, setBiltySupplier] = useState('Select Bilty Supplier Name');
  const [loadingSupplier, setLoadingSupplier] = useState('Select Loading Slip Supplier Name');
  
  // Selections
  const [selectedBiltyNos, setSelectedBiltyNos] = useState([]);
  const [selectedSlipNos, setSelectedSlipNos] = useState([]);

  // Form Mode & States
  const [formMode, setFormMode] = useState('MANUAL'); // MANUAL | BILTY | LOADING SLIP
  const [editBankDetails, setEditBankDetails] = useState(false);

  // Filter States for main table search
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterSupplier, setFilterSupplier] = useState('Select Supplier Name');
  const [filterVehicle, setFilterVehicle] = useState('Select Vehicle Number');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Report Options Modal States
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [repSupplier, setRepSupplier] = useState('Select Supplier Name');
  const [repVehicle, setRepVehicle] = useState('Select Truck No.');
  const [repChalan, setRepChalan] = useState('Select Chalan No.');
  const [repFromLoc, setRepFromLoc] = useState('Select From Location');
  const [repToLoc, setRepToLoc] = useState('Select To Location');
  const [repFromDate, setRepFromDate] = useState('2026-05-01');
  const [repToDate, setRepToDate] = useState('2026-05-13');
  const [printingReport, setPrintingReport] = useState(null);

  // 9 Seeded Suppliers matching Master
  const seededSuppliers = [
    { name: 'SANDEEP KUMAR', phone: '9129918353', pan: 'KKRPK2121M', address: 'Kanpur Nagar, Uttar Pradesh' },
    { name: 'SHYAM JI MISHRA', phone: '8174076214', pan: 'AYFPS2020K', address: 'Jamshedpur Industrial Area, Jharkhand' },
    { name: 'DELHI GUJRAT FLEET CARRIER PVT LTD', phone: '6360843409', pan: 'DGFCP1070A', address: 'Sanjay Gandhi Transport Nagar, Delhi' },
    { name: 'LKO KANPUR GOODS CARRIERS', phone: '8924830532', pan: 'LKGCP3327B', address: 'Transport Nagar, Lucknow' },
    { name: 'LUCKNOW KANPUR ROADLINES', phone: '8423295286', pan: 'LKRLP9211C', address: 'Kanpur Bypass Road, Uttar Pradesh' },
    { name: 'RIZWAN SIDDIQUI', phone: '8957113583', pan: 'AYFPS2685A', address: 'G.T. Road, Kanpur' },
    { name: 'RAJU', phone: '7318172261', pan: 'CFNPR8308L', address: 'Unnao Industrial Estate, Uttar Pradesh' },
    { name: 'DIPAKKUMAR PRAJAPATI', phone: '8303932821', pan: 'BQJPP8558E', address: 'Mehsana Road, Gujarat' },
    { name: 'RAKESH PANDEY', phone: '8382877989', pan: 'RPPAN4876H', address: 'Varanasi Bypass, Uttar Pradesh' }
  ];

  // Diesel Pumps preset
  const dieselPumps = [
    { name: 'HP Pump Vadodara', location: 'Vadodara, Gujarat' },
    { name: 'Reliance Depot Jamnagar', location: 'Jamnagar, Gujarat' },
    { name: 'Bharat Petroleum Kanpur', location: 'Kanpur, UP' },
    { name: 'Indian Oil Delhi', location: 'SGTN, Delhi' }
  ];

  // Chalan Form Fields state
  const [chalanNo, setChalanNo] = useState('1');
  const [chalanDate, setChalanDate] = useState(new Date().toISOString().split('T')[0]);
  const [branchCode, setBranchCode] = useState('');
  const [financialYear, setFinancialYear] = useState('2026-2027');

  // Supplier details
  const [supplierName, setSupplierName] = useState('');
  const [supplierMobile, setSupplierMobile] = useState('');
  const [supplierPan, setSupplierPan] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');

  // Consignor, Consignee & Broker Details
  const [consignorName, setConsignorName] = useState('');
  const [consigneeName, setConsigneeName] = useState('');
  const [brokerName, setBrokerName] = useState('');

  // Truck Details
  const [vPart1, setVPart1] = useState('');
  const [vPart2, setVPart2] = useState('');
  const [vPart3, setVPart3] = useState('');
  const [vPart4, setVPart4] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverDl, setDriverDl] = useState('');
  const [driverMobile, setDriverMobile] = useState('');
  const [biltyNo, setBiltyNo] = useState('');
  const [biltyDate, setBiltyDate] = useState('');

  // Material & Freight Details
  const [materialName, setMaterialName] = useState('');
  const [freightType, setFreightType] = useState('Select Freight Type');
  const [weight, setWeight] = useState(0);
  const [unit, setUnit] = useState('MT (Metric Ton)');
  const [rate, setRate] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [freightAmount, setFreightAmount] = useState(0);
  const [haltingCharges, setHaltingCharges] = useState(0);

  // Plus / Minus Charges
  const [belowChargesType, setBelowChargesType] = useState('Plus (+) to Freight');
  const [hamaliCharges, setHamaliCharges] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [otherCharge, setOtherCharge] = useState(0);

  // Totals & Shortage
  const [totalFreight, setTotalFreight] = useState(0);
  const [shortageQty, setShortageQty] = useState(0);
  const [shortageUnit, setShortageUnit] = useState('MT (Metric Ton)');
  const [shortageAmt, setShortageAmt] = useState(0);

  // Advances Rows
  const [advAmt1, setAdvAmt1] = useState(0);
  const [advMode1, setAdvMode1] = useState('Select Advance Payment Mode');
  const [advDate1, setAdvDate1] = useState('');

  const [advAmt2, setAdvAmt2] = useState(0);
  const [advMode2, setAdvMode2] = useState('Select Advance Payment Mode');
  const [advDate2, setAdvDate2] = useState('');

  const [advAmt3, setAdvAmt3] = useState(0);
  const [advMode3, setAdvMode3] = useState('Select Advance Payment Mode');
  const [advDate3, setAdvDate3] = useState('');

  const [advAmt4, setAdvAmt4] = useState(0);
  const [advMode4, setAdvMode4] = useState('Select Advance Payment Mode');
  const [advDate4, setAdvDate4] = useState('');

  // Diesel Advance
  const [dieselAdvance, setDieselAdvance] = useState(0);
  const [selectedPump, setSelectedPump] = useState('Select Pump');
  const [pumpPaymentMode, setPumpPaymentMode] = useState('Select Payment Mode');

  // Commissions
  const [totalAdvance, setTotalAdvance] = useState(0);
  const [commissionType, setCommissionType] = useState('Fixed'); // Fixed | Percentage
  const [commissionAmount, setCommissionAmount] = useState(0);
  const [commissionPlusMinus, setCommissionPlusMinus] = useState('None'); // None | Plus | Minus

  // Balances
  const [tdsAmount, setTdsAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [commissionStatus, setCommissionStatus] = useState('Commission Payment Status');
  const [balancePayableAt, setBalancePayableAt] = useState('');

  // Remarks & Canvas Signature
  const [remarks, setRemarks] = useState('');
  const [hideDatetime, setHideDatetime] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState('');

  // Sync initialOpen props
  useEffect(() => {
    if (initialOpen) {
      setEditingChalan(null);
      handleOpenCreate();
    } else {
      setShowFormPage(false);
      setEditingChalan(null);
    }
  }, [initialOpen]);

  // Recalculate Freight Amounts and Balances
  useEffect(() => {
    // 1. Freight Amount base
    const w = Number(weight) || 0;
    const r = Number(rate) || 0;
    const baseFreight = isFixed ? r : (w * r);
    setFreightAmount(baseFreight);

    // 2. Below Charges Addition/Subtraction
    const halt = Number(haltingCharges) || 0;
    const hamali = Number(hamaliCharges) || 0;
    const service = Number(serviceCharge) || 0;
    const other = Number(otherCharge) || 0;

    let subTotalFreight = baseFreight + halt;
    if (belowChargesType === 'Plus (+) to Freight') {
      subTotalFreight += (hamali + service + other);
    } else {
      subTotalFreight -= (hamali + service + other);
    }
    setTotalFreight(subTotalFreight);

    // 3. Advances Sum
    const a1 = Number(advAmt1) || 0;
    const a2 = Number(advAmt2) || 0;
    const a3 = Number(advAmt3) || 0;
    const a4 = Number(advAmt4) || 0;
    const diesel = Number(dieselAdvance) || 0;
    const sumAdvances = a1 + a2 + a3 + a4 + diesel;
    setTotalAdvance(sumAdvances);

    // 4. Commission Impact
    const comm = Number(commissionAmount) || 0;
    const tds = Number(tdsAmount) || 0;
    const shortage = Number(shortageAmt) || 0;

    let netBalance = subTotalFreight - sumAdvances - tds - shortage;
    if (commissionPlusMinus === 'Plus') {
      netBalance += comm;
    } else if (commissionPlusMinus === 'Minus') {
      netBalance -= comm;
    }
    setBalanceAmount(netBalance);
  }, [
    weight, rate, isFixed, haltingCharges, belowChargesType, hamaliCharges, serviceCharge, otherCharge,
    advAmt1, advAmt2, advAmt3, advAmt4, dieselAdvance, commissionAmount, commissionPlusMinus, tdsAmount, shortageAmt
  ]);

  // Trigger when form opens
  useEffect(() => {
    if (showFormPage && !editingChalan) {
      setChalanNo((chalans?.length + 1).toString());
      setChalanDate(new Date().toISOString().split('T')[0]);
      setBranchCode('');
      setFinancialYear('2026-2027');
      setBiltySupplier('Select Bilty Supplier Name');
      setLoadingSupplier('Select Loading Slip Supplier Name');
      setSelectedBiltyNos([]);
      setSelectedSlipNos([]);
      setSignatureData('');
      setRemarks('');
    }
  }, [showFormPage, editingChalan, chalans]);

  // Canvas signature handler
  useEffect(() => {
    if (showFormPage && activeTab === 'Manual' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
    }
  }, [showFormPage, activeTab]);

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
  };

  // Helper selectors
  const getBiltyCountForSupplier = (sName) => {
    return bilties.filter(b => b.supplierAddress?.toLowerCase().includes(sName.toLowerCase()) || b.driverName?.toLowerCase() === sName.toLowerCase()).length;
  };

  const getSlipCountForSupplier = (sName) => {
    return slips.filter(s => s.supplierName?.toLowerCase() === sName.toLowerCase()).length;
  };

  const toggleBiltyNo = (lrNo) => {
    if (selectedBiltyNos.includes(lrNo)) {
      setSelectedBiltyNos(selectedBiltyNos.filter(x => x !== lrNo));
    } else {
      setSelectedBiltyNos([...selectedBiltyNos, lrNo]);
    }
  };

  const toggleSlipNo = (slipNo) => {
    if (selectedSlipNos.includes(slipNo)) {
      setSelectedSlipNos(selectedSlipNos.filter(x => x !== slipNo));
    } else {
      setSelectedSlipNos([...selectedSlipNos, slipNo]);
    }
  };

  const handleOpenCreate = () => {
    setEditingChalan(null);
    setActiveTab('Bilty');
    setFormMode('MANUAL');
    setShowFormPage(true);
  };

  const handleProceedWithSelections = () => {
    if (activeTab === 'Bilty') {
      const selected = bilties.filter(b => selectedBiltyNos.includes(b.biltyNo));
      if (selected.length === 0) return;
      
      // Auto-populate supplier metadata from selected bilties
      setSupplierName(biltySupplier);
      const supplierObj = seededSuppliers.find(s => s.name === biltySupplier) || {};
      setSupplierMobile(supplierObj.phone || '');
      setSupplierPan(supplierObj.pan || '');
      setSupplierAddress(supplierObj.address || '');

      setConsignorName(selected[0].consignorName || '');
      setConsigneeName(selected[0].consigneeName || '');
      
      const vNum = selected[0].vehicleNumber || '';
      const parts = vNum.split('-');
      setVPart1(parts[0] || '');
      setVPart2(parts[1] || '');
      setVPart3(parts[2] || '');
      setVPart4(parts[3] || '');

      setFromCity(selected[0].fromCity || '');
      setToCity(selected[0].toCity || '');
      setDriverName(selected[0].driverName || '');
      setDriverDl(selected[0].driverDl || '');
      setDriverMobile(selected[0].driverMobile || '');
      setBiltyNo(selected[0].biltyNo || '');
      setBiltyDate(selected[0].date || '');

      setMaterialName(selected[0].materialName || '');
      setWeight(Number(selected[0].actualWeight) || 0);
      setRate(Number(selected[0].rate) || 0);
      setIsFixed(selected[0].fixedRate || false);
      setHaltingCharges(Number(selected[0].haltingCharge) || 0);

      setFormMode('BILTY');
    } else if (activeTab === 'LoadingSlip') {
      const selected = slips.filter(s => selectedSlipNos.includes(s.slipNo));
      if (selected.length === 0) return;

      setSupplierName(loadingSupplier);
      const supplierObj = seededSuppliers.find(s => s.name === loadingSupplier) || {};
      setSupplierMobile(supplierObj.phone || '');
      setSupplierPan(supplierObj.pan || '');
      setSupplierAddress(supplierObj.address || '');

      setConsignorName(selected[0].consignorName || '');
      setConsigneeName(selected[0].consigneeName || '');

      const vNum = selected[0].vehicleNumber || '';
      const parts = vNum.split('-');
      setVPart1(parts[0] || '');
      setVPart2(parts[1] || '');
      setVPart3(parts[2] || '');
      setVPart4(parts[3] || '');

      setFromCity(selected[0].fromCity || '');
      setToCity(selected[0].toCity || '');
      setDriverName(selected[0].driverName || '');
      setDriverDl(selected[0].driverDl || '');
      setDriverMobile(selected[0].driverMobile || '');
      setBiltyNo(selected[0].slipNo || '');
      setBiltyDate(selected[0].date || '');

      setMaterialName(selected[0].goodsDescription || '');
      setWeight(Number(selected[0].actualWeight) || 0);
      setRate(Number(selected[0].rate) || 0);
      setIsFixed(selected[0].fixedRate || false);
      setHaltingCharges(Number(selected[0].haltingCharge) || 0);

      setFormMode('LOADING SLIP');
    }
    setActiveTab('Manual');
  };

  const handleOpenEdit = (c) => {
    setEditingChalan(c);
    setChalanNo(c.chalanNo);
    setChalanDate(c.date);
    setBranchCode(c.branchCode || '');
    setFinancialYear(c.financialYear || '2026-2027');

    setSupplierName(c.supplierName || '');
    setSupplierMobile(c.supplierMobile || '');
    setSupplierPan(c.supplierPan || '');
    setSupplierAddress(c.supplierAddress || '');

    setConsignorName(c.consignorName || '');
    setConsigneeName(c.consigneeName || '');
    setBrokerName(c.brokerName || '');

    const parts = (c.vehicleNumber || '').split('-');
    setVPart1(parts[0] || '');
    setVPart2(parts[1] || '');
    setVPart3(parts[2] || '');
    setVPart4(parts[3] || '');

    setFromCity(c.fromCity || '');
    setToCity(c.toCity || '');
    setDriverName(c.driverName || '');
    setDriverDl(c.driverDl || '');
    setDriverMobile(c.driverMobile || '');
    setBiltyNo(c.biltyNo || '');
    setBiltyDate(c.biltyDate || '');

    setMaterialName(c.materialName || '');
    setFreightType(c.freightType || 'Select Freight Type');
    setWeight(c.weight || 0);
    setUnit(c.unit || 'MT (Metric Ton)');
    setRate(c.rate || 0);
    setIsFixed(c.isFixed || false);
    setHaltingCharges(c.haltingCharges || 0);

    setBelowChargesType(c.belowChargesType || 'Plus (+) to Freight');
    setHamaliCharges(c.hamaliCharges || 0);
    setServiceCharge(c.serviceCharge || 0);
    setOtherCharge(c.otherCharge || 0);

    setShortageQty(c.shortageQty || 0);
    setShortageUnit(c.shortageUnit || 'MT (Metric Ton)');
    setShortageAmt(c.shortageAmt || 0);

    setAdvAmt1(c.advAmt1 || 0);
    setAdvMode1(c.advMode1 || 'Select Advance Payment Mode');
    setAdvDate1(c.advDate1 || '');

    setAdvAmt2(c.advAmt2 || 0);
    setAdvMode2(c.advMode2 || 'Select Advance Payment Mode');
    setAdvDate2(c.advDate2 || '');

    setAdvAmt3(c.advAmt3 || 0);
    setAdvMode3(c.advMode3 || 'Select Advance Payment Mode');
    setAdvDate3(c.advDate3 || '');

    setAdvAmt4(c.advAmt4 || 0);
    setAdvMode4(c.advMode4 || 'Select Advance Payment Mode');
    setAdvDate4(c.advDate4 || '');

    setDieselAdvance(c.dieselAdvance || 0);
    setSelectedPump(c.selectedPump || 'Select Pump');
    setPumpPaymentMode(c.pumpPaymentMode || 'Select Payment Mode');

    setCommissionType(c.commissionType || 'Fixed');
    setCommissionAmount(c.commissionAmount || 0);
    setCommissionPlusMinus(c.commissionPlusMinus || 'None');

    setTdsAmount(c.tdsAmount || 0);
    setCommissionStatus(c.commissionStatus || 'Commission Payment Status');
    setBalancePayableAt(c.balancePayableAt || '');

    setRemarks(c.remarks || '');
    setHideDatetime(c.hideDatetime || false);
    setSignatureData(c.signatureData || '');

    setFormMode('MANUAL');
    setActiveTab('Manual');
    setShowFormPage(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!supplierName) {
      alert('Supplier name is required.');
      return;
    }

    const compiledVNum = vPart1 ? `${vPart1.toUpperCase()}-${vPart2.toUpperCase()}-${vPart3.toUpperCase()}-${vPart4.toUpperCase()}` : '';

    const payload = {
      chalanNo,
      date: chalanDate,
      branchCode,
      financialYear,
      supplierName,
      supplierMobile,
      supplierPan,
      supplierAddress,
      consignorName,
      consigneeName,
      brokerName,
      vehicleNumber: compiledVNum,
      fromCity,
      toCity,
      driverName,
      driverDl,
      driverMobile,
      biltyNo,
      biltyDate,
      materialName,
      freightType,
      weight,
      unit,
      rate,
      isFixed,
      lorryFreight: totalFreight, // map total freight calculated
      haltingCharges,
      belowChargesType,
      hamaliCharges,
      serviceCharge,
      otherCharge,
      shortageQty,
      shortageUnit,
      shortageAmt,
      advAmt1, advMode1, advDate1,
      advAmt2, advMode2, advDate2,
      advAmt3, advMode3, advDate3,
      advAmt4, advMode4, advDate4,
      dieselAdvance, selectedPump, pumpPaymentMode,
      advancePaid: totalAdvance, // map total advance sum
      commissionType, commissionAmount, commissionPlusMinus,
      tdsAmount,
      balanceToDriver: balanceAmount, // map net balance calculated
      commissionStatus,
      balancePayableAt,
      remarks,
      hideDatetime,
      signatureData,
      paymentStatus: balanceAmount <= 0 ? 'Paid' : 'Pending'
    };

    if (editingChalan) {
      onUpdateChalan(editingChalan._id, payload);
    } else {
      onCreateChalan(payload);
    }
    setShowFormPage(false);
  };

  const filteredChalans = chalans.filter(c => {
    const matchesSearch = 
      c.chalanNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.driverName.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterSupplier !== 'Select Supplier Name' && c.supplierName !== filterSupplier) return false;
    if (filterVehicle !== 'Select Vehicle Number' && c.vehicleNumber !== filterVehicle) return false;
    if (filterFromDate && c.date < filterFromDate) return false;
    if (filterToDate && c.date > filterToDate) return false;

    return matchesSearch;
  });

  return (
    <div style={styles.container}>
      
      {/* 1. Chalans card directory grid */}
      {!showFormPage && (
        <>
          <div style={styles.header} className="print-hidden">
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('dashboard')} />
              <span style={{ cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('dashboard')}>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingChalan(null); if (setActivePage) setActivePage('chalan'); }}>Chalan</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>Chalan List</span>
            </div>
          </div>

          <div style={styles.mainCard} className="print-hidden">
            <div style={styles.cardHeaderRow}>
              <h2 style={styles.cardTitle}>Chalan List ({filteredChalans.length})</h2>
              
              <div style={styles.actionsBar}>
                <div style={styles.searchGroup}>
                  <Search size={14} style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search Chalans..."
                    style={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button style={styles.filterBtn} onClick={() => setActivePage('supplier-advance')}>+ Supplier Advance</button>
                <button style={styles.filterBtn} onClick={() => setReportModalOpen(true)}>Report</button>
                <button style={styles.filterBtn} onClick={() => setFilterModalOpen(true)}>Filter</button>
                <button style={styles.createBtn} onClick={handleOpenCreate}>Create New Chalan</button>
              </div>
            </div>

            {filteredChalans.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '20px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>No Data Found</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ backgroundColor: '#0066cc', color: '#ffffff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontWeight: '700', fontSize: '0.85rem' }}>1</span>
                </div>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Chalan No</th>
                      <th>Date</th>
                      <th>Supplier Name</th>
                      <th>Vehicle Number</th>
                      <th>Total Lorry Freight</th>
                      <th>Advances Paid</th>
                      <th>Balance Due</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChalans.map((c, idx) => (
                      <tr key={c._id}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: '700', color: '#0066cc' }}>CH-{c.chalanNo}</td>
                        <td>{c.date}</td>
                        <td style={{ fontWeight: '700' }}>{c.supplierName}</td>
                        <td style={{ color: '#f97316', fontWeight: '700' }}>{c.vehicleNumber}</td>
                        <td>₹{c.lorryFreight || 0}/-</td>
                        <td style={{ color: '#16a34a', fontWeight: '600' }}>₹{c.advancePaid || 0}/-</td>
                        <td style={{ color: '#ef4444', fontWeight: '800' }}>₹{c.balanceToDriver || 0}/-</td>
                        <td>
                          <span className={`status-badge ${c.paymentStatus === 'Paid' ? 'delivered' : 'pending'}`}>
                            {c.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button style={styles.actionBtn} onClick={() => handleOpenEdit(c)} title="Edit"><Edit2 size={12} /></button>
                            <button style={styles.actionPrintBtn} onClick={() => setPrintingChalan(c)} title="Print Memo"><Printer size={12} /></button>
                            <button style={styles.actionDeleteBtn} onClick={() => onDeleteChalan(c._id)} title="Delete"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. Three-Tab Selector Page (Screenshot 1 & 3) */}
      {showFormPage && activeTab !== 'Manual' && (
        <div style={styles.container} className="print-hidden">
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingChalan(null); if (setActivePage) setActivePage('dashboard'); }} />
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingChalan(null); if (setActivePage) setActivePage('dashboard'); }}>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingChalan(null); }}>Chalan</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>Create New Chalan</span>
            </div>
            <button style={styles.backToListBtn} onClick={() => setShowFormPage(false)}>Chalan List</button>
          </div>

          <div style={styles.formCard}>
            <h2 style={styles.modalTitle}>Create Chalan</h2>

            <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '600', marginBottom: '24px' }}>
              Create Chalan Using :<br/>
              <span style={{ fontSize: '0.75rem', fontWeight: '500', display: 'block', marginTop: '4px' }}>
                ( NOTE: If you want to create Chalan using Bilty or Loading Slip, first select Supplier name and then select it's Bilty or Loading Slip and then proceed. )
              </span>
            </div>

            {/* Custom Tab Toggles */}
            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', paddingBottom: '2px' }}>
              <button 
                type="button" 
                style={{ ...styles.tabBtn, borderBottom: activeTab === 'Bilty' ? '3px solid #0066cc' : 'none', color: activeTab === 'Bilty' ? '#0066cc' : '#64748b' }}
                onClick={() => {
                  setActiveTab('Bilty');
                  setSelectedBiltyNos([]);
                }}
              >
                Bilty
              </button>
              <button 
                type="button" 
                style={{ ...styles.tabBtn, borderBottom: activeTab === 'LoadingSlip' ? '3px solid #0066cc' : 'none', color: activeTab === 'LoadingSlip' ? '#0066cc' : '#64748b' }}
                onClick={() => {
                  setActiveTab('LoadingSlip');
                  setSelectedSlipNos([]);
                }}
              >
                Loading Slip
              </button>
              <button 
                type="button" 
                style={{ ...styles.tabBtn, borderBottom: activeTab === 'Manual' ? '3px solid #0066cc' : 'none', color: activeTab === 'Manual' ? '#0066cc' : '#64748b' }}
                onClick={() => {
                  setFormMode('MANUAL');
                  setActiveTab('Manual');
                  // Seed Manual supplier defaults
                  setSupplierName('');
                  setSupplierMobile('');
                  setSupplierPan('');
                  setSupplierAddress('');
                }}
              >
                Manual
              </button>
            </div>

            {/* A: Bilty tab selector block */}
            {activeTab === 'Bilty' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Supplier Name *</label>
                  <select 
                    className="form-control" 
                    style={{ height: '40px' }}
                    value={biltySupplier}
                    onChange={(e) => {
                      setBiltySupplier(e.target.value);
                      setSelectedBiltyNos([]);
                    }}
                  >
                    <option>Select Bilty Supplier Name</option>
                    {seededSuppliers.map(s => (
                      <option key={s.name} value={s.name}>{s.name} (Bilties: {getBiltyCountForSupplier(s.name)})</option>
                    ))}
                  </select>
                </div>

                {biltySupplier !== 'Select Bilty Supplier Name' && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                    <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ width: '50px' }}>Select</th>
                          <th>Bilty No.</th>
                          <th>Date</th>
                          <th>Route</th>
                          <th>Vehicle Number</th>
                          <th>Weight</th>
                          <th>Freight Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bilties.filter(b => b.supplierAddress?.toLowerCase().includes(biltySupplier.toLowerCase()) || b.driverName?.toLowerCase() === biltySupplier.toLowerCase()).map(b => {
                          const isSel = selectedBiltyNos.includes(b.biltyNo);
                          return (
                            <tr key={b._id} onClick={() => toggleBiltyNo(b.biltyNo)} style={{ cursor: 'pointer', background: isSel ? '#eff6ff' : 'none' }}>
                              <td>
                                <input type="checkbox" checked={isSel} onChange={() => {}} style={{ pointerEvents: 'none' }} />
                              </td>
                              <td style={{ fontWeight: '700' }}>{b.biltyNo}</td>
                              <td>{b.date}</td>
                              <td>{b.fromCity} → {b.toCity}</td>
                              <td style={{ color: '#f97316', fontWeight: '700' }}>{b.vehicleNumber}</td>
                              <td>{b.actualWeight} {b.unit}</td>
                              <td style={{ fontWeight: '700' }}>₹{b.totalFreight}/-</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', background: '#f8fafc', padding: '16px 24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>
                    Selected Bilty List: {selectedBiltyNos.length}
                  </span>
                  <button 
                    type="button"
                    style={{ ...styles.greenActionBtn, opacity: selectedBiltyNos.length === 0 ? 0.6 : 1, cursor: selectedBiltyNos.length === 0 ? 'not-allowed' : 'pointer' }}
                    disabled={selectedBiltyNos.length === 0}
                    onClick={handleProceedWithSelections}
                  >
                    Proceed to Generate Truck Hire Chalan
                  </button>
                </div>
              </div>
            )}

            {/* B: Loading Slip tab selector block */}
            {activeTab === 'LoadingSlip' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Supplier Name *</label>
                  <select 
                    className="form-control" 
                    style={{ height: '40px' }}
                    value={loadingSupplier}
                    onChange={(e) => {
                      setLoadingSupplier(e.target.value);
                      setSelectedSlipNos([]);
                    }}
                  >
                    <option>Select Loading Slip Supplier Name</option>
                    {seededSuppliers.map(s => (
                      <option key={s.name} value={s.name}>{s.name} (Slips: {getSlipCountForSupplier(s.name)})</option>
                    ))}
                  </select>
                </div>

                {loadingSupplier !== 'Select Loading Slip Supplier Name' && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                    <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ width: '50px' }}>Select</th>
                          <th>Loading Slip No.</th>
                          <th>Date</th>
                          <th>Route</th>
                          <th>Vehicle Number</th>
                          <th>Driver Advance</th>
                          <th>Total Freight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slips.filter(s => s.supplierName?.toLowerCase() === loadingSupplier.toLowerCase()).map(s => {
                          const isSel = selectedSlipNos.includes(s.slipNo);
                          return (
                            <tr key={s._id} onClick={() => toggleSlipNo(s.slipNo)} style={{ cursor: 'pointer', background: isSel ? '#eff6ff' : 'none' }}>
                              <td>
                                <input type="checkbox" checked={isSel} onChange={() => {}} style={{ pointerEvents: 'none' }} />
                              </td>
                              <td style={{ fontWeight: '700' }}>#{s.slipNo}</td>
                              <td>{s.date}</td>
                              <td>{s.fromCity} → {s.toCity}</td>
                              <td style={{ color: '#f97316', fontWeight: '700' }}>{s.vehicleNumber}</td>
                              <td>₹{s.driverAdvance}/-</td>
                              <td style={{ fontWeight: '700' }}>₹{s.totalFreight}/-</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', background: '#f8fafc', padding: '16px 24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>
                    Selected Bilty List: {selectedSlipNos.length}
                  </span>
                  <button 
                    type="button"
                    style={{ ...styles.greenActionBtn, opacity: selectedSlipNos.length === 0 ? 0.6 : 1, cursor: selectedSlipNos.length === 0 ? 'not-allowed' : 'pointer' }}
                    disabled={selectedSlipNos.length === 0}
                    onClick={handleProceedWithSelections}
                  >
                    Proceed to Generate Truck Hire Chalan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Detailed Chalan Form Workspace (Screenshot 2, 4, 5) */}
      {showFormPage && activeTab === 'Manual' && (
        <div style={styles.container} className="print-hidden">
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingChalan(null); if (setActivePage) setActivePage('dashboard'); }} />
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingChalan(null); if (setActivePage) setActivePage('dashboard'); }}>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingChalan(null); }}>Chalan</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>{editingChalan ? 'Edit Chalan' : 'Create New Chalan'}</span>
            </div>
            <button 
              style={styles.backToListBtn} 
              onClick={() => {
                setShowFormPage(false);
                setEditingChalan(null);
              }}
            >
              Chalan List
            </button>
          </div>

          <div style={styles.formCard}>
            <h2 style={styles.modalTitle}>Chalan Form</h2>

            <div style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '24px', textTransform: 'uppercase' }}>
              Create Chalan Using : {formMode}
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={styles.formGridPage}>
                
                {/* 1. Header main metadata */}
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Chalan Number *</label>
                    <input 
                      type="text" required style={styles.formInputPage}
                      value={chalanNo} onChange={(e) => setChalanNo(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Chalan Generate Date *</label>
                    <input 
                      type="date" required style={styles.formInputPage}
                      value={chalanDate} onChange={(e) => setChalanDate(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Branch Code</label>
                    <input 
                      type="text" style={styles.formInputPage} placeholder="Branch Code"
                      value={branchCode} onChange={(e) => setBranchCode(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Financial Year</label>
                    <select 
                      className="form-control" style={{ height: '40px' }}
                      value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}
                    >
                      <option value="2026-2027">2026-2027</option>
                      <option value="2025-2026">2025-2026</option>
                    </select>
                  </div>
                </div>

                {/* 2. Supplier Details */}
                <h4 style={styles.subHeading}>Supplier Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Supplier name *</label>
                    {formMode === 'MANUAL' ? (
                      <select 
                        className="form-control" style={{ height: '40px' }} required
                        value={supplierName} 
                        onChange={(e) => {
                          const sObj = seededSuppliers.find(x => x.name === e.target.value) || {};
                          setSupplierName(e.target.value);
                          setSupplierMobile(sObj.phone || '');
                          setSupplierPan(sObj.pan || '');
                          setSupplierAddress(sObj.address || '');
                        }}
                      >
                        <option value="">Supplier Name</option>
                        {seededSuppliers.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                    ) : (
                      <input 
                        type="text" required style={styles.formInputPage} disabled
                        value={supplierName}
                      />
                    )}
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Mobile number</label>
                    <input 
                      type="text" style={styles.formInputPage} placeholder="Mobile Number"
                      value={supplierMobile} onChange={(e) => setSupplierMobile(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>PAN Number</label>
                    <input 
                      type="text" style={styles.formInputPage} placeholder="PAN Number"
                      value={supplierPan} onChange={(e) => setSupplierPan(e.target.value)}
                    />
                  </div>
                </div>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Address</label>
                  <textarea 
                    style={styles.formTextareaPage} placeholder="Address"
                    value={supplierAddress} onChange={(e) => setSupplierAddress(e.target.value)}
                  />
                  <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                </div>

                {/* 3. Consignor, Consignee & Broker Details */}
                <h4 style={styles.subHeading}>Consignor, Consignee & Broker Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Consignor Name</label>
                    <input type="text" style={styles.formInputPage} placeholder="Consignor Name" value={consignorName} onChange={(e) => setConsignorName(e.target.value)} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Consignee Name</label>
                    <input type="text" style={styles.formInputPage} placeholder="Consignee Name" value={consigneeName} onChange={(e) => setConsigneeName(e.target.value)} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Broker Name</label>
                    <input type="text" style={styles.formInputPage} placeholder="Broker Name" value={brokerName} onChange={(e) => setBrokerName(e.target.value)} />
                  </div>
                </div>

                {/* 4. Truck Details */}
                <h4 style={styles.subHeading}>Truck Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Vehicle Number *</label>
                    <div style={styles.quadInputRow}>
                      <input type="text" maxLength="2" style={styles.quadInputBox} placeholder="XX" value={vPart1} onChange={(e) => setVPart1(e.target.value)} />
                      <input type="text" maxLength="2" style={styles.quadInputBox} placeholder="XX" value={vPart2} onChange={(e) => setVPart2(e.target.value)} />
                      <input type="text" maxLength="2" style={styles.quadInputBox} placeholder="XX" value={vPart3} onChange={(e) => setVPart3(e.target.value)} />
                      <input type="text" maxLength="4" style={styles.quadInputBox} placeholder="XXXX" value={vPart4} onChange={(e) => setVPart4(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>From</label>
                    <input type="text" style={styles.formInputPage} placeholder="From Location" value={fromCity} onChange={(e) => setFromCity(e.target.value)} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>To</label>
                    <input type="text" style={styles.formInputPage} placeholder="To Location" value={toCity} onChange={(e) => setToCity(e.target.value)} />
                  </div>
                </div>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Driver Name</label>
                    <input type="text" style={styles.formInputPage} placeholder="Driver Name" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>DL Number</label>
                    <input type="text" style={styles.formInputPage} placeholder="DL Number" value={driverDl} onChange={(e) => setDriverDl(e.target.value)} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Driver Mobile No.</label>
                    <input type="text" style={styles.formInputPage} placeholder="Driver Mobile No." value={driverMobile} onChange={(e) => setDriverMobile(e.target.value)} />
                  </div>
                </div>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bilty Number</label>
                    <input type="text" style={styles.formInputPage} placeholder="Bilty Number" value={biltyNo} onChange={(e) => setBiltyNo(e.target.value)} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bilty Date</label>
                    <input type="date" style={styles.formInputPage} value={biltyDate} onChange={(e) => setBiltyDate(e.target.value)} />
                  </div>
                </div>

                {/* 5. Material Details */}
                <h4 style={styles.subHeading}>Material Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 2.2 }}>
                    <label style={styles.formLabelPage}>Material Name</label>
                    <input type="text" style={styles.formInputPage} placeholder="Material Name" value={materialName} onChange={(e) => setMaterialName(e.target.value)} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Freight Type</label>
                    <select 
                      className="form-control" style={{ height: '40px' }}
                      value={freightType} onChange={(e) => setFreightType(e.target.value)}
                    >
                      <option value="Select Freight Type">Select Freight Type</option>
                      <option value="Per Ton">Per Ton</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                  </div>
                </div>

                {/* 6. Freight Details */}
                <h4 style={styles.subHeading}>Freight Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Weight</label>
                    <input type="number" style={styles.formInputPage} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Unit</label>
                    <select className="form-control" style={{ height: '40px' }} value={unit} onChange={(e) => setUnit(e.target.value)}>
                      <option value="MT (Metric Ton)">MT (Metric Ton)</option>
                      <option value="Kgs">Kgs</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Rate</label>
                    <input type="number" style={styles.formInputPage} placeholder="Rate" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 0.5, marginTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={isFixed} onChange={(e) => setIsFixed(e.target.checked)} /> FIXED
                    </label>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Freight Amount</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={freightAmount} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Halting Charges</label>
                    <input type="number" style={styles.formInputPage} placeholder="Halting Charge" value={haltingCharges} onChange={(e) => setHaltingCharges(Number(e.target.value))} />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Plus / Minus Below Charges</label>
                    <select className="form-control" style={{ height: '40px' }} value={belowChargesType} onChange={(e) => setBelowChargesType(e.target.value)}>
                      <option value="Plus (+) to Freight">Plus (+) to Freight</option>
                      <option value="Minus (-) from Freight">Minus (-) from Freight</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Hamali Charges</label>
                    <input type="number" style={styles.formInputPage} placeholder="Hamali Charge" value={hamaliCharges} onChange={(e) => setHamaliCharges(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Service Charge</label>
                    <input type="number" style={styles.formInputPage} placeholder="Service Charge" value={serviceCharge} onChange={(e) => setServiceCharge(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Other Charge</label>
                    <input type="number" style={styles.formInputPage} placeholder="Other Charge" value={otherCharge} onChange={(e) => setOtherCharge(Number(e.target.value))} />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Total Freight</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={totalFreight} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Shortage Quantity</label>
                    <input type="number" style={styles.formInputPage} value={shortageQty} onChange={(e) => setShortageQty(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 0.8 }}>
                    <label style={styles.formLabelPage}>Shortage Unit</label>
                    <select className="form-control" style={{ height: '40px' }} value={shortageUnit} onChange={(e) => setShortageUnit(e.target.value)}>
                      <option value="MT (Metric Ton)">MT (Metric Ton)</option>
                      <option value="Kgs">Kgs</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Shortage Amount</label>
                    <input type="number" style={styles.formInputPage} value={shortageAmt} onChange={(e) => setShortageAmt(Number(e.target.value))} />
                  </div>
                </div>

                {/* 7. Advances */}
                <h4 style={styles.subHeading}>Advances Registry</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Advance Amount 1</label>
                    <input type="number" style={styles.formInputPage} value={advAmt1} onChange={(e) => setAdvAmt1(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Payment Mode 1</label>
                    <select className="form-control" style={{ height: '40px' }} value={advMode1} onChange={(e) => setAdvMode1(e.target.value)}>
                      <option value="Select Advance Payment Mode">Select Advance Payment Mode</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Payment Date 1</label>
                    <input type="date" style={styles.formInputPage} value={advDate1} onChange={(e) => setAdvDate1(e.target.value)} />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Advance Amount 2</label>
                    <input type="number" style={styles.formInputPage} value={advAmt2} onChange={(e) => setAdvAmt2(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Payment Mode 2</label>
                    <select className="form-control" style={{ height: '40px' }} value={advMode2} onChange={(e) => setAdvMode2(e.target.value)}>
                      <option value="Select Advance Payment Mode">Select Advance Payment Mode</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Payment Date 2</label>
                    <input type="date" style={styles.formInputPage} value={advDate2} onChange={(e) => setAdvDate2(e.target.value)} />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Advance Amount 3</label>
                    <input type="number" style={styles.formInputPage} value={advAmt3} onChange={(e) => setAdvAmt3(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Payment Mode 3</label>
                    <select className="form-control" style={{ height: '40px' }} value={advMode3} onChange={(e) => setAdvMode3(e.target.value)}>
                      <option value="Select Advance Payment Mode">Select Advance Payment Mode</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Payment Date 3</label>
                    <input type="date" style={styles.formInputPage} value={advDate3} onChange={(e) => setAdvDate3(e.target.value)} />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Advance Amount 4</label>
                    <input type="number" style={styles.formInputPage} value={advAmt4} onChange={(e) => setAdvAmt4(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Payment Mode 4</label>
                    <select className="form-control" style={{ height: '40px' }} value={advMode4} onChange={(e) => setAdvMode4(e.target.value)}>
                      <option value="Select Advance Payment Mode">Select Advance Payment Mode</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Payment Date 4</label>
                    <input type="date" style={styles.formInputPage} value={advDate4} onChange={(e) => setAdvDate4(e.target.value)} />
                  </div>
                </div>

                {/* 8. Diesel Advance */}
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Diesel Advance</label>
                    <input type="number" style={styles.formInputPage} placeholder="Diesel Advance" value={dieselAdvance} onChange={(e) => setDieselAdvance(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Pump</label>
                    <select className="form-control" style={{ height: '40px' }} value={selectedPump} onChange={(e) => setSelectedPump(e.target.value)}>
                      <option value="Select Pump">Select Pump</option>
                      {dieselPumps.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Pump Payment Mode</label>
                    <select className="form-control" style={{ height: '40px' }} value={pumpPaymentMode} onChange={(e) => setPumpPaymentMode(e.target.value)}>
                      <option value="Select Payment Mode">Select Payment Mode</option>
                      <option value="Card Credit">Card Credit</option>
                      <option value="Direct Fuel Coupon">Direct Fuel Coupon</option>
                    </select>
                  </div>
                </div>

                {/* 9. Commisions & Balances */}
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Total Advance</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={totalAdvance} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Commission Type</label>
                    <select className="form-control" style={{ height: '40px' }} value={commissionType} onChange={(e) => setCommissionType(e.target.value)}>
                      <option value="Fixed">Fixed</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Commission Amount</label>
                    <input type="number" style={styles.formInputPage} value={commissionAmount} onChange={(e) => setCommissionAmount(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Commission Plus/Minus</label>
                    <select className="form-control" style={{ height: '40px' }} value={commissionPlusMinus} onChange={(e) => setCommissionPlusMinus(e.target.value)}>
                      <option value="None">None</option>
                      <option value="Plus">Plus (+)</option>
                      <option value="Minus">Minus (-)</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>TDS Amount</label>
                    <input type="number" style={styles.formInputPage} value={tdsAmount} onChange={(e) => setTdsAmount(Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Balance Amount</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={balanceAmount} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Commission Status</label>
                    <select className="form-control" style={{ height: '40px' }} value={commissionStatus} onChange={(e) => setCommissionStatus(e.target.value)}>
                      <option value="Commission Payment Status">Commission Payment Status</option>
                      <option value="Settled">Settled</option>
                      <option value="Deducted">Deducted from Trip</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>Balance Payable At</label>
                    <input type="text" style={styles.formInputPage} placeholder="Balance Payable At" value={balancePayableAt} onChange={(e) => setBalancePayableAt(e.target.value)} />
                  </div>
                </div>

                {/* 10. Remarks */}
                <h4 style={styles.subHeading}>Other Remarks</h4>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Remark :</label>
                  <textarea 
                    style={styles.formTextareaPage} placeholder="Other Remarks"
                    value={remarks} onChange={(e) => setRemarks(e.target.value)}
                  />
                  <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                  <input type="checkbox" checked={hideDatetime} onChange={(e) => setHideDatetime(e.target.checked)} />
                  <label style={{ fontSize: '0.85rem' }}>HIDE GENERATED DATETIME FROM PDF</label>
                </div>

                {/* E-signature Canvas Drawing Pad */}
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>E-signature</label>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                      <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
                        <canvas
                          ref={canvasRef}
                          width={320}
                          height={120}
                          style={{ display: 'block', cursor: 'crosshair', backgroundColor: '#ffffff' }}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                        />
                      </div>
                      <button 
                        type="button" 
                        style={styles.actionBtnClearSig}
                        onClick={clearSignature}
                      >
                        CLEAR SIGNATURE
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              <div style={styles.greenButtonContainer}>
                <button type="submit" style={styles.greenActionBtn}>
                  Generate Chalan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Beautiful Print ready Tax Chalan overlay */}
      {printingChalan && (
        <div style={styles.printOverlay} className="print-overlay-container">
          {/* Dynamic Style Injection for high-fidelity borders, grids, and print-media optimization */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-container-visible, .print-container-visible * {
                visibility: visible;
              }
              .print-container-visible {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                max-width: 100%;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: #ffffff !important;
              }
              .print-controls {
                display: none !important;
              }
            }
          `}</style>
          <div className="print-container-visible" style={styles.printContainer}>
            <div style={styles.printHeader}>
              <div style={styles.printLogo}>
                {logoImg && <img src={logoImg} alt="Logo" style={{ height: '36px', verticalAlign: 'middle', marginRight: '8px' }} />}
                <span style={{ color: headingColor || '#0066cc' }}>TRANSCORE LOGISTICS</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ color: headingColor || '#0066cc', fontSize: '1.2rem', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
                  TRUCK HIRE CHALAN
                </h2>
                <span style={{ fontSize: '0.75rem' }}><b>Chalan No:</b> CH-{printingChalan.chalanNo}</span><br />
                <span style={{ fontSize: '0.75rem' }}><b>Date:</b> {printingChalan.date}</span>
              </div>
            </div>

            <hr style={{ ...styles.divider, borderTopColor: headingColor || '#0066cc' }} />

            <div style={styles.printSection}>
              <div style={styles.printCol}>
                <h4 style={{ color: headingColor || '#0066cc', fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>HIRED VEHICLE DETAILS</h4>
                <p><b>Vehicle Number:</b> {printingChalan.vehicleNumber}</p>
                <p><b>From → To:</b> {printingChalan.fromCity} → {printingChalan.toCity}</p>
                <p><b>Driver Name:</b> {printingChalan.driverName}</p>
                <p><b>DL Number:</b> {printingChalan.driverDl || 'N/A'}</p>
                <p><b>Driver Contact:</b> {printingChalan.driverMobile || 'N/A'}</p>
              </div>
              <div style={styles.printCol}>
                <h4 style={{ color: headingColor || '#0066cc', fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>LORRY SUPPLIER DETAILS</h4>
                <p><b>Name:</b> {printingChalan.supplierName}</p>
                <p><b>Mobile:</b> {printingChalan.supplierMobile || 'N/A'}</p>
                <p><b>PAN Card:</b> {printingChalan.supplierPan || 'N/A'}</p>
                <p><b>Address:</b> {printingChalan.supplierAddress || 'N/A'}</p>
              </div>
            </div>

            <h5 style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '700', marginBottom: '8px' }}>Material Cargo Details</h5>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
              <b>Material Description:</b> {printingChalan.materialName || 'Commercial Industrial Cargo'} • 
              <b> Weight Details:</b> {printingChalan.weight} {printingChalan.unit} • 
              <b> Freight Calculation Basis:</b> {printingChalan.isFixed ? 'Fixed Lumsum Rate' : 'Per MT Rate'}
            </p>

            <div style={styles.printFreightSummary}>
              <div style={styles.freightRow}><span>Hiring Lorry Freight (Subtotal):</span> <b>₹{printingChalan.lorryFreight}/-</b></div>
              <div style={styles.freightRow}><span>Less - Advances Paid:</span> <b style={{ color: '#16a34a' }}>- ₹{printingChalan.advancePaid}/-</b></div>
              {printingChalan.tdsAmount > 0 && <div style={styles.freightRow}><span>Less - TDS Amount:</span> <b style={{ color: '#ef4444' }}>- ₹{printingChalan.tdsAmount}/-</b></div>}
              {printingChalan.shortageAmt > 0 && <div style={styles.freightRow}><span>Less - Shortage Deduction:</span> <b style={{ color: '#ef4444' }}>- ₹{printingChalan.shortageAmt}/-</b></div>}
              <div style={styles.freightRow}><span style={{ color: '#ef4444', fontWeight: '800' }}>NET BALANCE TO SUPPLIER/DRIVER:</span> <b style={{ color: '#ef4444', fontSize: '1rem' }}>₹{printingChalan.balanceToDriver}/-</b></div>
            </div>

            <div style={styles.printFooter}>
              <div style={{ flex: 1, marginRight: '20px' }}>
                <p style={{ fontSize: '0.6rem', color: '#64748b', lineHeight: '1.4' }}>
                  <strong>Terms & Payment Settlement:</strong> Lorry Hired Freight settlements are paid under compliance terms. Receiver and Transporter authorization signatures are legally mandatory for final cash settlements.
                </p>
              </div>

              {/* Draw e-signature canvas on print if exists */}
              {printingChalan.signatureData && (
                <div style={{ textAlign: 'center', marginRight: '30px' }}>
                  <img src={printingChalan.signatureData} alt="Client Signature" style={{ height: '55px', display: 'block', margin: '0 auto 4px auto', borderBottom: '1px solid #cbd5e1' }} />
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Authorized Signature</span>
                </div>
              )}

              <div style={styles.signatureBlock}>
                {stampImg ? (
                  <img src={stampImg} alt="Stamp" style={{ height: '48px', marginBottom: '4px', objectFit: 'contain' }} />
                ) : (
                  <div style={{
                    border: '3px double #0066cc',
                    color: '#0066cc',
                    borderRadius: '50%',
                    width: '74px',
                    height: '74px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.45rem',
                    textTransform: 'uppercase',
                    transform: 'rotate(-4deg)',
                    padding: '4px',
                    textAlign: 'center',
                    lineHeight: '1.1',
                    margin: '0 auto 8px auto'
                  }}>
                    <span>Transcore</span>
                    <span style={{ fontSize: '0.35rem', borderTop: '1px solid #0066cc', paddingTop: '2.5px' }}>LOGISTICS</span>
                    <span style={{ fontSize: '0.35rem', color: '#ef4444' }}>APPROVED</span>
                  </div>
                )}
                <div style={styles.sigLine}></div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Hired Dispatch Clerk</span>
              </div>
            </div>

            <div style={styles.printControls}>
              <button className="btn btn-secondary" onClick={() => setPrintingChalan(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>Print Chalan</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Filter Modal Options */}
      {filterModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '90%', maxWidth: '700px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontWeight: '800', color: '#ef4444', fontSize: '1.1rem' }}>Filter Options</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setFilterModalOpen(false)} />
            </div>

            <div className="form-grid" style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1.5, minWidth: '200px' }} className="form-group">
                  <label style={styles.formLabelPage}>Supplier Name</label>
                  <select className="form-control" style={{ height: '38px' }} value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}>
                    <option>Select Supplier Name</option>
                    {Array.from(new Set(chalans.map(c => c.supplierName))).filter(Boolean).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1.5, minWidth: '200px' }} className="form-group">
                  <label style={styles.formLabelPage}>Vehicle Number</label>
                  <select className="form-control" style={{ height: '38px' }} value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)}>
                    <option>Select Vehicle Number</option>
                    {Array.from(new Set(chalans.map(c => c.vehicleNumber))).filter(Boolean).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }} className="form-group">
                  <label style={styles.formLabelPage}>From Date</label>
                  <input type="date" className="form-control" style={{ height: '38px' }} value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} />
                </div>
                <div style={{ flex: 1 }} className="form-group">
                  <label style={styles.formLabelPage}>To Date</label>
                  <input type="date" className="form-control" style={{ height: '38px' }} value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button className="btn btn-secondary" style={{ padding: '8px 24px', marginRight: 'auto' }} onClick={() => {
                setFilterSupplier('Select Supplier Name');
                setFilterVehicle('Select Vehicle Number');
                setFilterFromDate('');
                setFilterToDate('');
              }}>Reset</button>
              <button className="btn btn-primary" style={{ backgroundColor: '#00b050', border: 'none', padding: '8px 24px', fontWeight: '700' }} onClick={() => setFilterModalOpen(false)}>Search</button>
              <button className="btn btn-secondary" style={{ padding: '8px 24px' }} onClick={() => setFilterModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Report Options Modal (Screenshot 1) */}
      {reportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '90%', maxWidth: '750px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontWeight: '800', color: '#ef4444', fontSize: '1.1rem' }}>Report Options</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setReportModalOpen(false)} />
            </div>

            <div className="form-grid" style={{ fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }} className="form-group">
                  <label style={styles.formLabelPage}>Supplier Name</label>
                  <select className="form-control" style={{ height: '38px', fontSize: '0.8rem' }} value={repSupplier} onChange={(e) => setRepSupplier(e.target.value)}>
                    <option>Select Supplier Name</option>
                    {seededSuppliers.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '180px' }} className="form-group">
                  <label style={styles.formLabelPage}>Truck No.</label>
                  <select className="form-control" style={{ height: '38px', fontSize: '0.8rem' }} value={repVehicle} onChange={(e) => setRepVehicle(e.target.value)}>
                    <option>Select Truck No.</option>
                    {Array.from(new Set(chalans.map(c => c.vehicleNumber))).filter(Boolean).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '180px' }} className="form-group">
                  <label style={styles.formLabelPage}>Chalan No.</label>
                  <select className="form-control" style={{ height: '38px', fontSize: '0.8rem' }} value={repChalan} onChange={(e) => setRepChalan(e.target.value)}>
                    <option>Select Chalan No.</option>
                    {chalans.map(c => <option key={c._id} value={c.chalanNo}>{c.chalanNo}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '150px' }} className="form-group">
                  <label style={styles.formLabelPage}>From Location</label>
                  <select className="form-control" style={{ height: '38px', fontSize: '0.8rem' }} value={repFromLoc} onChange={(e) => setRepFromLoc(e.target.value)}>
                    <option>Select From Location</option>
                    {Array.from(new Set(chalans.map(c => c.fromCity))).filter(Boolean).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }} className="form-group">
                  <label style={styles.formLabelPage}>To Location</label>
                  <select className="form-control" style={{ height: '38px', fontSize: '0.8rem' }} value={repToLoc} onChange={(e) => setRepToLoc(e.target.value)}>
                    <option>Select To Location</option>
                    {Array.from(new Set(chalans.map(c => c.toCity))).filter(Boolean).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }} className="form-group">
                  <label style={styles.formLabelPage}>From Date</label>
                  <input type="date" className="form-control" style={{ height: '38px' }} value={repFromDate} onChange={(e) => setRepFromDate(e.target.value)} />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }} className="form-group">
                  <label style={styles.formLabelPage}>To Date</label>
                  <input type="date" className="form-control" style={{ height: '38px' }} value={repToDate} onChange={(e) => setRepToDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#00b050', border: 'none', padding: '8px 32px', fontWeight: '700' }} 
                onClick={() => {
                  const filtered = chalans.filter(c => {
                    if (repSupplier !== 'Select Supplier Name' && c.supplierName !== repSupplier) return false;
                    if (repVehicle !== 'Select Truck No.' && c.vehicleNumber !== repVehicle) return false;
                    if (repChalan !== 'Select Chalan No.' && c.chalanNo !== repChalan) return false;
                    if (repFromLoc !== 'Select From Location' && c.fromCity !== repFromLoc) return false;
                    if (repToLoc !== 'Select To Location' && c.toCity !== repToLoc) return false;
                    if (repFromDate && c.date < repFromDate) return false;
                    if (repToDate && c.date > repToDate) return false;
                    return true;
                  });
                  setPrintingReport(filtered);
                  setReportModalOpen(false);
                }}
              >
                Download
              </button>
              <button className="btn btn-secondary" style={{ padding: '8px 32px' }} onClick={() => setReportModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Printable Hired Chalan Register Sheet */}
      {printingReport && (
        <div style={styles.printOverlay} className="print-overlay-container">
          <div className="print-container-visible" style={{ ...styles.printContainer, maxWidth: '950px' }}>
            <div style={styles.printHeader}>
              <div style={styles.printLogo}>
                {logoImg && <img src={logoImg} alt="Logo" style={{ height: '34px', verticalAlign: 'middle', marginRight: '8px' }} />}
                <span style={{ color: headingColor || '#0066cc' }}>TRANSCORE LOGISTICS</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ color: headingColor || '#0066cc', fontSize: '1.1rem', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
                  LORRY HIRE CHALAN REGISTER
                </h3>
                <span style={{ fontSize: '0.7rem' }}><b>Report Period:</b> {repFromDate} to {repToDate}</span>
              </div>
            </div>

            <hr style={{ ...styles.divider, borderTopColor: headingColor || '#0066cc', margin: '14px 0' }} />

            <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
              <table className="custom-table" style={{ fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th>SNo.</th>
                    <th>Chalan Date</th>
                    <th>Chalan No.</th>
                    <th>Supplier Name</th>
                    <th>Vehicle Number</th>
                    <th>Route</th>
                    <th>Total Freight</th>
                    <th>Advances Paid</th>
                    <th>Balance Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {printingReport.map((c, idx) => (
                    <tr key={c._id}>
                      <td>{idx + 1}</td>
                      <td>{c.date}</td>
                      <td style={{ fontWeight: '700', color: '#0066cc' }}>CH-{c.chalanNo}</td>
                      <td style={{ fontWeight: '700' }}>{c.supplierName}</td>
                      <td style={{ color: '#f97316', fontWeight: '700' }}>{c.vehicleNumber}</td>
                      <td>{c.fromCity} → {c.toCity}</td>
                      <td>₹{c.lorryFreight || 0}/-</td>
                      <td style={{ color: '#16a34a' }}>₹{c.advancePaid || 0}/-</td>
                      <td style={{ color: '#ef4444', fontWeight: '700' }}>₹{c.balanceToDriver || 0}/-</td>
                      <td>{c.paymentStatus}</td>
                    </tr>
                  ))}
                  {printingReport.length === 0 && (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
                        No records matched your report options.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Total Records Loaded: <b>{printingReport.length}</b>
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>
                Total Outstanding Balance: <span style={{ color: '#ef4444' }}>₹{printingReport.reduce((acc, curr) => acc + (curr.balanceToDriver || 0), 0)}/-</span>
              </span>
            </div>

            <div style={styles.printControls}>
              <button className="btn btn-secondary" onClick={() => setPrintingReport(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>Print Register</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a'
  },
  mainCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px'
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#1e293b'
  },
  actionsBar: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  filterBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none'
  },
  createBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none'
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '4px 10px',
    gap: '6px',
    backgroundColor: '#ffffff'
  },
  searchIcon: {
    color: '#94a3b8'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '0.85rem',
    color: '#334155',
    width: '180px',
    fontFamily: "'Inter', sans-serif"
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '600'
  },
  breadcrumbSeparator: {
    margin: '0 8px',
    color: '#cbd5e1'
  },
  breadcrumbActive: {
    color: '#0066cc',
    fontWeight: '700'
  },
  backToListBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  formCard: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    width: '100%'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#0f172a',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px',
    marginBottom: '20px'
  },
  tabBtn: {
    border: 'none',
    background: 'none',
    padding: '8px 16px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.15s ease'
  },
  formGridPage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  formGridRowPage: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  formGroupPage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formLabelPage: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#334155'
  },
  formInputPage: {
    padding: '10px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    fontFamily: "'Inter', sans-serif",
    height: '40px'
  },
  formTextareaPage: {
    padding: '10px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    height: '80px',
    resize: 'none',
    fontFamily: "'Inter', sans-serif"
  },
  warningText: {
    fontSize: '0.7rem',
    color: '#ef4444',
    fontWeight: '600',
    marginTop: '2px'
  },
  subHeading: {
    fontSize: '0.8rem',
    color: '#0066cc',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '16px',
    borderLeft: '3px solid #0066cc',
    paddingLeft: '8px'
  },
  quadInputRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  quadInputBox: {
    width: '60px',
    height: '40px',
    padding: '8px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.875rem',
    textAlign: 'center',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    textTransform: 'uppercase'
  },
  actionBtn: {
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    border: '1px solid #dbeafe',
    borderRadius: '4px',
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  actionPrintBtn: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #dcfce7',
    borderRadius: '4px',
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  actionDeleteBtn: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '1px solid #fee2e2',
    borderRadius: '4px',
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  actionBtnClearSig: {
    backgroundColor: '#bf2c1d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    height: '40px',
    alignSelf: 'center'
  },
  greenButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px'
  },
  greenActionBtn: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '700',
    padding: '12px 64px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 176, 80, 0.2)',
    transition: 'background-color 0.2s',
    outline: 'none'
  },

  // Print overlays styles
  printOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8fafc',
    zIndex: 2000,
    overflowY: 'auto',
    padding: '40px 20px'
  },
  printContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: '8px',
    position: 'relative'
  },
  printHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  printLogo: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#0066cc',
    display: 'flex',
    alignItems: 'center'
  },
  divider: {
    margin: '20px 0',
    border: 'none',
    borderTop: '2px solid #0066cc'
  },
  printSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '20px'
  },
  printCol: {
    fontSize: '0.85rem',
    lineHeight: '1.6'
  },
  printTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px'
  },
  printTh: {
    textAlign: 'left',
    padding: '8px 10px',
    borderBottom: '1px solid #cbd5e1',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#334155'
  },
  printTd: {
    padding: '10px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.85rem',
    color: '#1e293b'
  },
  printFreightSummary: {
    width: '320px',
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    border: '1px solid #e2e8f0',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: '#f8fafc'
  },
  freightRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  },
  printFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '20px'
  },
  signatureBlock: {
    textAlign: 'center',
    width: '200px'
  },
  sigLine: {
    borderBottom: '1px solid #64748b',
    marginBottom: '8px',
    height: '40px'
  },
  printControls: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '30px',
    borderTop: '1px solid #cbd5e1',
    paddingTop: '20px'
  }
};
