import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Printer, Share2, CheckCircle, Clock, Home, Download, Filter, FileText, ChevronDown, ChevronsDown, ChevronsUp, X } from 'lucide-react';
import BiltyTemplate1 from '../components/templates/BiltyTemplate1';
import BiltyTemplate2 from '../components/templates/BiltyTemplate2';
import ConsignmentTemplate from '../components/templates/ConsignmentTemplate';

const compileBiltyTemplate = (html, data, user, logoImg, stampImg) => {
  if (!html) return '';
  const replacements = {
    company_logo: logoImg || '',
    company_stamp: stampImg || '',
    company_name: user?.companyName || 'ROADWE VENTURES PRIVATE LIMITED',
    company_address: user?.address || 'ROADWE HQ, Raipur, Chhattisgarh',
    company_mobile: user?.mobile || '8269203922',
    company_pan: user?.companyPan || 'AAACT9211C',
    company_gstin: user?.gstin || '22AAAAA0000A1Z1',
    demurrage_charge: data.demurrageCharge || 0,
    demurrage_grace: data.demurrageGrace || '24 Hours',
    demurrage_type: data.demurrageType || 'Per Day',
    bilty_number: data.biltyNo || '',
    date: data.date || '',
    vehicle_number: data.vehicleNumber || '',
    from_city: data.fromCity || '',
    to_city: data.toCity || '',
    consignor_name: data.consignorName || '',
    consignor_address: data.consignorAddress || '',
    consignor_email: data.consignorEmail || '',
    consignor_gstin: data.consignorGstin || '',
    consignor_contact: data.consignorContact || '',
    consignee_name: data.consigneeName || '',
    consignee_address: data.consigneeAddress || '',
    consignee_email: data.consigneeEmail || '',
    consignee_gstin: data.consigneeGstin || '',
    consignee_contact: data.consigneeContact || '',
    invoice_number: data.invoiceNumber || '',
    invoice_date: data.invoiceDate || '',
    eway_bill: data.ewayBillNo || '',
    driver_name: data.driverName || '',
    driver_mobile: data.driverMobile || '',
    driver_dl: data.dlNumber || '',
    owner_name: data.supplierName || '',
    packing_type: data.packingType || '',
    no_of_packages: data.noOfPackages || 0,
    material_name: data.materialName || '',
    goods_description: data.goodsDescription || '',
    hsn_code: data.hsnCode || 'N/A',
    actual_weight: data.actualWeight || 0,
    guarantee_weight: data.chargedWeight || 0,
    rate: data.rate || 0,
    freight_amount: data.freightCharge || 0,
    other_charges: data.otherCharges || 0,
    total_freight: data.totalFreight || 0,
    advance_paid: data.advancePaid || 0,
    balance_amount: data.balanceAmount || 0,
    value_of_goods: data.valueOfGoods || 0,
    gst_paid_by: data.paidBy || 'TBB',
    jurisdiction: data.jurisdiction || 'RAIGARH'
  };

  let compiled = html;
  Object.keys(replacements).forEach(key => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    compiled = compiled.replace(regex, replacements[key]);
  });
  return compiled;
};

