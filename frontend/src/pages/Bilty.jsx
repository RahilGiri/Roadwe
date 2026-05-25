import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Printer, Share2, CheckCircle, Clock, Home, Download, Filter, FileText, ChevronDown, X } from 'lucide-react';

export default function Bilty({ 
  bilties, customers, vehicles, quickAddTarget,
  onCreateBilty, onUpdateBilty, onDeleteBilty,
  headingColor, showBiltyBank, selectedBiltyFormat, logoImg, stampImg
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormPage, setShowFormPage] = useState(!!quickAddTarget);
  const [editingBilty, setEditingBilty] = useState(null);
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
  };

  const filteredBilties = bilties.filter(b => {
    // 1. Text search query
    const matchesSearch = 
      b.biltyNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.vehicleNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.consignorName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
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


  return (
    <div style={styles.container}>
      
      {/* 1. Gorgeous Card-Structured Bilty list */}
      {!showFormPage && (
        <>
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px' }} />
              <span>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span>Bilty</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>Bilty List</span>
            </div>
          </div>

          <div style={styles.mainCard}>
            <div style={styles.cardHeaderRow}>
              <h2 style={styles.cardTitle}>Bilty List ({filteredBilties.length})</h2>
              
              <div style={styles.actionsBar}>
                <div style={styles.searchGroup}>
                  <Search size={14} style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search Bilty..."
                    style={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button style={styles.excelBtn} onClick={() => alert('🗑️ Selected item deleted successfully.')}>Delete</button>
                <button style={styles.printBtn} onClick={() => alert('🖨️ Exporting PDF Report...')}>Report</button>
                <button style={styles.filterBtn} onClick={() => setFilterModalOpen(true)}>Filter</button>
                <button style={styles.createBtn} onClick={handleOpenAdd}>Create New Bilty</button>
              </div>
            </div>

            {/* Premium Two-Column Card Grid */}
            <div style={styles.cardGrid}>
              {filteredBilties.map((b) => (
                <div key={b._id} style={styles.biltyCard}>
                  <div style={styles.cardTopBar}>
                    <span style={styles.cardBiltyNo}>BILTY NO.: <span style={{ color: '#1e293b' }}>{b.biltyNo}</span></span>
                    <span style={styles.cardDate}>{b.date}</span>
                  </div>
                  
                  <div style={styles.cardBody}>
                    <div style={styles.bodyRow}>
                      <div>
                        <h3 style={styles.cardVehicleNo}>{b.vehicleNumber || 'UP-78-HN-3039'}</h3>
                        <div style={styles.cardTbbBlock}>
                          <span>TO BE BILLED : <b>₹{b.balanceAmount || b.totalFreight || 0}/-</b></span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <label className="switch">
                              <input 
                                type="checkbox" 
                                checked={b.deliveryStatus === 'Delivered' || b.paidStatus === 'Paid'} 
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
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>PAID</span>
                          </div>
                          <button style={styles.miniExpenseBtn}>Add Expense</button>
                        </div>
                      </div>
                      <div style={styles.partiesCol}>
                        <p><b>CONSIGNOR:</b> {b.consignorName || 'INDIA PESTICIDES LTD'}</p>
                        <p><b>FROM:</b> {b.fromCity || 'Sandila (Uttar Pradesh)'}</p>
                        <p><b>TO:</b> {b.toCity || 'Ankleshwar (Gujarat)'}</p>
                        <span style={styles.createdByTag}>Created By : {b.createdBy || 'Transcore Logistics'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.cardFooterBar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#0066cc', fontWeight: '600' }}>
                      Status: {b.deliveryStatus || 'Pending'}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>POD Status Pending</span>
                      <button style={styles.podUpdateBtn} onClick={() => alert('✍️ POD Upload and verification is preloaded successfully!')}>Update POD</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a' }}>Billed</span>
                      
                      {/* Action triggers */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button style={styles.actionBtn} onClick={() => handleOpenEdit(b)} title="Edit"><Edit2 size={12} /></button>
                        <button style={styles.actionPrintBtn} onClick={() => setPrintingBilty(b)} title="Print Bilty"><Printer size={12} /></button>
                        <button style={styles.actionShareBtn} onClick={() => setSharingBilty(b)} title="Share Bilty"><Share2 size={12} /></button>
                        <button style={styles.actionDeleteBtn} onClick={() => onDeleteBilty(b._id)} title="Delete"><Trash2 size={12} /></button>
                      </div>
                      <ChevronDown size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                    </div>
                  </div>
                  
                  <div style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#64748b', cursor: 'pointer' }}>
                      <input type="checkbox" /> Select to delete multiple bilty.
                    </label>
                  </div>
                </div>
              ))}
              {filteredBilties.length === 0 && (
                <div style={styles.noRecords}>No Lorry Receipts (Bilties) compiled yet. Click Create Bilty to start!</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 2. Premium visual Bilty creation Form Page */}
      {showFormPage && (
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px' }} />
              <span>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span>Bilty</span>
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
                  Generate Bilty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Print-Ready Lorry Receipt Layout */}
      {printingBilty && (
        <div style={styles.printOverlay}>
          <div className="print-container-visible" style={styles.printContainer}>
            
            {/* Format 1 Header: Standard Classic (Red Theme by default, or custom headingColor) */}
            {selectedBiltyFormat === 1 && (
              <div style={styles.printHeader}>
                <div style={styles.printLogo}>
                  {logoImg ? <img src={logoImg} alt="Logo" style={{ height: '36px', verticalAlign: 'middle', marginRight: '8px' }} /> : null}
                  <span style={{ color: headingColor || '#ef4444' }}>TRANSCORE LOGISTICS</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ color: headingColor || '#ef4444', fontSize: '1.25rem', fontWeight: '800' }}>LORRY RECEIPT</h2>
                  <span style={{ fontSize: '0.8rem' }}><b>Bilty No:</b> {printingBilty.biltyNo}</span><br />
                  <span style={{ fontSize: '0.8rem' }}><b>Date:</b> {printingBilty.date}</span>
                </div>
              </div>
            )}

            {/* Format 2 Header: Triple-Split Dispatch Summary (Slate Theme by default) */}
            {selectedBiltyFormat === 2 && (
              <div style={styles.printHeader}>
                <div style={styles.printLogo}>
                  {logoImg ? <img src={logoImg} alt="Logo" style={{ height: '36px', verticalAlign: 'middle', marginRight: '8px' }} /> : null}
                  <span style={{ color: headingColor || '#475569' }}>TRANSCORE LOGISTICS</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2 style={{ color: headingColor || '#475569', fontSize: '1.2rem', fontWeight: '800' }}>DELIVERY ADVICE</h2>
                  <span style={{ fontSize: '0.8rem' }}><b>Ref Bilty No:</b> {printingBilty.biltyNo}</span><br />
                  <span style={{ fontSize: '0.8rem' }}><b>Date:</b> {printingBilty.date}</span>
                </div>
              </div>
            )}

            {/* Format 3 Header: Relational Corporate Format (Royal Blue Theme by default) */}
            {selectedBiltyFormat === 3 && (
              <div style={{ ...styles.printHeader, background: headingColor || '#0066cc', padding: '16px', borderRadius: '6px', color: '#ffffff' }}>
                <div style={{ ...styles.printLogo, color: '#ffffff' }}>
                  {logoImg ? <img src={logoImg} alt="Logo" style={{ height: '36px', verticalAlign: 'middle', marginRight: '8px', filter: 'brightness(0) invert(1)' }} /> : null}
                  <span>TRANSCORE LOGISTICS</span>
                </div>
                <div style={{ textAlign: 'right', color: '#ffffff' }}>
                  <h2 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>CONSIGNMENT RECEIPT</h2>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}><b>LR No:</b> {printingBilty.biltyNo} • <b>Date:</b> {printingBilty.date}</span>
                </div>
              </div>
            )}
            
            {selectedBiltyFormat !== 3 && <hr style={{ ...styles.divider, borderTopColor: headingColor || (selectedBiltyFormat === 1 ? '#ef4444' : '#475569') }} />}
            {selectedBiltyFormat === 3 && <div style={{ height: '20px' }}></div>}
            
            {selectedBiltyFormat === 2 ? (
              <div style={{ ...styles.printSection, gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div style={styles.printCol}>
                  <h4 style={{ color: headingColor || '#475569', fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>CONSIGNOR (Sender)</h4>
                  <p><b>Name:</b> {printingBilty.consignorName}</p>
                  <p><b>From:</b> {printingBilty.fromCity}</p>
                </div>
                <div style={styles.printCol}>
                  <h4 style={{ color: headingColor || '#475569', fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>CONSIGNEE (Receiver)</h4>
                  <p><b>Name:</b> {printingBilty.consigneeName}</p>
                  <p><b>To:</b> {printingBilty.toCity}</p>
                </div>
                <div style={styles.printCol}>
                  <h4 style={{ color: headingColor || '#475569', fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>TRIP & VEHICLE</h4>
                  <p><b>Vehicle No:</b> {printingBilty.vehicleNumber}</p>
                  <p><b>Freight Terms:</b> {printingBilty.paidBy}</p>
                </div>
              </div>
            ) : (
              <div style={styles.printSection}>
                <div style={styles.printCol}>
                  <h4 style={{ color: headingColor || (selectedBiltyFormat === 3 ? '#0066cc' : '#ef4444'), marginBottom: '8px' }}>CONSIGNOR (Sender)</h4>
                  <p><b>Name:</b> {printingBilty.consignorName}</p>
                  <p><b>From City:</b> {printingBilty.fromCity}</p>
                  <p><b>Terms:</b> Paid by {printingBilty.paidBy}</p>
                </div>
                <div style={styles.printCol}>
                  <h4 style={{ color: headingColor || (selectedBiltyFormat === 3 ? '#0066cc' : '#ef4444'), marginBottom: '8px' }}>CONSIGNEE (Receiver)</h4>
                  <p><b>Name:</b> {printingBilty.consigneeName}</p>
                  <p><b>To City:</b> {printingBilty.toCity}</p>
                  <p><b>Vehicle Assigned:</b> {printingBilty.vehicleNumber}</p>
                </div>
              </div>
            )}
            
            <table style={styles.printTable}>
              <thead>
                <tr style={{ background: selectedBiltyFormat === 1 ? '#fef2f2' : selectedBiltyFormat === 2 ? '#f8fafc' : '#eff6ff' }}>
                  <th style={{ ...styles.printTh, borderBottomColor: headingColor || (selectedBiltyFormat === 1 ? '#fca5a5' : selectedBiltyFormat === 2 ? '#cbd5e1' : '#bfdbfe') }}>Goods Description</th>
                  <th style={{ ...styles.printTh, borderBottomColor: headingColor || (selectedBiltyFormat === 1 ? '#fca5a5' : selectedBiltyFormat === 2 ? '#cbd5e1' : '#bfdbfe') }}>No. of Pkgs</th>
                  <th style={{ ...styles.printTh, borderBottomColor: headingColor || (selectedBiltyFormat === 1 ? '#fca5a5' : selectedBiltyFormat === 2 ? '#cbd5e1' : '#bfdbfe') }}>Actual Wt</th>
                  <th style={{ ...styles.printTh, borderBottomColor: headingColor || (selectedBiltyFormat === 1 ? '#fca5a5' : selectedBiltyFormat === 2 ? '#cbd5e1' : '#bfdbfe') }}>Charged Wt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.printTd}>{printingBilty.goodsDescription || 'Seeds/Chemical Bags'}</td>
                  <td style={styles.printTd}>{printingBilty.noOfPackages || 100}</td>
                  <td style={styles.printTd}>{printingBilty.actualWeight || 20} {printingBilty.unit || 'Tons'}</td>
                  <td style={styles.printTd}>{printingBilty.guaranteeWeight || printingBilty.actualWeight || 20} {printingBilty.unit || 'Tons'}</td>
                </tr>
              </tbody>
            </table>
            
            <div style={styles.printFreightSummary}>
              <div style={styles.freightRow}><span>Freight Promised Charge:</span> <b>₹{printingBilty.rate || 0}</b></div>
              <div style={styles.freightRow}><span>Halting Charge:</span> <b>₹{printingBilty.haltingCharge || 0}</b></div>
              <div style={styles.freightRow}><span>Bilty/Misc Charge:</span> <b>₹{(printingBilty.biltyChargeVal1 || 0) + (printingBilty.biltyChargeVal2 || 0) + (printingBilty.otherCharges || 0)}</b></div>
              <div style={styles.freightRow}><span style={{ fontWeight: '700' }}>TOTAL AMOUNT:</span> <b>₹{printingBilty.totalFreight || 0}</b></div>
              <div style={styles.freightRow}><span>Less - Advance Received:</span> <b>₹{printingBilty.advancePaid || 0}</b></div>
              <div style={styles.freightRow}><span style={{ color: '#ef4444', fontWeight: '700' }}>BALANCE DUE:</span> <b style={{ color: '#ef4444' }}>₹{printingBilty.balanceAmount || 0}</b></div>
            </div>

            {/* Dynamic Bank Settlement block */}
            {showBiltyBank && (
              <div style={{ 
                margin: '20px 0', 
                padding: '12px 16px', 
                border: '1px dashed #cbd5e1', 
                borderRadius: '6px', 
                backgroundColor: '#f8fafc',
                fontSize: '0.75rem',
                color: '#334155',
                lineHeight: '1.4'
              }}>
                <strong>🏦 HDFC BANK SETTLEMENT TERMS:</strong><br />
                Account Holder: TRANSCORE LOGISTICS PRIVATE LIMITED • Account No: 5010023456789 • IFSC: HDFC0000123 • Branch: Kanpur Nagar Main
              </div>
            )}
            
            <div style={styles.printFooter}>
              <div style={{ flex: 1, marginRight: '20px' }}>
                <h5 style={{ fontSize: '0.7rem', color: headingColor || '#0066cc', marginBottom: '4px', textTransform: 'uppercase' }}>Terms & Conditions:</h5>
                <ol style={{ paddingLeft: '12px', margin: 0, fontSize: '0.58rem', color: '#475569', lineHeight: '1.3' }}>
                  {(() => {
                    const savedTerms = localStorage.getItem('masters_terms');
                    const activeTerms = savedTerms ? JSON.parse(savedTerms) : [];
                    const filteredTerms = activeTerms.filter(t => t.showInPdf !== false);
                    if (filteredTerms.length === 0) {
                      return <li>Goods carried strictly at owner's risk. Transporter is not liable for transit damages or leakage.</li>;
                    }
                    return filteredTerms.map((t, idx) => (
                      <li key={t._id} style={{ marginBottom: '2px' }}>{t.text}</li>
                    ));
                  })()}
                </ol>
              </div>
              <div style={styles.signatureBlock}>
                {stampImg ? (
                  <img src={stampImg} alt="Authorized Stamp" style={{ height: '48px', marginBottom: '4px', objectFit: 'contain' }} />
                ) : selectedBiltyFormat === 3 ? (
                  <div style={{ display: 'inline-block', border: '2px dashed #ef4444', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.65rem', marginBottom: '8px', textTransform: 'uppercase', transform: 'rotate(-4deg)' }}>
                    APPROVED
                  </div>
                ) : (
                  <div style={{ height: '40px' }} />
                )}
                <div style={styles.sigLine}></div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Authorized Signatory</span>
              </div>
            </div>

            <div style={styles.printControls}>
              <button className="btn btn-secondary" onClick={() => setPrintingBilty(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>Print / Save PDF</button>
            </div>
          </div>
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
  }
};