export default function Bilty({ 
  bilties, customers, vehicles, quickAddTarget, initialOpen,
  onCreateBilty, onUpdateBilty, onDeleteBilty,
  headingColor, showBiltyBank, selectedBiltyFormat, logoImg, stampImg,
  biltyTemplates = [], user
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormPage, setShowFormPage] = useState(initialOpen || !!quickAddTarget);
  const [editingBilty, setEditingBilty] = useState(null);
  const [activeFilterChip, setActiveFilterChip] = useState('All');

  // Sync initialOpen trigger from Sidebar sub-navigation
  useEffect(() => {
    if (initialOpen) {
      handleOpenAdd();
    } else {
      setShowFormPage(false);
      setEditingBilty(null);
    }
  }, [initialOpen]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  
  // High-Fidelity functional filter modal states
  const [filterParty, setFilterParty] = useState('Select Party Name');
  const [filterVehicle, setFilterVehicle] = useState('Select Vehicle No.');
  const [filterBiltyNo, setFilterBiltyNo] = useState('Select Bilty No.');
  const [filterFromLoc, setFilterFromLoc] = useState('Select From Location');
  const [filterToLoc, setFilterToLoc] = useState('Select To Location');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [filterFreightType, setFilterFreightType] = useState('Select Freight Type');
  const [filterBillStatus, setFilterBillStatus] = useState('Select Bill Status');
  const [filterPaidStatus, setFilterPaidStatus] = useState('Select Paid Status');
  
  // Print & Share Overlays
  const [printingBilty, setPrintingBilty] = useState(null);
  const [sharingBilty, setSharingBilty] = useState(null);

  const [expandedCardId, setExpandedCardId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null); // 'view' or 'download' or null
  const [selectedCopies, setSelectedCopies] = useState({
    consignor: false,
    consignee: false,
    driver: false,
    transport: false
  });
  const [withoutTerms, setWithoutTerms] = useState(false);
  const [printingCopies, setPrintingCopies] = useState(['TRANSPORT COPY']);

  // Expense Modal State
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseBilty, setExpenseBilty] = useState(null);
  const [expenseFormData, setExpenseFormData] = useState({
    actualWeight: 0,
    chargedWeight: 0,
    rate: 0,
    fixedRate: true,
    haltingCharge: 0,
    biltyChargeType1: 'Bilty Charges',
    biltyChargeVal1: 0,
    biltyChargeType2: 'Service Charge',
    biltyChargeVal2: 0,
    otherCharges: 0,
    totalFreight: 0,
    advancePaid: 0,
    balanceAmount: 0,
    truckHireRate: 0,
    truckHireRateFixed: true,
    truckHireCost: 0,
    commissionAmount: 0
  });

  // POD Modal State
  const [showPodModal, setShowPodModal] = useState(false);
  const [podBilty, setPodBilty] = useState(null);
  const [podFormData, setPodFormData] = useState({
    receivingDate: new Date().toISOString().split('T')[0],
    podImage: '',
    podImageBack: '',
    remark: ''
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPodFormData(prev => ({
          ...prev,
          [field]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExpenseFieldChange = (field, value) => {
    const updated = { ...expenseFormData, [field]: value };
    
    // Recalculate freight amount
    const rate = Number(updated.rate) || 0;
    const isFixed = updated.fixedRate;
    const weight = Number(updated.chargedWeight) || Number(updated.actualWeight) || 0;
    const freightAmount = isFixed ? rate : (rate * weight);

    // Total Amount
    const halting = Number(updated.haltingCharge) || 0;
    const b1 = Number(updated.biltyChargeVal1) || 0;
    const b2 = Number(updated.biltyChargeVal2) || 0;
    const other = Number(updated.otherCharges) || 0;
    const totalFreight = freightAmount + halting + b1 + b2 + other;

    // Balance
    const advance = Number(updated.advancePaid) || 0;
    const balance = totalFreight - advance;

    // Truck Hire Cost
    const thRate = Number(updated.truckHireRate) || 0;
    const thFixed = updated.truckHireRateFixed;
    const thCost = thFixed ? thRate : (thRate * weight);

    setExpenseFormData({
      ...updated,
      totalFreight,
      balanceAmount: balance,
      truckHireCost: thCost
    });
  };

  // Split vehicle inputs
  const [vNum1, setVNum1] = useState('');
  const [vNum2, setVNum2] = useState('');
  const [vNum3, setVNum3] = useState('');
  const [vNum4, setVNum4] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    biltyNo: 'G/1000011' + (205 + (bilties?.length || 0)).toString(),
    date: new Date().toISOString().split('T')[0],
    branchCode: 'G',
    financialYear: '2026-2027',
    
    // Consignor Details
    consignorName: '',
    consignorContact: '',
    consignorGstin: '',
    consignorEmail: '',
    consignorBank: '',
    consignorAddress: '',

    // Consignee Details
    consigneeName: '',
    consigneeContact: '',
    consigneeGstin: '',
    consigneeEmail: '',
    consigneeBank: '',
    consigneeAddress: '',
    deliveryAddressSame: false,
    deliveryAddress: '',

    // Truck Details
    vehicleNumber: '',
    vehicleType: 'Own',
    ewayBillNo: '',
    ewayBillExpiry: '',
    vehicleSize: '',
    fromCity: '',
    toCity: '',
    driverName: '',
    driverMobile: '',
    dlNumber: '',
    sealNumber: '',
    supplierName: '',
    supplierMobile: '',
    supplierPan: '',
    supplierAddress: '',

    // Demurrage
    demurrageCharge: 0,
    demurrageType: 'Per Hour',
    demurrageGrace: '24 Hours',

    // Remarks & Toggles
    remarks: '',
    showDalaHamali: false,
    hideWeight: false,
    hideRate: false,
    hideSupplier: false,
    hideDatetime: false,

    // Material details
    insuranceType: 'Not Insured',
    materialType: 'Single Item',
    materialName: '',
    packingType: '',
    noOfPackages: 0,
    invoiceNumber: '',
    hsnCode: '',
    valueOfGoods: '',
    invoiceDate: '',
    gatePassNo: '',
    goodsDescription: '',
    descSameAsInvoice: false,
    actualWeight: 0,
    guaranteeWeight: '',
    unit: 'Tons',

    // Freight calculations
    paidBy: 'TBB',
    rate: 0,
    fixedRate: true,
    haltingCharge: 0,
    biltyChargeType1: 'Bilty Charges',
    biltyChargeVal1: 0,
    biltyChargeType2: 'Service Charge',
    biltyChargeVal2: 0,
    otherCharges: 0,
    advancePaid: 0,
    totalFreight: 0,
    balanceAmount: 0,
    gstPaidBy: 'Select GST Paid By'
  });

  const handleOpenAdd = () => {
    setEditingBilty(null);
    setVNum1('');
    setVNum2('');
    setVNum3('');
    setVNum4('');
    setFormData({
      biltyNo: 'G/1000011' + (205 + (bilties?.length || 0)).toString(),
      date: new Date().toISOString().split('T')[0],
      branchCode: 'G',
      financialYear: '2026-2027',
      consignorName: customers[0]?.name || '',
      consignorContact: customers[0]?.phone || '',
      consignorGstin: customers[0]?.gstin || '',
      consignorEmail: customers[0]?.email || '',
      consignorBank: 'HDFC BANK',
      consignorAddress: customers[0]?.address || '',
      consigneeName: customers[1]?.name || '',
      consigneeContact: customers[1]?.phone || '',
      consigneeGstin: customers[1]?.gstin || '',
      consigneeEmail: customers[1]?.email || '',
      consigneeBank: 'STATE BANK OF INDIA',
      consigneeAddress: customers[1]?.address || '',
      deliveryAddressSame: true,
      deliveryAddress: customers[1]?.address || '',
      vehicleNumber: vehicles[0]?.vehicleNumber || '',
      vehicleType: 'Own',
      ewayBillNo: '',
      ewayBillExpiry: '',
      vehicleSize: '',
      fromCity: 'Kanpur',
      toCity: 'Mumbai',
      driverName: 'Ramesh Singh',
      driverMobile: '9888877777',
      dlNumber: 'DL1234567890123',
      sealNumber: '',
      supplierName: '',
      supplierMobile: '',
      supplierPan: '',
      supplierAddress: '',
      demurrageCharge: 0,
      demurrageType: 'Per Hour',
      demurrageGrace: '24 Hours',
      remarks: '',
      showDalaHamali: false,
      hideWeight: false,
      hideRate: false,
      hideSupplier: false,
      hideDatetime: false,
      insuranceType: 'Not Insured',
      materialType: 'Single Item',
      materialName: 'Fertilizer Seeds',
      packingType: 'Bags',
      noOfPackages: 100,
      invoiceNumber: '',
      hsnCode: '3101',
      valueOfGoods: '',
      invoiceDate: '',
      gatePassNo: '',
      goodsDescription: 'Agricultural Seeds/Chemical Bags',
      descSameAsInvoice: false,
      actualWeight: 20,
      guaranteeWeight: '20',
      unit: 'Tons',
      paidBy: 'TBB',
      rate: 2000,
      fixedRate: true,
      haltingCharge: 0,
      biltyChargeType1: 'Bilty Charges',
      biltyChargeVal1: 50,
      biltyChargeType2: 'Service Charge',
      biltyChargeVal2: 0,
      otherCharges: 0,
      advancePaid: 5000,
      totalFreight: 0,
      balanceAmount: 0,
      gstPaidBy: 'Select GST Paid By'
    });
    setShowFormPage(true);
  };

  const handleOpenEdit = (bilty) => {
    setEditingBilty(bilty);
    setFormData({ ...bilty });
    const parts = (bilty.vehicleNumber || '').split('-');
    setVNum1(parts[0] || '');
    setVNum2(parts[1] || '');
    setVNum3(parts[2] || '');
    setVNum4(parts[3] || '');
    setShowFormPage(true);
  };

  // Perform immediate calculations in the state
  const recalculateValues = (updatedField, value) => {
    const nextForm = { ...formData, [updatedField]: value };
    const rate = Number(nextForm.rate) || 0;
    const isPerTon = nextForm.rateType === 'Per Ton';
    const weight = Number(nextForm.chargedWeight) || Number(nextForm.actualWeight) || 0;

    const baseFreight = isPerTon ? (rate * weight) : rate;
    const halting = Number(nextForm.haltingCharge) || 0;
    const b1 = Number(nextForm.biltyChargeVal1) || 0;
    const b2 = Number(nextForm.biltyChargeVal2) || 0;
    const others = Number(nextForm.otherCharges) || 0;
    const totalFreight = baseFreight + halting + b1 + b2 + others;
    
    const advance = Number(nextForm.advancePaid) || 0;
    const balance = totalFreight - advance;

    setFormData({
      ...nextForm,
      totalFreight,
      balanceAmount: balance
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalVNum = vNum1 ? `${vNum1.toUpperCase()}-${vNum2.toUpperCase()}-${vNum3.toUpperCase()}-${vNum4.toUpperCase()}` : formData.vehicleNumber;

    const finalData = {
      ...formData,
      vehicleNumber: finalVNum
    };

    if (editingBilty) {
      onUpdateBilty(editingBilty._id, finalData);
    } else {
      onCreateBilty(finalData);
    }
    setShowFormPage(false);
    setPrintingBilty(finalData);
  };

  const filteredBilties = bilties.filter(b => {
    // 1. Text search query
    const matchesSearch = 
      b.biltyNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.vehicleNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.consignorName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;

    // Quick filter chip check
    if (activeFilterChip === 'Transit') {
      if (b.deliveryStatus === 'Delivered') return false;
    } else if (activeFilterChip === 'Delivered') {
      if (b.deliveryStatus !== 'Delivered') return false;
    } else if (activeFilterChip === 'Paid') {
      const isPaid = b.deliveryStatus === 'Delivered' || b.paidStatus === 'Paid';
      if (!isPaid) return false;
    } else if (activeFilterChip === 'Unpaid') {
      const isPaid = b.deliveryStatus === 'Delivered' || b.paidStatus === 'Paid';
      if (isPaid) return false;
    }
      
    // 2. Party Name Filter
    if (filterParty !== 'Select Party Name' && b.consignorName !== filterParty) return false;
    
    // 3. Vehicle Number Filter
    if (filterVehicle !== 'Select Vehicle No.' && b.vehicleNumber !== filterVehicle) return false;
    
    // 4. Bilty No Filter
    if (filterBiltyNo !== 'Select Bilty No.' && b.biltyNo !== filterBiltyNo) return false;
    
    // 5. From Location Filter
    if (filterFromLoc !== 'Select From Location' && b.fromCity !== filterFromLoc) return false;
    
    // 6. To Location Filter
    if (filterToLoc !== 'Select To Location' && b.toCity !== filterToLoc) return false;
    
    // 7. Dates
    if (filterFromDate && b.date < filterFromDate) return false;
    if (filterToDate && b.date > filterToDate) return false;
    
    // 8. Freight Type
    if (filterFreightType !== 'Select Freight Type') {
      const isFixed = filterFreightType === 'Fixed';
      if (b.fixedRate !== isFixed) return false;
    }
    
    // 9. Bill Status
    if (filterBillStatus !== 'Select Bill Status') {
      const isBilled = filterBillStatus === 'Billed';
      if (isBilled && !b.isBilled) return false;
      if (!isBilled && b.isBilled) return false;
    }
    
    // 10. Paid Status
    if (filterPaidStatus !== 'Select Paid Status') {
      const isPaid = filterPaidStatus === 'Paid';
      const bIsPaid = b.deliveryStatus === 'Delivered' || b.paidStatus === 'Paid';
      if (isPaid && !bIsPaid) return false;
      if (!isPaid && bIsPaid) return false;
    }
    
    return matchesSearch;
  });

  const formatToCode = {
    1: 'classic_lr',
    2: 'triple_split',
    3: 'relational',
    4: 'invoice_style',
    5: 'minimal'
  };
  const activeCode = formatToCode[selectedBiltyFormat] || 'classic_lr';
  const activeTemplate = biltyTemplates && biltyTemplates.length > 0 && biltyTemplates.find(t => t.template_code === activeCode);

  return (
    <div style={styles.container}>
      
      {/* 1. Gorgeous Card-Structured Bilty list */}
      {!showFormPage && (
        <>
          <div style={styles.header} className="print-hidden">
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('dashboard')} />
              <span style={{ cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('dashboard')}>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingBilty(null); if (setActivePage) setActivePage('bilty-list'); }}>Bilty</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>Bilty List</span>
            </div>
          </div>

          <div style={styles.mainCard} className="print-hidden">
            <div style={styles.cardHeaderRow}>
              <h2 style={styles.cardTitle}>Bilty List ({filteredBilties.length})</h2>
              
              <div style={styles.actionsBar}>
                <button style={styles.excelBtn} onClick={() => {
                  if (confirm('Are you sure you want to delete selected items?')) {
                    alert('🗑️ Selected items deleted successfully.');
                  }
                }}>Delete</button>
                <button style={styles.printBtn} onClick={() => alert('🖨️ Exporting PDF Report...')}>Report</button>
                <button style={styles.filterBtn} onClick={() => setFilterModalOpen(true)}>Filter</button>
                <button style={styles.createBtn} onClick={handleOpenAdd}>Create New Bilty</button>
              </div>
            </div>

            {/* Premium Two-Column Card Grid */}
            <div style={styles.cardGrid}>
              {filteredBilties.map((b) => {
                const isDelivered = b.deliveryStatus === 'Delivered';
                const isPaid = b.deliveryStatus === 'Delivered' || b.paidStatus === 'Paid';
                
                return (
                  <div key={b._id} style={styles.biltyCard}>
                    <div style={styles.cardTopBar}>
                      <span style={styles.cardBiltyNoLabel}>BILTY NO.: <span style={styles.cardBiltyNoValueOriginal}>{b.biltyNo}</span></span>
                      <span style={styles.cardDateOriginal}>{b.date}</span>
                    </div>
                    
                    <div style={styles.cardBodyOriginal}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <h3 style={styles.cardVehicleNoOriginal}>{b.vehicleNumber || 'MARKET VEHICLE'}</h3>
                          <span style={styles.toBeBilledOriginal}>TO BE BILLED : ₹ {b.balanceAmount || b.totalFreight || 0}/-</span>
                          
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                            <label className="switch" style={{ transform: 'scale(0.85)', marginLeft: '-4px' }}>
                              <input 
                                type="checkbox" 
                                checked={isPaid} 
                                onChange={() => {
                                  const nextDeliv = b.deliveryStatus === 'Delivered' ? 'Pending' : 'Delivered';
                                  onUpdateBilty(b._id, { 
                                    ...b, 
                                    deliveryStatus: nextDeliv, 
                                    paidStatus: nextDeliv === 'Delivered' ? 'Paid' : 'Unpaid' 
                                  });
                                }} 
                              />
                              <span className="slider round"></span>
                            </label>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>PAID</span>
                            
                            <button 
                              type="button" 
                              style={styles.addExpenseBtnOriginal}
                              onClick={() => {
                                setExpenseBilty(b);
                                setExpenseFormData({
                                  actualWeight: b.actualWeight || 0,
                                  chargedWeight: b.chargedWeight || b.actualWeight || 0,
                                  rate: b.rate || 0,
                                  fixedRate: b.fixedRate !== false,
                                  haltingCharge: b.haltingCharge || 0,
                                  biltyChargeType1: b.biltyChargeType1 || 'Bilty Charges',
                                  biltyChargeVal1: b.biltyChargeVal1 || 0,
                                  biltyChargeType2: b.biltyChargeType2 || 'Service Charge',
                                  biltyChargeVal2: b.biltyChargeVal2 || 0,
                                  otherCharges: b.otherCharges || 0,
                                  totalFreight: b.totalFreight || 0,
                                  advancePaid: b.advancePaid || 0,
                                  balanceAmount: b.balanceAmount || 0,
                                  truckHireRate: b.truckHireRate || 0,
                                  truckHireRateFixed: b.truckHireRateFixed !== false,
                                  truckHireCost: b.truckHireCost || 0,
                                  commissionAmount: b.commissionAmount || 0
                                });
                                setShowExpenseModal(true);
                              }}
                            >
                              Add Expense
                            </button>
                          </div>
                        </div>
                        
                        <div style={styles.partiesColOriginal}>
                          <p style={{ margin: '0 0 2px 0' }}><b>CONSIGNOR :</b> {b.consignorName}</p>
                          <p style={{ margin: '0 0 2px 0' }}><b>FROM :</b> {b.fromCity}</p>
                          <p style={{ margin: '0 0 2px 0' }}><b>TO :</b> {b.toCity}</p>
                          <span style={styles.createdByTagOriginal}>Created By : {b.createdBy || 'Transcore Logistics'}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ height: '1px', backgroundColor: '#e2e8f0', width: '100%' }} />

                    <div style={styles.cardStatusBarOriginal}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#0066cc' }}>
                            <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b' }}>
                            {b.deliveryStatus || 'In Transit'}
                          </span>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b', cursor: 'pointer' }}>
                          <input type="checkbox" /> Select to delete multiple bilty.
                        </label>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>POD Status Pending</span>
                        <button 
                          type="button" 
                          style={styles.updatePodBtnOriginal}
                          onClick={() => {
                            setPodBilty(b);
                            setPodFormData({
                              receivingDate: b.receivingDate || new Date().toISOString().split('T')[0],
                              podImage: b.podImage || '',
                              podImageBack: b.podImageBack || '',
                              remark: b.remarks || ''
                            });
                            setShowPodModal(true);
                          }}
                        >
                          Update POD
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#0066cc' }}>Billed</span>
                        <button 
                          type="button" 
                          style={styles.expandChevronBtnOriginal}
                          onClick={() => setExpandedCardId(expandedCardId === b._id ? null : b._id)}
                        >
                          {expandedCardId === b._id ? (
                            <ChevronsUp size={12} style={{ color: '#ffffff' }} />
                          ) : (
                            <ChevronsDown size={12} style={{ color: '#ffffff' }} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED INNER DRAWER */}
                    {expandedCardId === b._id && (
                      <div style={styles.expandedDrawerContainer}>
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={withoutTerms} 
                              onChange={(e) => setWithoutTerms(e.target.checked)} 
                            />
                            Without Terms & Conditions
                          </label>
                        </div>

                        <div style={styles.drawerButtonsRow}>
                          <div style={{ position: 'relative' }}>
                            <button 
                              type="button" 
                              style={styles.drawerActionBtn}
                              onClick={() => {
                                setActiveDropdownId(activeDropdownId === 'view' ? null : 'view');
                              }}
                            >
                              👁️ View
                            </button>
                            
                            {/* VIEW POPUP SELECTOR */}
                            {activeDropdownId === 'view' && (
                              <div style={styles.popupMenu}>
                                {['Consignor Copy', 'Consignee Copy', 'Driver Copy', 'Transport Copy'].map(copy => {
                                  const key = copy.split(' ')[0].toLowerCase();
                                  return (
                                    <label key={copy} style={styles.popupMenuItem}>
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        👁️ {copy}
                                      </span>
                                      <input 
                                        type="checkbox" 
                                        style={{ cursor: 'pointer' }}
                                        checked={selectedCopies[key]} 
                                        onChange={(e) => {
                                          setSelectedCopies(prev => ({
                                            ...prev,
                                            [key]: e.target.checked
                                          }));
                                        }}
                                      />
                                    </label>
                                  );
                                })}
                                <button 
                                  type="button" 
                                  style={styles.popupSubmitBtn}
                                  onClick={() => {
                                    const copiesToPrint = [];
                                    if (selectedCopies.consignor) copiesToPrint.push('CONSIGNOR COPY');
                                    if (selectedCopies.consignee) copiesToPrint.push('CONSIGNEE COPY');
                                    if (selectedCopies.driver) copiesToPrint.push('DRIVER COPY');
                                    if (selectedCopies.transport) copiesToPrint.push('TRANSPORT COPY');
                                    
                                    if (copiesToPrint.length === 0) {
                                      copiesToPrint.push('TRANSPORT COPY'); // default
                                    }
                                    
                                    setPrintingCopies(copiesToPrint);
                                    setPrintingBilty(b);
                                    setActiveDropdownId(null);
                                  }}
                                >
                                  👁️ Combined Copy
                                </button>
                              </div>
                            )}
                          </div>

                          <div style={{ position: 'relative' }}>
                            <button 
                              type="button" 
                              style={styles.drawerActionBtn}
                              onClick={() => {
                                setActiveDropdownId(activeDropdownId === 'download' ? null : 'download');
                              }}
                            >
                              📥 Download
                            </button>

                            {/* DOWNLOAD POPUP SELECTOR */}
                            {activeDropdownId === 'download' && (
                              <div style={styles.popupMenu}>
                                {['Consignor Copy', 'Consignee Copy', 'Driver Copy', 'Transport Copy'].map(copy => {
                                  const key = copy.split(' ')[0].toLowerCase();
                                  return (
                                    <label key={copy} style={styles.popupMenuItem}>
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        📥 {copy}
                                      </span>
                                      <input 
                                        type="checkbox" 
                                        style={{ cursor: 'pointer' }}
                                        checked={selectedCopies[key]} 
                                        onChange={(e) => {
                                          setSelectedCopies(prev => ({
                                            ...prev,
                                            [key]: e.target.checked
                                          }));
                                        }}
                                      />
                                    </label>
                                  );
                                })}
                                <button 
                                  type="button" 
                                  style={styles.popupSubmitBtn}
                                  onClick={() => {
                                    const copiesToPrint = [];
                                    if (selectedCopies.consignor) copiesToPrint.push('CONSIGNOR COPY');
                                    if (selectedCopies.consignee) copiesToPrint.push('CONSIGNEE COPY');
                                    if (selectedCopies.driver) copiesToPrint.push('DRIVER COPY');
                                    if (selectedCopies.transport) copiesToPrint.push('TRANSPORT COPY');
                                    
                                    if (copiesToPrint.length === 0) {
                                      copiesToPrint.push('TRANSPORT COPY'); // default
                                    }
                                    
                                    setPrintingCopies(copiesToPrint);
                                    setPrintingBilty(b);
                                    setActiveDropdownId(null);
                                    setTimeout(() => {
                                      window.print();
                                    }, 600);
                                  }}
                                >
                                  📥 Combined Copy
                                </button>
                              </div>
                            )}
                          </div>

                          <button 
                            type="button" 
                            style={styles.drawerActionBtn}
                            onClick={() => {
                              handleOpenEdit(b);
                              setExpandedCardId(null);
                            }}
                          >
                            ✏️ Edit
                          </button>

                          <button 
                            type="button" 
                            style={styles.drawerActionBtn}
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this Bilty?')) {
                                onDeleteBilty(b._id);
                              }
                              setExpandedCardId(null);
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                          <button 
                            type="button" 
                            style={styles.drawerCloseBtn}
                            onClick={() => setExpandedCardId(null)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredBilties.length === 0 && (
                <div style={styles.noRecords}>No Lorry Receipts (Bilties) compiled yet. Click Create Bilty to start!</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 2. Premium visual Bilty creation Form Page */}
      {showFormPage && (
        <div style={styles.container} className="print-hidden">
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('dashboard')} />
              <span style={{ cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('dashboard')}>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingBilty(null); }}>Bilty</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>{editingBilty ? 'Edit Bilty' : 'Create New Bilty'}</span>
            </div>
            <button 
              style={styles.backToListBtn} 
              onClick={() => {
                setShowFormPage(false);
                setEditingBilty(null);
              }}
            >
              Bilty List
            </button>
          </div>

          <div style={styles.formCard}>
            <h2 style={styles.modalTitle}>Bilty Form</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={styles.formGridPage}>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bilty No *</label>
                    <input
                      type="text" required
                      style={styles.formInputPage}
                      value={formData.biltyNo || ''}
                      onChange={(e) => recalculateValues('biltyNo', e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bill Generate Date *</label>
                    <input
                      type="date" required
                      style={styles.formInputPage}
                      value={formData.date || ''}
                      onChange={(e) => recalculateValues('date', e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Branch Code</label>
                    <input
                      type="text"
                      style={styles.formInputPage}
                      value={formData.branchCode || ''}
                      onChange={(e) => recalculateValues('branchCode', e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Financial Year</label>
                    <select
                      className="form-control"
                      style={{ height: '40px' }}
                      value={formData.financialYear || '2026-2027'}
                      onChange={(e) => recalculateValues('financialYear', e.target.value)}
                    >
                      <option value="2026-2027">2026-2027</option>
                      <option value="2025-2026">2025-2026</option>
                    </select>
                  </div>
                </div>

                {/* Consignor Details */}
                <h4 style={styles.subHeading}>Consignor Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Company Name</label>
                    <select
                      className="form-control"
                      style={{ height: '40px' }}
                      value={formData.consignorId || ''}
                      onChange={(e) => {
                        const cust = customers.find(x => x._id === e.target.value) || {};
                        setFormData({
                          ...formData,
                          consignorId: e.target.value,
                          consignorName: cust.name || '',
                          consignorContact: cust.phone || '',
                          consignorGstin: cust.gstin || '',
                          consignorAddress: cust.address || ''
                        });
                      }}
                    >
                      <option value="">-- Choose Consignor --</option>
                      {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Contact Number</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Contact Number"
                      value={formData.consignorContact || ''}
                      onChange={(e) => recalculateValues('consignorContact', e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>GSTIN</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="GSTIN"
                      value={formData.consignorGstin || ''}
                      onChange={(e) => recalculateValues('consignorGstin', e.target.value)}
                    />
                  </div>
                </div>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Email</label>
                    <input
                      type="email" style={styles.formInputPage} placeholder="Email"
                      value={formData.consignorEmail || ''}
                      onChange={(e) => recalculateValues('consignorEmail', e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bank Name</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Bank Name"
                      value={formData.consignorBank || ''}
                      onChange={(e) => recalculateValues('consignorBank', e.target.value)}
                    />
                  </div>
                </div>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Address</label>
                  <textarea
                    style={styles.formTextareaPage} placeholder="Address"
                    value={formData.consignorAddress || ''}
                    onChange={(e) => recalculateValues('consignorAddress', e.target.value)}
                  />
                  <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                </div>

                {/* Consignee Details */}
                <h4 style={styles.subHeading}>Consignee Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Company Name</label>
                    <select
                      className="form-control"
                      style={{ height: '40px' }}
                      value={formData.consigneeId || ''}
                      onChange={(e) => {
                        const cust = customers.find(x => x._id === e.target.value) || {};
                        setFormData({
                          ...formData,
                          consigneeId: e.target.value,
                          consigneeName: cust.name || '',
                          consigneeContact: cust.phone || '',
                          consigneeGstin: cust.gstin || '',
                          consigneeAddress: cust.address || '',
                          deliveryAddress: cust.address || ''
                        });
                      }}
                    >
                      <option value="">-- Choose Consignee --</option>
                      {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Contact number</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Contact number"
                      value={formData.consigneeContact || ''}
                      onChange={(e) => recalculateValues('consigneeContact', e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>GSTIN</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="GSTIN"
                      value={formData.consigneeGstin || ''}
                      onChange={(e) => recalculateValues('consigneeGstin', e.target.value)}
                    />
                  </div>
                </div>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Email</label>
                    <input
                      type="email" style={styles.formInputPage} placeholder="Email"
                      value={formData.consigneeEmail || ''}
                      onChange={(e) => recalculateValues('consigneeEmail', e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bank Name</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Bank Name"
                      value={formData.consigneeBank || ''}
                      onChange={(e) => recalculateValues('consigneeBank', e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                  <input
                    type="checkbox"
                    checked={formData.deliveryAddressSame}
                    onChange={(e) => setFormData({ ...formData, deliveryAddressSame: e.target.checked, deliveryAddress: e.target.checked ? formData.consigneeAddress : '' })}
                  />
                  <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Delivery Address Same as Consignee Address</label>
                </div>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Consignee Address</label>
                    <textarea
                      style={styles.formTextareaPage} placeholder="Consignee Address"
                      value={formData.consigneeAddress || ''}
                      onChange={(e) => setFormData({ ...formData, consigneeAddress: e.target.value, deliveryAddress: formData.deliveryAddressSame ? e.target.value : formData.deliveryAddress })}
                    />
                    <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Delivery Address</label>
                    <textarea
                      style={styles.formTextareaPage} placeholder="Enter Delivery Address"
                      disabled={formData.deliveryAddressSame}
                      value={formData.deliveryAddress || ''}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    />
                    <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                  </div>
                </div>

                {/* Truck Details */}
                <h4 style={styles.subHeading}>Truck Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Vehicle Number *</label>
                    <div style={styles.quadInputRow}>
                      <input type="text" maxLength="2" style={styles.quadInputBox} placeholder="XX" value={vNum1} onChange={(e) => setVNum1(e.target.value)} />
                      <input type="text" maxLength="2" style={styles.quadInputBox} placeholder="XX" value={vNum2} onChange={(e) => setVNum2(e.target.value)} />
                      <input type="text" maxLength="2" style={styles.quadInputBox} placeholder="XX" value={vNum3} onChange={(e) => setVNum3(e.target.value)} />
                      <input type="text" maxLength="4" style={styles.quadInputBox} placeholder="XXXX" value={vNum4} onChange={(e) => setVNum4(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Vehicle Type *</label>
                    <select
                      className="form-control"
                      style={{ height: '40px' }}
                      value={formData.vehicleType || 'Own'}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    >
                      <option value="Own">Own Truck</option>
                      <option value="Market">Market Truck</option>
                    </select>
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>E-way Bill Number</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="E-way Bill Number"
                      value={formData.ewayBillNo || ''}
                      onChange={(e) => setFormData({ ...formData, ewayBillNo: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>E-way Bill Expiry Date</label>
                    <input
                      type="date" style={styles.formInputPage}
                      value={formData.ewayBillExpiry || ''}
                      onChange={(e) => setFormData({ ...formData, ewayBillExpiry: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Vehicle Size</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Vehicle Size"
                      value={formData.vehicleSize || ''}
                      onChange={(e) => setFormData({ ...formData, vehicleSize: e.target.value })}
                    />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>From</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Enter From Location"
                      value={formData.fromCity || ''}
                      onChange={(e) => recalculateValues('fromCity', e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>To</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Enter To Location"
                      value={formData.toCity || ''}
                      onChange={(e) => recalculateValues('toCity', e.target.value)}
                    />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Driver Name</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Driver Name"
                      value={formData.driverName || ''}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Driver Number</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Driver Number"
                      value={formData.driverMobile || ''}
                      onChange={(e) => setFormData({ ...formData, driverMobile: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>DL Number</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="DL Number"
                      value={formData.dlNumber || ''}
                      onChange={(e) => setFormData({ ...formData, dlNumber: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Seal Number</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Seal Number"
                      value={formData.sealNumber || ''}
                      onChange={(e) => setFormData({ ...formData, sealNumber: e.target.value })}
                    />
                  </div>
                </div>

                {formData.vehicleType === 'Market' && (
                  <>
                    <div style={styles.formGridRowPage}>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Vehicle Owner / Supplier Name</label>
                        <input
                          type="text" style={styles.formInputPage} placeholder="Vehicle Owner / Supplier Name"
                          value={formData.supplierName || ''}
                          onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Vehicle Owner Mobile</label>
                        <input
                          type="text" style={styles.formInputPage} placeholder="Vehicle Owner Mobile"
                          value={formData.supplierMobile || ''}
                          onChange={(e) => setFormData({ ...formData, supplierMobile: e.target.value })}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Vehicle Owner PAN No.</label>
                        <input
                          type="text" style={styles.formInputPage} placeholder="Vehicle Owner PAN Number"
                          value={formData.supplierPan || ''}
                          onChange={(e) => setFormData({ ...formData, supplierPan: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={styles.formGroupPage}>
                      <label style={styles.formLabelPage}>Vehicle Owner Address</label>
                      <textarea
                        style={styles.formTextareaPage} placeholder="Vehicle Owner Address"
                        value={formData.supplierAddress || ''}
                        onChange={(e) => setFormData({ ...formData, supplierAddress: e.target.value })}
                      />
                      <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                    </div>
                  </>
                )}

                {/* Demurrage Details */}
                <h4 style={styles.subHeading}>Demurrage Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Demurrage Charge</label>
                    <input
                      type="number" style={styles.formInputPage}
                      value={formData.demurrageCharge || 0}
                      onChange={(e) => setFormData({ ...formData, demurrageCharge: Number(e.target.value) })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Demurrage Charge Per Hour/Day</label>
                    <select
                      className="form-control" style={{ height: '40px' }}
                      value={formData.demurrageType || 'Per Hour'}
                      onChange={(e) => setFormData({ ...formData, demurrageType: e.target.value })}
                    >
                      <option value="Per Hour">Per Hour</option>
                      <option value="Per Day">Per Day</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Demurrage charge applicable after</label>
                    <select
                      className="form-control" style={{ height: '40px' }}
                      value={formData.demurrageGrace || '24 Hours'}
                      onChange={(e) => setFormData({ ...formData, demurrageGrace: e.target.value })}
                    >
                      <option value="24 Hours">24 Hours</option>
                      <option value="48 Hours">48 Hours</option>
                      <option value="72 Hours">72 Hours</option>
                    </select>
                  </div>
                </div>

                {/* Remarks & Checkboxes */}
                <h4 style={styles.subHeading}>Other Remarks</h4>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Remarks</label>
                  <textarea
                    style={styles.formTextareaPage} placeholder="Other Remarks"
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  />
                  <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                </div>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', margin: '12px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={formData.showDalaHamali} onChange={(e) => setFormData({ ...formData, showDalaHamali: e.target.checked })} /> Show Dala Hamali Remark PDF
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={formData.hideWeight} onChange={(e) => setFormData({ ...formData, hideWeight: e.target.checked })} /> Hide Weight from PDF
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={formData.hideRate} onChange={(e) => setFormData({ ...formData, hideRate: e.target.checked })} /> Hide Rate from PDF
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={formData.hideSupplier} onChange={(e) => setFormData({ ...formData, hideSupplier: e.target.checked })} /> Hide Supplier/Owner Details from PDF
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={formData.hideDatetime} onChange={(e) => setFormData({ ...formData, hideDatetime: e.target.checked })} /> Hide Generated Datetime from PDF
                  </label>
                </div>

                {/* Insurance Details */}
                <h4 style={styles.subHeading}>Insurance Details</h4>
                <div style={{ display: 'flex', gap: '24px', margin: '8px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="insurance" checked={formData.insuranceType === 'Not Insured'} onChange={() => setFormData({ ...formData, insuranceType: 'Not Insured' })} /> Not Insured
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="insurance" checked={formData.insuranceType === 'Insured'} onChange={() => setFormData({ ...formData, insuranceType: 'Insured' })} /> Insured
                  </label>
                </div>

                {/* Material Details */}
                <h4 style={styles.subHeading}>Material Details</h4>
                <div style={{ display: 'flex', gap: '24px', margin: '8px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="material" checked={formData.materialType === 'Single Item'} onChange={() => setFormData({ ...formData, materialType: 'Single Item' })} /> Single Item
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="material" checked={formData.materialType === 'Multiple Items'} onChange={() => setFormData({ ...formData, materialType: 'Multiple Items' })} /> Multiple Items
                  </label>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Material name</label>
                    <input type="text" style={styles.formInputPage} placeholder="Material Name" value={formData.materialName} onChange={(e) => setFormData({ ...formData, materialName: e.target.value })} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Packing Type</label>
                    <input type="text" style={styles.formInputPage} placeholder="Packing Type" value={formData.packingType} onChange={(e) => setFormData({ ...formData, packingType: e.target.value })} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Number of Article</label>
                    <input type="number" style={styles.formInputPage} placeholder="Number of Article" value={formData.noOfPackages} onChange={(e) => setFormData({ ...formData, noOfPackages: Number(e.target.value) })} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bill/Invoice Number</label>
                    <input type="text" style={styles.formInputPage} placeholder="Bill / Invoice Number" value={formData.invoiceNumber} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>HSN Code</label>
                    <input type="text" style={styles.formInputPage} placeholder="HNS Code" value={formData.hsnCode} onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Value of Goods</label>
                    <input type="text" style={styles.formInputPage} placeholder="Ex- 50000" value={formData.valueOfGoods} onChange={(e) => setFormData({ ...formData, valueOfGoods: e.target.value })} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bill/Invoice Date</label>
                    <input type="date" style={styles.formInputPage} value={formData.invoiceDate} onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Gate Pass Number</label>
                    <input type="text" style={styles.formInputPage} placeholder="Gate Pass Number" value={formData.gatePassNo} onChange={(e) => setFormData({ ...formData, gatePassNo: e.target.value })} />
                  </div>
                </div>

                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Load/Material Details</label>
                  <textarea style={styles.formTextareaPage} placeholder="Description of Goods" value={formData.goodsDescription} onChange={(e) => setFormData({ ...formData, goodsDescription: e.target.value })} />
                  <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                  <input type="checkbox" checked={formData.descSameAsInvoice} onChange={(e) => setFormData({ ...formData, descSameAsInvoice: e.target.checked, goodsDescription: e.target.checked ? `Consignment Ref Invoice No: ${formData.invoiceNumber}` : formData.goodsDescription })} />
                  <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>DESCRIPTION OF GOODS @ As Same As Invoice Number</label>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Actual Weight</label>
                    <input type="number" style={styles.formInputPage} placeholder="Actual Weight" value={formData.actualWeight} onChange={(e) => recalculateValues('actualWeight', Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Guarantee Weight</label>
                    <input type="text" style={styles.formInputPage} placeholder="Enter Guaranty Weight" value={formData.guaranteeWeight} onChange={(e) => setFormData({ ...formData, guaranteeWeight: e.target.value })} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Unit</label>
                    <select className="form-control" style={{ height: '40px' }} value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                      <option value="Tons">Tons</option>
                      <option value="Kgs">Kgs</option>
                      <option value="Boxes">Boxes</option>
                    </select>
                  </div>
                </div>

                {/* Freight Details */}
                <h4 style={styles.subHeading}>Freight Details</h4>
                <div style={{ display: 'flex', gap: '24px', margin: '8px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="paidBy" checked={formData.paidBy === 'TBB'} onChange={() => setFormData({ ...formData, paidBy: 'TBB' })} /> To be billed
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="paidBy" checked={formData.paidBy === 'Consignee'} onChange={() => setFormData({ ...formData, paidBy: 'Consignee' })} /> To pay
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="paidBy" checked={formData.paidBy === 'Consignor'} onChange={() => setFormData({ ...formData, paidBy: 'Consignor' })} /> Paid
                  </label>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Rate</label>
                    <input type="number" style={styles.formInputPage} placeholder="Rate" value={formData.rate} onChange={(e) => recalculateValues('rate', Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 0.5, marginTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <input type="checkbox" checked={formData.fixedRate} onChange={(e) => recalculateValues('fixedRate', e.target.checked)} /> FIXED
                    </label>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Freight Amount</label>
                    <input type="text" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} placeholder="Freight Amount" value={formData.fixedRate ? formData.rate : (formData.rate * formData.actualWeight)} />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Halting Charge</label>
                    <input type="number" style={styles.formInputPage} placeholder="Halting Charge" value={formData.haltingCharge} onChange={(e) => recalculateValues('haltingCharge', Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bilty Charges</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select className="form-control" style={{ height: '40px', flex: 1 }} value={formData.biltyChargeType1} onChange={(e) => setFormData({ ...formData, biltyChargeType1: e.target.value })}>
                        <option value="Bilty Charges">Bilty Charges</option>
                        <option value="Load/Unload Charge">Load/Unload</option>
                      </select>
                      <input type="number" style={{ ...styles.formInputPage, flex: 1 }} placeholder="Charge" value={formData.biltyChargeVal1} onChange={(e) => recalculateValues('biltyChargeVal1', Number(e.target.value))} />
                    </div>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bilty Charges</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select className="form-control" style={{ height: '40px', flex: 1 }} value={formData.biltyChargeType2} onChange={(e) => setFormData({ ...formData, biltyChargeType2: e.target.value })}>
                        <option value="Service Charge">Service Charge</option>
                        <option value="Door To Door Charge">Door To Door</option>
                      </select>
                      <input type="number" style={{ ...styles.formInputPage, flex: 1 }} placeholder="Charge" value={formData.biltyChargeVal2} onChange={(e) => recalculateValues('biltyChargeVal2', Number(e.target.value))} />
                    </div>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Other Charges</label>
                    <input type="number" style={styles.formInputPage} placeholder="Other Charge" value={formData.otherCharges} onChange={(e) => recalculateValues('otherCharges', Number(e.target.value))} />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Total Amount</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} placeholder="Total Amount" value={formData.totalFreight} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Advance(Rs)</label>
                    <input type="number" style={styles.formInputPage} placeholder="Advance Amount" value={formData.advancePaid} onChange={(e) => recalculateValues('advancePaid', Number(e.target.value))} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Balance(Rs)</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} placeholder="Balance Amount" value={formData.balanceAmount} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>GST Paid By</label>
                    <select className="form-control" style={{ height: '40px' }} value={formData.gstPaidBy} onChange={(e) => setFormData({ ...formData, gstPaidBy: e.target.value })}>
                      <option value="Select GST Paid By">Select GST Paid By</option>
                      <option value="Consignor">Consignor</option>
                      <option value="Consignee">Consignee</option>
                      <option value="Transporter">Transporter</option>
                    </select>
                  </div>
                </div>

              </div>

              <div style={styles.greenButtonContainer}>
                <button type="submit" style={styles.greenActionBtn}>
                  {editingBilty ? 'Update & Print / Download Bilty' : 'Generate & Print / Download Bilty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Print-Ready Lorry Receipt Layout */}
      {printingBilty && (
        <div style={styles.printOverlay} className="print-overlay-container">
          <div className="print-controls" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 3000, display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" style={{ padding: '8px 16px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => window.print()}>Print / Save PDF</button>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { setPrintingBilty(null); setPrintingCopies(['TRANSPORT COPY']); }}>Close Preview</button>
          </div>

          <style>{`
            .bilty-print-container {
              font-family: 'Inter', -apple-system, sans-serif;
              color: #0f172a;
              line-height: 1.25;
              font-size: 10px;
              width: 100%;
              max-width: 1050px;
              margin: 0 auto 30px auto;
              padding: 24px;
              background: #ffffff;
              box-sizing: border-box;
              border: 1px solid #cbd5e1;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              border-radius: 8px;
              page-break-after: always;
            }
            .bilty-print-container:last-child {
              page-break-after: avoid;
            }
            /* Hide terms & conditions if withoutTerms is checked */
            ${withoutTerms ? `
              .terms-conditions-block, .terms-block, .bilty-terms, .terms-section, div[style*="RECEIVING USE ONLY"] + div + div {
                display: none !important;
              }
            ` : ''}
            
            .grid-5-cols {
              display: grid;
              grid-template-columns: 1.2fr 1.2fr 1fr 1.6fr 1fr;
              gap: 6px;
              margin-bottom: 8px;
            }
            .grid-4-cols {
              display: grid;
              grid-template-columns: 1.5fr 1.5fr 1.2fr 1.2fr;
              gap: 6px;
              margin-bottom: 8px;
            }
            .grid-3-cols {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 8px;
              margin-bottom: 12px;
            }
            .grid-2-cols {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-bottom: 12px;
            }
            .bilty-cell-box {
              border: 1px solid #475569;
              padding: 6px;
              border-radius: 3px;
              background: #ffffff;
              min-height: 70px;
            }
            .bilty-cell-title {
              font-weight: 800;
              font-size: 8px;
              text-transform: uppercase;
              color: #0f172a;
              border-bottom: 1px dashed #475569;
              padding-bottom: 3px;
              margin-bottom: 4px;
              display: flex;
              justify-content: space-between;
            }
            .bilty-cell-content p {
              margin: 0 0 2px 0;
              font-size: 8.5px;
            }
            .bilty-main-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 4px;
              margin-bottom: 8px;
            }
            .bilty-main-table th, .bilty-main-table td {
              border: 1px solid #475569;
              padding: 4px 6px;
              text-align: left;
              vertical-align: top;
              font-size: 8.5px;
            }
            .bilty-main-table th {
              background-color: #f8fafc;
              font-weight: 800;
              text-transform: uppercase;
              font-size: 8px;
            }
            .text-danger {
              color: #dc2626 !important;
            }
            .font-bold {
              font-weight: 700;
            }
            
            @media print {
              body * {
                visibility: hidden;
              }
              .print-container-visible, .print-container-visible * {
                visibility: visible;
              }
              .print-container-visible {
                position: relative !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 0 50px 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: #ffffff !important;
                page-break-after: always !important;
              }
              .print-container-visible:last-child {
                page-break-after: avoid !important;
                margin-bottom: 0 !important;
              }
              .print-controls {
                display: none !important;
              }
            }
          `}</style>
          
          {printingCopies.map((copyLabel, idx) => {
            // Replace hardcoded COPY labels dynamically
            let compiledHtml = '';
            if (activeTemplate) {
              compiledHtml = compileBiltyTemplate(activeTemplate.html_structure, printingBilty, user, logoImg, stampImg);
              compiledHtml = compiledHtml
                .replace(/TRANSPORT COPY/gi, copyLabel)
                .replace(/CONSIGNOR COPY/gi, copyLabel)
                .replace(/CONSIGNEE COPY/gi, copyLabel)
                .replace(/DRIVER COPY/gi, copyLabel)
                .replace(/TRIP COPY/gi, copyLabel)
                .replace(/CLASSIC COPY/gi, copyLabel);
            }

            return (
              <div key={idx} className="print-container-visible bilty-print-container">
                {Number(selectedBiltyFormat) === 1 || Number(selectedBiltyFormat) === 3 ? (
                  <BiltyTemplate1 
                    data={printingBilty} 
                    company={{ 
                      companyName: user?.companyName, 
                      address: user?.address, 
                      mobile: user?.mobile, 
                      pan: user?.companyPan || 'CTSPG1070M', 
                      gstin: user?.gstin || '24CTSPG1070M1ZF', 
                      logo_img: logoImg, 
                      stamp_img: stampImg, 
                      city: user?.city 
                    }} 
                    copyLabel={copyLabel} 
                  />
                ) : Number(selectedBiltyFormat) === 2 || Number(selectedBiltyFormat) === 4 ? (
                  <BiltyTemplate2 
                    data={printingBilty} 
                    company={{ 
                      companyName: user?.companyName, 
                      address: user?.address, 
                      mobile: user?.mobile, 
                      pan: user?.companyPan || 'CTSPG1070M', 
                      gstin: user?.gstin || '24CTSPG1070M1ZF', 
                      logo_img: logoImg, 
                      stamp_img: stampImg 
                    }} 
                    copyLabel={copyLabel} 
                  />
                ) : Number(selectedBiltyFormat) === 5 ? (
                  <ConsignmentTemplate 
                    data={printingBilty} 
                    company={{ 
                      companyName: user?.companyName, 
                      address: user?.address, 
                      mobile: user?.mobile, 
                      pan: user?.companyPan || 'CTSPG1070M', 
                      gstin: user?.gstin || '24CTSPG1070M1ZF', 
                      logo_img: logoImg, 
                      stamp_img: stampImg 
                    }} 
                    copyLabel={copyLabel} 
                  />
                ) : activeTemplate ? (
                  <>
                    <style dangerouslySetInnerHTML={{ __html: activeTemplate.css_styles }} />
                    <div dangerouslySetInnerHTML={{ __html: compiledHtml }} />
                  </>
                ) : (
                  <>
                    {/* RENDER FALLBACK REACT FORMAT 4 */}
                    {Number(selectedBiltyFormat) === 4 && (
                      <div style={{ position: 'relative' }}>
                        {/* Header block */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ef4444', paddingBottom: '10px', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {logoImg ? (
                              <img src={logoImg} alt="Logo" style={{ height: '48px', objectFit: 'contain' }} />
                            ) : (
                              <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '20px' }}>R</div>
                            )}
                            <div>
                              <span style={{ fontSize: '8px', color: '#64748b', display: 'block' }}>Subject To RAIGARH jurisdiction</span>
                              <h1 style={{ fontSize: '15px', fontWeight: '900', color: '#ef4444', margin: '2px 0 0 0' }}>ROADWE VENTURES PRIVATE LIMITED AND TECH LOGISTICS PRIV</h1>
                              <span style={{ fontSize: '8px', fontWeight: '700', color: '#1e293b', display: 'block' }}>FLEET OWNER/TRANSPORT CONTRACTOR AND BROKER</span>
                              <span style={{ fontSize: '7.5px', color: '#475569', display: 'block' }}>BLOCK NO C FLAT NO 204 BIMAL ENCLAVE NEAR BAGGA MECHINARY OPPOSITE YATAYAT THANA RAIPUR CHHATISGARH 493221 , RAIGARH, CHHATTISGARH</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', minWidth: '150px' }}>
                            <span style={{ fontSize: '8.5px', fontWeight: '800', display: 'block' }}>Mob: 8269693922</span>
                            <div style={{ display: 'inline-block', margin: '4px 0', padding: '3px 8px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '4px', color: '#ef4444', fontSize: '9px', fontWeight: '800' }}>
                              {copyLabel}
                            </div>
                            <span style={{ fontSize: '8px', display: 'block' }}><b>PAN NO:</b> BFYPM9837H</span>
                          </div>
                        </div>

                        {/* Route & metadata grids */}
                        <div className="grid-5-cols">
                          <div className="bilty-cell-box">
                            <div className="bilty-cell-title"><span>DEMURRAGE (HALTING)</span></div>
                            <div className="bilty-cell-content">
                              <p>Demurrage Chargeable after arrival grace 24 hours.</p>
                              <p>Rate: <b>₹{printingBilty.demurrageCharge || 1000} / Day</b></p>
                            </div>
                          </div>
                          <div className="bilty-cell-box">
                            <div className="bilty-cell-title"><span>INSURANCE</span></div>
                            <div className="bilty-cell-content">
                              <p>THE CUSTOMER HAS STATED THAT STATUS: <b>{printingBilty.insuranceType || 'NOT INSURED'}</b></p>
                              <p>RISK: <b>AT OWNER RISK</b></p>
                            </div>
                          </div>
                          <div className="bilty-cell-box">
                            <div className="bilty-cell-title"><span>BILTY & VEHICLE INFORMATION</span></div>
                            <div className="bilty-cell-content">
                              <p><b>BILTY/LR NO:</b> <span className="text-danger font-bold">{printingBilty.biltyNo}</span></p>
                              <p><b>DATE:</b> {printingBilty.date}</p>
                              <p><b>VEHICLE SIZE:</b> {printingBilty.vehicleSize || '10 Tons'}</p>
                            </div>
                          </div>
                          <div className="bilty-cell-box">
                            <div className="bilty-cell-title"><span>ROUTE</span></div>
                            <div className="bilty-cell-content">
                              <p><b>FROM LOCATION:</b> {printingBilty.fromCity || 'Mumbai'}</p>
                              <p><b>TO LOCATION:</b> {printingBilty.toCity || 'Ahmedabad'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Share Bilty Overlay Panel */}
      {sharingBilty && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '400px', padding: '24px' }}>
            <h3 style={styles.modalTitle}>Share Lorry Receipt</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Send Bilty No. <b>{sharingBilty.biltyNo}</b> instantly to driver or party!
            </p>
            
            <div style={styles.shareList}>
              <a 
                href={`https://wa.me/918269203922?text=Hi, here is your Bilty No. ${sharingBilty.biltyNo} (${sharingBilty.fromCity} to ${sharingBilty.toCity}) for Vehicle ${sharingBilty.vehicleNumber}. Total: ₹${sharingBilty.totalFreight}. Bal: ₹${sharingBilty.balanceAmount}.`}
                target="_blank" rel="noreferrer" style={styles.shareOption}
              >
                <div style={{ ...styles.shareIconCircle, backgroundColor: '#25d366' }}>💬</div>
                <div>
                  <span style={styles.shareOptionTitle}>Share on WhatsApp</span>
                  <span style={styles.shareOptionSub}>Send receipt message to party</span>
                </div>
              </a>

              <a 
                href={`mailto:logistics@transcore.com?subject=Bilty Receipt No. ${sharingBilty.biltyNo}&body=Hi, please find attached Bilty No. ${sharingBilty.biltyNo} for Vehicle ${sharingBilty.vehicleNumber}.`}
                style={styles.shareOption}
              >
                <div style={{ ...styles.shareIconCircle, backgroundColor: '#0066cc' }}>✉️</div>
                <div>
                  <span style={styles.shareOptionTitle}>Share via Email</span>
                  <span style={styles.shareOptionSub}>Send PDF attachment copy</span>
                </div>
              </a>

              <div 
                style={styles.shareOption} 
                onClick={() => {
                  navigator.clipboard.writeText(`http://roadwe.in/transporter/delivery-receiving/${sharingBilty.biltyNo}`);
                  alert('Consignee signature receiving link copied to clipboard!');
                  setSharingBilty(null);
                }}
              >
                <div style={{ ...styles.shareIconCircle, backgroundColor: '#10b981' }}>✍️</div>
                <div>
                  <span style={styles.shareOptionTitle}>Receiving Signature Link</span>
                  <span style={styles.shareOptionSub}>Get electronic delivery confirmation</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setSharingBilty(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Filter Options Modal (Screenshot 1) */}
      {filterModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '90%', maxWidth: '700px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontWeight: '800', color: '#0f172a', fontSize: '1.1rem' }}>Filter Options</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setFilterModalOpen(false)} />
            </div>

            <div className="form-grid" style={{ fontSize: '0.85rem' }}>
              <div className="form-group">
                <label style={styles.formLabelPage}>Party Name</label>
                <select className="form-control" style={{ height: '38px' }} value={filterParty} onChange={(e) => setFilterParty(e.target.value)}>
                  <option>Select Party Name</option>
                  {Array.from(new Set(bilties.map(b => b.consignorName))).filter(Boolean).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label style={styles.formLabelPage}>Vehicle Number</label>
                <select className="form-control" style={{ height: '38px' }} value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)}>
                  <option>Select Vehicle No.</option>
                  {Array.from(new Set(bilties.map(b => b.vehicleNumber))).filter(Boolean).map(vNum => (
                    <option key={vNum} value={vNum}>{vNum}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label style={styles.formLabelPage}>Bilty No.</label>
                <select className="form-control" style={{ height: '38px' }} value={filterBiltyNo} onChange={(e) => setFilterBiltyNo(e.target.value)}>
                  <option>Select Bilty No.</option>
                  {bilties.map(b => (
                    <option key={b._id} value={b.biltyNo}>{b.biltyNo}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label style={styles.formLabelPage}>From Location</label>
                <select className="form-control" style={{ height: '38px' }} value={filterFromLoc} onChange={(e) => setFilterFromLoc(e.target.value)}>
                  <option>Select From Location</option>
                  {Array.from(new Set(bilties.map(b => b.fromCity))).filter(Boolean).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label style={styles.formLabelPage}>To Location</label>
                <select className="form-control" style={{ height: '38px' }} value={filterToLoc} onChange={(e) => setFilterToLoc(e.target.value)}>
                  <option>Select To Location</option>
                  {Array.from(new Set(bilties.map(b => b.toCity))).filter(Boolean).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label style={styles.formLabelPage}>From Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label style={styles.formLabelPage}>To Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} />
              </div>
              
              <div className="form-group">
                <label style={styles.formLabelPage}>Freight Type</label>
                <select className="form-control" style={{ height: '38px' }} value={filterFreightType} onChange={(e) => setFilterFreightType(e.target.value)}>
                  <option>Select Freight Type</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Per Ton">Per Ton</option>
                </select>
              </div>
              <div className="form-group">
                <label style={styles.formLabelPage}>Bill Status</label>
                <select className="form-control" style={{ height: '38px' }} value={filterBillStatus} onChange={(e) => setFilterBillStatus(e.target.value)}>
                  <option>Select Bill Status</option>
                  <option value="Billed">Billed</option>
                  <option value="Unbilled">Unbilled</option>
                </select>
              </div>
              <div className="form-group">
                <label style={styles.formLabelPage}>Paid Status</label>
                <select className="form-control" style={{ height: '38px' }} value={filterPaidStatus} onChange={(e) => setFilterPaidStatus(e.target.value)}>
                  <option>Select Paid Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button className="btn btn-secondary" style={{ padding: '8px 24px', marginRight: 'auto' }} onClick={() => {
                setFilterParty('Select Party Name');
                setFilterVehicle('Select Vehicle No.');
                setFilterBiltyNo('Select Bilty No.');
                setFilterFromLoc('Select From Location');
                setFilterToLoc('Select To Location');
                setFilterFromDate('');
                setFilterToDate('');
                setFilterFreightType('Select Freight Type');
                setFilterBillStatus('Select Bill Status');
                setFilterPaidStatus('Select Paid Status');
              }}>Reset</button>
              <button className="btn btn-primary" style={{ backgroundColor: '#00b050', border: 'none', padding: '8px 24px', fontWeight: '700' }} onClick={() => setFilterModalOpen(false)}>Search</button>
              <button className="btn btn-secondary" style={{ padding: '8px 24px' }} onClick={() => setFilterModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {/* ADD FREIGHT DETAILS / EXPENSE MODAL */}
      {showExpenseModal && expenseBilty && (
        <div style={styles.modalOverlayOriginal}>
          <div style={styles.modalContentOriginal}>
            <div style={styles.modalHeaderOriginal}>
              <h3 style={styles.modalTitleOriginal}>Add Freight Details ({expenseBilty.biltyNo} / {expenseBilty.vehicleType === 'Market' ? 'MARKET VEHICLE' : 'OWN VEHICLE'})</h3>
              <button type="button" style={styles.modalCloseIconBtn} onClick={() => { setShowExpenseModal(false); setExpenseBilty(null); }}>&times;</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateBilty(expenseBilty._id, {
                ...expenseBilty,
                ...expenseFormData
              });
              setShowExpenseModal(false);
              setExpenseBilty(null);
              alert('🚚 Freight and expenses updated successfully!');
            }}>
              <div style={styles.modalFormGrid}>
                {/* Row 1, Column 1: Actual Weight */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Actual Weight</label>
                  <input 
                    type="number" 
                    style={styles.modalFormInput} 
                    value={expenseFormData.actualWeight} 
                    onChange={(e) => handleExpenseFieldChange('actualWeight', Number(e.target.value))} 
                  />
                </div>

                {/* Row 1, Column 2: Guarantee Weight */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Guarantee Weight</label>
                  <input 
                    type="number" 
                    style={styles.modalFormInput} 
                    value={expenseFormData.chargedWeight} 
                    onChange={(e) => handleExpenseFieldChange('chargedWeight', Number(e.target.value))} 
                  />
                </div>

                {/* Row 1, Column 3: Rate */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Rate</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="number" 
                      placeholder="Rate"
                      style={{ ...styles.modalFormInput, flex: 1 }} 
                      value={expenseFormData.rate || ''} 
                      onChange={(e) => handleExpenseFieldChange('rate', Number(e.target.value))} 
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: '#475569', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                      <input 
                        type="checkbox" 
                        checked={expenseFormData.fixedRate} 
                        onChange={(e) => handleExpenseFieldChange('fixedRate', e.target.checked)} 
                      />
                      FIXED
                    </label>
                  </div>
                </div>

                {/* Row 1, Column 4: Freight Amount */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Freight Amount</label>
                  <input 
                    type="number" 
                    disabled 
                    style={{ ...styles.modalFormInput, backgroundColor: '#f1f5f9', cursor: 'not-allowed', fontWeight: '600' }} 
                    value={expenseFormData.fixedRate ? (expenseFormData.rate || 0) : ((expenseFormData.rate || 0) * (expenseFormData.chargedWeight || expenseFormData.actualWeight || 0))} 
                  />
                </div>

                {/* Row 1, Column 5: Halting Charge */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Halting Charge</label>
                  <input 
                    type="number" 
                    style={styles.modalFormInput} 
                    value={expenseFormData.haltingCharge} 
                    onChange={(e) => handleExpenseFieldChange('haltingCharge', Number(e.target.value))} 
                  />
                </div>

                {/* Row 2, Column 1: Bilty Charges (1) */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Bilty Charges</label>
                  <input 
                    type="number" 
                    style={styles.modalFormInput} 
                    value={expenseFormData.biltyChargeVal1} 
                    onChange={(e) => handleExpenseFieldChange('biltyChargeVal1', Number(e.target.value))} 
                  />
                </div>

                {/* Row 2, Column 2: Bilty Charges (2) */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Bilty Charges</label>
                  <input 
                    type="number" 
                    style={styles.modalFormInput} 
                    value={expenseFormData.biltyChargeVal2} 
                    onChange={(e) => handleExpenseFieldChange('biltyChargeVal2', Number(e.target.value))} 
                  />
                </div>

                {/* Row 2, Column 3: Other Charges */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Other Charges</label>
                  <input 
                    type="number" 
                    placeholder="Other Charge"
                    style={styles.modalFormInput} 
                    value={expenseFormData.otherCharges || ''} 
                    onChange={(e) => handleExpenseFieldChange('otherCharges', Number(e.target.value))} 
                  />
                </div>

                {/* Row 2, Column 4: Total Amount */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Total Amount</label>
                  <input 
                    type="number" 
                    disabled 
                    placeholder="Total Amount"
                    style={{ ...styles.modalFormInput, backgroundColor: '#f1f5f9', cursor: 'not-allowed', fontWeight: '600' }} 
                    value={expenseFormData.totalFreight} 
                  />
                </div>

                {/* Row 2, Column 5: Truck Hire Rate */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Truck Hire Rate</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="number" 
                      style={{ ...styles.modalFormInput, flex: 1 }} 
                      value={expenseFormData.truckHireRate} 
                      onChange={(e) => handleExpenseFieldChange('truckHireRate', Number(e.target.value))} 
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: '#475569', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                      <input 
                        type="checkbox" 
                        checked={expenseFormData.truckHireRateFixed} 
                        onChange={(e) => handleExpenseFieldChange('truckHireRateFixed', e.target.checked)} 
                      />
                      Truck Hire Rate FIXED
                    </label>
                  </div>
                </div>

                {/* Row 3, Column 1: Truck Hire Cost */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Truck Hire Cost</label>
                  <input 
                    type="number" 
                    disabled 
                    style={{ ...styles.modalFormInput, backgroundColor: '#f1f5f9', cursor: 'not-allowed', fontWeight: '600' }} 
                    value={expenseFormData.truckHireCost} 
                  />
                </div>

                {/* Row 3, Column 2: Commission Amount */}
                <div style={styles.modalFormGroup}>
                  <label style={styles.modalFormLabel}>Commission Amount</label>
                  <input 
                    type="number" 
                    style={styles.modalFormInput} 
                    value={expenseFormData.commissionAmount} 
                    onChange={(e) => handleExpenseFieldChange('commissionAmount', Number(e.target.value))} 
                  />
                </div>

                {/* Row 3, Columns 3, 4, 5: empty space spacer */}
                <div style={{ gridColumn: 'span 3' }}></div>
              </div>

              <div style={styles.modalFooterOriginal}>
                <button type="submit" style={styles.modalSubmitBtnOriginal}>Submit</button>
                <button type="button" style={styles.modalCloseBtnOriginal} onClick={() => { setShowExpenseModal(false); setExpenseBilty(null); }}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE POD STATUS MODAL */}
      {showPodModal && podBilty && (
        <div style={styles.modalOverlayOriginal}>
          <div style={{ ...styles.modalContentOriginal, maxWidth: '600px' }}>
            <div style={styles.modalHeaderOriginal}>
              <h3 style={styles.modalTitleOriginal}>Update POD Status</h3>
              <button type="button" style={styles.modalCloseIconBtn} onClick={() => { setShowPodModal(false); setPodBilty(null); }}>&times;</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateBilty(podBilty._id, {
                ...podBilty,
                deliveryStatus: 'Delivered',
                paidStatus: 'Paid',
                receivingDate: podFormData.receivingDate,
                podImage: podFormData.podImage,
                podImageBack: podFormData.podImageBack,
                remarks: podFormData.remark
              });
              setShowPodModal(false);
              setPodBilty(null);
              alert('📝 POD status and documents updated successfully! Card marked as Delivered and Paid.');
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px', padding: '24px', alignItems: 'center' }}>
                {/* Row 1: Receiving Date */}
                <label style={{ ...styles.modalFormLabel, textAlign: 'left', margin: 0 }}>Receiving Date : <span style={{ color: '#ff3b30' }}>*</span></label>
                <input 
                  type="date" 
                  required 
                  style={styles.modalFormInput}
                  value={podFormData.receivingDate}
                  onChange={(e) => setPodFormData({ ...podFormData, receivingDate: e.target.value })}
                />

                {/* Row 2: POD Image */}
                <label style={{ ...styles.modalFormLabel, textAlign: 'left', margin: 0 }}>POD Image :</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    style={{ ...styles.modalFormInput, flex: 1 }}
                    onChange={(e) => handleFileChange(e, 'podImage')}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '150px' }}>
                    {podFormData.podImage ? (
                      <img src={podFormData.podImage} alt="pod image" style={{ width: '40px', height: '24px', objectFit: 'cover', borderRadius: '2px', border: '1px solid #cbd5e1' }} />
                    ) : (
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>🖼️ pod image</span>
                    )}
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {podFormData.podImage ? 'Uploaded' : 'No file chosen'}
                    </span>
                  </div>
                </div>

                {/* Row 3: POD Image Back */}
                <label style={{ ...styles.modalFormLabel, textAlign: 'left', margin: 0 }}>POD Image Back:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    style={{ ...styles.modalFormInput, flex: 1 }}
                    onChange={(e) => handleFileChange(e, 'podImageBack')}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '150px' }}>
                    {podFormData.podImageBack ? (
                      <img src={podFormData.podImageBack} alt="pod image Back" style={{ width: '40px', height: '24px', objectFit: 'cover', borderRadius: '2px', border: '1px solid #cbd5e1' }} />
                    ) : (
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>🖼️ pod image Back</span>
                    )}
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {podFormData.podImageBack ? 'Uploaded' : 'No file chosen'}
                    </span>
                  </div>
                </div>

                {/* Row 4: Remark */}
                <label style={{ ...styles.modalFormLabel, textAlign: 'left', margin: 0, alignSelf: 'start', marginTop: '6px' }}>Remark :</label>
                <textarea 
                  placeholder="write remark here.." 
                  style={styles.modalFormTextarea}
                  value={podFormData.remark}
                  onChange={(e) => setPodFormData({ ...podFormData, remark: e.target.value })}
                />
              </div>

              <div style={styles.modalFooterOriginal}>
                <button type="submit" style={styles.modalSubmitBtnOriginal}>Submit</button>
                <button type="button" style={styles.modalCloseBtnOriginal} onClick={() => { setShowPodModal(false); setPodBilty(null); }}>Close</button>
              </div>
            </form>
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
  addBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s'
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
  excelBtn: {
    backgroundColor: '#bf2c1d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  printBtn: {
    backgroundColor: '#1976d2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  filterBtn: {
    backgroundColor: '#1976d2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  createBtn: {
    backgroundColor: '#1976d2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer'
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

  // Two-column Card Grid styles
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  biltyCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
    display: 'flex',
    flexDirection: 'column'
  },
  cardTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px'
  },
  cardBiltyNo: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#64748b'
  },
  cardDate: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '600'
  },
  cardBody: {
    padding: '16px',
    flex: 1
  },
  bodyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px'
  },
  cardVehicleNo: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#f97316', // Orange-red bold vehicle no
    margin: '0 0 6px 0'
  },
  cardTbbBlock: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '0.75rem',
    color: '#1e40af',
    display: 'inline-block'
  },
  miniExpenseBtn: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    color: '#334155',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '0.7rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  partiesCol: {
    fontSize: '0.75rem',
    lineHeight: '1.5',
    color: '#334155',
    textAlign: 'right'
  },
  createdByTag: {
    fontSize: '0.65rem',
    color: '#94a3b8',
    display: 'block',
    marginTop: '6px'
  },
  cardFooterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#fafafa'
  },
  podUpdateBtn: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    borderRadius: '4px',
    padding: '4px 10px',
    fontSize: '0.7rem',
    fontWeight: '700',
    cursor: 'pointer'
  },

  // Action column triggers
  actions: {
    display: 'flex',
    gap: '4px'
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
  actionShareBtn: {
    backgroundColor: '#faf5ff',
    color: '#8b5cf6',
    border: '1px solid #f3e8ff',
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
  noRecords: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '40px 0',
    fontSize: '0.875rem'
  },

  // Form Page Styles
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
    margin: '0 auto',
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

  // Print Overlays styles
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
  },

  // Share panels
  shareList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  shareOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  shareIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  shareOptionTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    display: 'block'
  },
  shareOptionSub: {
    fontSize: '0.75rem',
    color: '#64748b'
  },
  
  // REDESIGNED EXECUTIVE DASHBOARD STYLING TOKENS
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
    marginTop: '10px'
  },
  statsCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff'
  },
  statsCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statsCardLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statsCardValue: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#1e293b'
  },
  statsCardIconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filterChipsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    overflowX: 'auto',
    paddingBottom: '4px'
  },
  inactiveChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    color: '#475569',
    padding: '6px 14px',
    borderRadius: '100px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
  },
  activeChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#0066cc',
    border: '1px solid #0066cc',
    color: '#ffffff',
    padding: '6px 14px',
    borderRadius: '100px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.25)'
  },
  chipBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '0.7rem',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  chipBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    fontSize: '0.7rem',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '10px'
  },

  // Route connector visual styling
  routeTimelineContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '10px 16px',
    marginBottom: '16px'
  },
  routeLocationBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    maxWidth: '40%',
    flex: 1
  },
  routeLocLabel: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: '0.05em'
  },
  routeLocValue: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  routePathLineContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '0 10px'
  },
  routePathLine: {
    width: '100%',
    height: '2px',
    backgroundColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderWidth: '0 0 2px 0',
    borderColor: '#94a3b8'
  },
  routePathIconWrapper: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  metallicVehicleBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '4px 10px',
    width: 'fit-content',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.02)'
  },
  vehicleBadgeText: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: '0.02em',
    fontFamily: 'monospace'
  },
  consignorDetailBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    marginTop: '6px'
  },
  partyLabel: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: '0.05em'
  },
  partyValue: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#334155',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '220px'
  },
  financialSnapshotBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '150px',
    flex: 0.8
  },
  financialRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px'
  },
  financialLabel: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: '700'
  },
  financialFreightValue: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#1e293b'
  },
  financialBalanceUnpaid: {
    fontSize: '0.8rem',
    fontWeight: '900',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  financialBalancePaid: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    padding: '1px 6px',
    borderRadius: '4px'
  },
  statusBadgeTransit: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#fff7ed',
    border: '1px solid #ffedd5',
    borderRadius: '100px',
    padding: '4px 12px'
  },
  statusBadgeDelivered: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ecfdf5',
    border: '1px solid #d1fae5',
    borderRadius: '100px',
    padding: '4px 12px'
  },
  statusBadgeText: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#475569'
  },
  podUpdateBtnRedesigned: {
    backgroundColor: '#ffffff',
    color: '#2563eb',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '0.72rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  circleActionBtnEdit: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #dbeafe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  circleActionBtnPrint: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#ecfdf5',
    color: '#10b981',
    border: '1px solid #d1fae5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  circleActionBtnShare: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#f5f3ff',
    color: '#7c3aed',
    border: '1px solid #ede9fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  circleActionBtnDelete: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '1px solid #fee2e2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  billedBadge: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '4px',
    padding: '1px 6px'
  },
  multideleteStrip: {
    padding: '8px 16px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fafbfc',
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px'
  },
  multideleteLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.68rem',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '600'
  },
  multideleteCheckbox: {
    cursor: 'pointer'
  },
  createdByBadge: {
    fontSize: '0.65rem',
    color: '#94a3b8',
    fontWeight: '600'
  },
  cardBiltyNoLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#94a3b8'
  },
  cardBiltyNoValue: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#1e293b',
    backgroundColor: '#eff6ff',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid #dbeafe'
  },
  
  // Custom styles matching Roadwe production portal exactly
  cardBiltyNoValueOriginal: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#1e293b',
    backgroundColor: '#eff6ff',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid #dbeafe',
    display: 'inline-block',
    marginLeft: '4px'
  },
  cardDateOriginal: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600'
  },
  cardBodyOriginal: {
    padding: '12px 16px',
    flex: 1
  },
  cardVehicleNoOriginal: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#bf2c1d', // Saturated Roadwe red plate color
    margin: '0 0 2px 0',
    textTransform: 'uppercase'
  },
  toBeBilledOriginal: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
  },
  addExpenseBtnOriginal: {
    backgroundColor: '#0084ff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    width: 'fit-content',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'background-color 0.2s',
    outline: 'none'
  },
  partiesColOriginal: {
    fontSize: '11px',
    color: '#1e293b',
    borderLeft: '1px solid #cbd5e1',
    paddingLeft: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  createdByTagOriginal: {
    fontSize: '10px',
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: '2px'
  },
  cardStatusBarOriginal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: '6px',
    borderBottomRightRadius: '6px'
  },
  updatePodBtnOriginal: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'background-color 0.2s',
    outline: 'none'
  },
  expandChevronBtnOriginal: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#0000ff', // Saturated blue
    color: '#ffffff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '0',
    outline: 'none'
  },
  expandedDrawerContainer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  drawerButtonsRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    padding: '8px 16px'
  },
  drawerActionBtn: {
    backgroundColor: '#e2e8f0', // Grey action button style
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '6px 20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    outline: 'none',
    transition: 'all 0.15s'
  },
  drawerCloseBtn: {
    backgroundColor: '#e2e8f0',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '4px 20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.15s'
  },
  popupMenu: {
    position: 'absolute',
    top: '100%',
    left: '0',
    marginTop: '6px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '8px',
    zIndex: 100,
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  popupMenuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 8px',
    fontSize: '12px',
    color: '#1e293b',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.15s'
  },
  popupSubmitBtn: {
    backgroundColor: '#00b050', // Roadwe green
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '8px',
    width: '100%',
    outline: 'none'
  },
  modalOverlayOriginal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000
  },
  modalContentOriginal: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '900px', // wide enough for freight grid
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'modalSlideIn 0.3s ease'
  },
  modalHeaderOriginal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#ffffff'
  },
  modalTitleOriginal: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  modalCloseIconBtn: {
    border: 'none',
    background: 'none',
    fontSize: '24px',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '0',
    lineHeight: '1',
    transition: 'color 0.15s'
  },
  modalFooterOriginal: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc'
  },
  modalSubmitBtnOriginal: {
    backgroundColor: '#00b050', // Roadwe green
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 20px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    outline: 'none'
  },
  modalCloseBtnOriginal: {
    backgroundColor: '#ffffff',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '6px 20px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none'
  },
  modalFormGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    padding: '24px'
  },
  modalFormGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  modalFormLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '2px'
  },
  modalFormInput: {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    height: '36px',
    fontFamily: "'Inter', sans-serif"
  },
  modalFormTextarea: {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    height: '60px',
    resize: 'none',
    fontFamily: "'Inter', sans-serif"
  }
};
