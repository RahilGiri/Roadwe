import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Share2, Printer, Home, Download, Filter, X } from 'lucide-react';

export default function LoadingSlip({ 
  slips, customers, vehicles, initialOpen,
  onCreateSlip, onUpdateSlip, onDeleteSlip,
  headingColor, showLoadBank, selectedLoadingFormat, loadingBgColor, logoImg, stampImg
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormPage, setShowFormPage] = useState(initialOpen || false);
  const [editingSlip, setEditingSlip] = useState(null);
  const [printingSlip, setPrintingSlip] = useState(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  
  // High-Fidelity functional filter modal states
  const [filterParty, setFilterParty] = useState('Select Party Name');
  const [filterVehicle, setFilterVehicle] = useState('Select Vehicle No.');
  const [filterSlipNo, setFilterSlipNo] = useState('Select Loading Slip No.');
  const [filterFromLoc, setFilterFromLoc] = useState('Select From Location');
  const [filterToLoc, setFilterToLoc] = useState('Select To Location');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [filterBillStatus, setFilterBillStatus] = useState('Select Bill Status');

  // Split vehicle inputs
  const [vNum1, setVNum1] = useState('');
  const [vNum2, setVNum2] = useState('');
  const [vNum3, setVNum3] = useState('');
  const [vNum4, setVNum4] = useState('');

  // Sync initialOpen trigger from Sidebar sub-navigation
  React.useEffect(() => {
    if (initialOpen) {
      handleOpenAdd();
    }
  }, [initialOpen]);

  // Form State
  const [formData, setFormData] = useState({
    slipNo: '1',
    date: new Date().toISOString().split('T')[0],
    branchCode: 'G',
    financialYear: '2026-2027',
    
    // Party Details
    consignorName: '',
    consignorContact: '',
    consignorGstin: '',
    consignorEmail: '',
    consignorBank: '',
    consignorAddress: '',

    // Truck Details
    vehicleNumber: '',
    vehicleType: 'Own',
    vehicleSize: '',
    openingKm: '',
    closingKm: '',
    driverName: '',
    driverMobile: '',
    dlNumber: '',
    supplierName: '',
    supplierMobile: '',
    supplierPan: '',
    supplierAddress: '',

    // Material Details
    fromCity: '',
    toCity: '',
    goodsDescription: '',

    // Freight calculations
    actualWeight: 0,
    guaranteeWeight: '',
    unit: 'Metric Ton (MT)',
    rate: 0,
    fixedRate: true,
    haltingCharge: 0,
    otherCharges: 0,
    totalFreight: 0,
    driverAdvance: 0,
    balance: 0,

    // Remarks & Checkboxes
    remarks: '',
    hideSupplier: false,
    hideDatetime: false
  });

  const handleOpenAdd = () => {
    setEditingSlip(null);
    setVNum1('');
    setVNum2('');
    setVNum3('');
    setVNum4('');
    setFormData({
      slipNo: (1 + (slips?.length || 0)).toString(),
      date: new Date().toISOString().split('T')[0],
      branchCode: 'G',
      financialYear: '2026-2027',
      consignorName: customers[0]?.name || '',
      consignorContact: customers[0]?.phone || '',
      consignorGstin: customers[0]?.gstin || '',
      consignorEmail: customers[0]?.email || '',
      consignorBank: 'HDFC BANK',
      consignorAddress: customers[0]?.address || '',
      vehicleNumber: vehicles[0]?.vehicleNumber || '',
      vehicleType: 'Own',
      vehicleSize: '32 FT Multi-Axle',
      openingKm: '125000',
      closingKm: '125800',
      driverName: 'Ramesh Singh',
      driverMobile: '9888877777',
      dlNumber: 'DL1234567890123',
      supplierName: '',
      supplierMobile: '',
      supplierPan: '',
      supplierAddress: '',
      fromCity: 'Kanpur',
      toCity: 'Mumbai',
      goodsDescription: 'Agricultural Seeds/Chemical Bags',
      actualWeight: 20,
      guaranteeWeight: '20',
      unit: 'Metric Ton (MT)',
      rate: 2200,
      fixedRate: true,
      haltingCharge: 0,
      otherCharges: 0,
      totalFreight: 0,
      driverAdvance: 5000,
      balance: 0,
      remarks: '',
      hideSupplier: false,
      hideDatetime: false
    });
    setShowFormPage(true);
  };

  const handleOpenEdit = (slip) => {
    setEditingSlip(slip);
    setFormData({ ...slip });
    const parts = (slip.vehicleNumber || '').split('-');
    setVNum1(parts[0] || '');
    setVNum2(parts[1] || '');
    setVNum3(parts[2] || '');
    setVNum4(parts[3] || '');
    setShowFormPage(true);
  };

  const recalculateValues = (field, value) => {
    const nextForm = { ...formData, [field]: value };
    const rate = Number(nextForm.rate) || 0;
    const isFixed = nextForm.fixedRate;
    const weight = Number(nextForm.actualWeight) || 0;
    
    const baseFreight = isFixed ? rate : (rate * weight);
    const halting = Number(nextForm.haltingCharge) || 0;
    const others = Number(nextForm.otherCharges) || 0;
    const totalFreight = baseFreight + halting + others;
    
    const advance = Number(nextForm.driverAdvance) || 0;
    const balance = totalFreight - advance;
    
    setFormData({
      ...nextForm,
      totalFreight,
      balance
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalVNum = vNum1 ? `${vNum1.toUpperCase()}-${vNum2.toUpperCase()}-${vNum3.toUpperCase()}-${vNum4.toUpperCase()}` : formData.vehicleNumber;

    const finalData = {
      ...formData,
      vehicleNumber: finalVNum
    };

    if (editingSlip) {
      onUpdateSlip(editingSlip._id, finalData);
    } else {
      onCreateSlip(finalData);
    }
    setShowFormPage(false);
  };

  const shareLoadingDetails = (slip) => {
    const text = `🚛 *LOADING ADVICE SLIP NO. ${slip.slipNo}*\n📅 *Date:* ${slip.date}\n📍 *Route:* ${slip.fromCity} to ${slip.toCity}\n🚛 *Vehicle:* ${slip.vehicleNumber}\n🏢 *Consignor:* ${slip.consignorName}\n💵 *Freight Promised:* ₹${slip.totalFreight}\n💸 *Advance Paid:* ₹${slip.driverAdvance}\n💰 *Outstanding Balance:* ₹${slip.balance}\n📝 *Remarks:* ${slip.remarks || 'None'}`;
    navigator.clipboard.writeText(text);
    alert('Loading Slip details formatted and copied to clipboard! Share it on WhatsApp.');
  };

  const filteredSlips = slips.filter(s => {
    // 1. Text search query
    const matchesSearch = 
      s.slipNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.vehicleNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.consignorName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    // 2. Party Name
    if (filterParty !== 'Select Party Name' && s.consignorName !== filterParty) return false;
    
    // 3. Vehicle Number
    if (filterVehicle !== 'Select Vehicle No.' && s.vehicleNumber !== filterVehicle) return false;
    
    // 4. Loading Slip No
    if (filterSlipNo !== 'Select Loading Slip No.' && s.slipNo !== filterSlipNo) return false;
    
    // 5. From Location
    if (filterFromLoc !== 'Select From Location' && s.fromCity !== filterFromLoc) return false;
    
    // 6. To Location
    if (filterToLoc !== 'Select To Location' && s.toCity !== filterToLoc) return false;
    
    // 7. Dates
    if (filterFromDate && s.date < filterFromDate) return false;
    if (filterToDate && s.date > filterToDate) return false;
    
    // 8. Bill Status
    if (filterBillStatus !== 'Select Bill Status') {
      const isPaid = filterBillStatus === 'Paid';
      if (isPaid && s.balance > 0) return false;
      if (!isPaid && s.balance === 0) return false;
    }
    
    return matchesSearch;
  });


  return (
    <div style={styles.container}>
      
      {/* 1. Card Structured Loading Slip List View */}
      {!showFormPage && (
        <>
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px' }} />
              <span>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span>Loading Slip</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>Loading Slip List</span>
            </div>
          </div>

          <div style={styles.mainCard}>
            <div style={styles.cardHeaderRow}>
              <h2 style={styles.cardTitle}>Loading Slip List ({filteredSlips.length})</h2>
              
              <div style={styles.actionsBar}>
                <div style={styles.searchGroup}>
                  <Search size={14} style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search Loading Slip..."
                    style={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button style={styles.excelBtn} onClick={() => alert('🗑️ Selected item deleted successfully.')}>Delete</button>
                <button style={styles.printBtn} onClick={() => alert('🖨️ Exporting PDF Report...')}>Report</button>
                <button style={styles.filterBtn} onClick={() => setFilterModalOpen(true)}>Filter</button>
                <button style={styles.createBtn} onClick={handleOpenAdd}>Create New Loading Slip</button>
              </div>
            </div>

            {filteredSlips.length === 0 ? (
              /* Empty state matching Screenshot 4 */
              <div style={styles.emptyCardState}>
                <h3 style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: '700', marginBottom: '20px' }}>No Data Found</h3>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{ ...styles.paginationBtn, backgroundColor: '#0066cc', color: '#ffffff' }}>1</button>
                </div>
              </div>
            ) : (
              /* Grid representation */
              <div style={styles.cardGrid}>
                {filteredSlips.map((s) => (
                  <div key={s._id} style={styles.biltyCard}>
                    <div style={styles.cardTopBar}>
                      <span style={styles.cardBiltyNo}>LOADING SLIP NO: <span style={{ color: '#1e293b' }}>#{s.slipNo}</span></span>
                      <span style={styles.cardDate}>{s.date}</span>
                    </div>
                    
                    <div style={styles.cardBody}>
                      <div style={styles.bodyRow}>
                        <div>
                          <h3 style={styles.cardVehicleNo}>{s.vehicleNumber}</h3>
                          <div style={styles.cardTbbBlock}>
                            <span>Outstanding Balance: <b>₹{s.balance || 0}/-</b></span>
                          </div>
                        </div>
                        <div style={styles.partiesCol}>
                          <p><b>CONSIGNOR:</b> {s.consignorName}</p>
                          <p><b>FROM:</b> {s.fromCity || 'Kanpur'}</p>
                          <p><b>TO:</b> {s.toCity || 'Mumbai'}</p>
                          <span style={styles.createdByTag}><b>Total:</b> ₹{s.totalFreight || s.freightPromised || 0} • <b>Adv:</b> ₹{s.driverAdvance || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.cardFooterBar}>
                      <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '700' }}>
                        Broker: {s.brokerName || 'Direct'}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={styles.actionBtn} onClick={() => handleOpenEdit(s)} title="Edit"><Edit2 size={12} /></button>
                        <button style={styles.actionPrintBtn} onClick={() => setPrintingSlip(s)} title="Print Slip"><Printer size={12} /></button>
                        <button style={styles.actionShareBtn} onClick={() => shareLoadingDetails(s)} title="Share via WhatsApp"><Share2 size={12} /></button>
                        <button style={styles.actionDeleteBtn} onClick={() => onDeleteSlip(s._id)} title="Delete"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. Premium visual Loading Slip creation Form Page */}
      {showFormPage && (
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px' }} />
              <span>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span>Loading Slip</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>{editingSlip ? 'Edit Loading Slip' : 'Create New Loading Slip'}</span>
            </div>
            <button 
              style={styles.backToListBtn} 
              onClick={() => {
                setShowFormPage(false);
                setEditingSlip(null);
              }}
            >
              Loading Slip List
            </button>
          </div>

          <div style={styles.formCard}>
            <h2 style={styles.modalTitle}>Loading Slip Form</h2>
            
            <form onSubmit={handleSubmit}>
              <div style={styles.formGridPage}>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Loading Slip No *</label>
                    <input
                      type="text" required
                      style={styles.formInputPage}
                      value={formData.slipNo || ''}
                      onChange={(e) => recalculateValues('slipNo', e.target.value)}
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

                {/* Party Details */}
                <h4 style={styles.subHeading}>Party Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Party Name</label>
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
                      <option value="">-- Choose Party --</option>
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
                    <label style={styles.formLabelPage}>Vehicle Size</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Vehicle Size"
                      value={formData.vehicleSize || ''}
                      onChange={(e) => setFormData({ ...formData, vehicleSize: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Opening KM</label>
                    <input
                      type="number" style={styles.formInputPage} placeholder="Opening KM"
                      value={formData.openingKm || ''}
                      onChange={(e) => setFormData({ ...formData, openingKm: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Closing KM</label>
                    <input
                      type="number" style={styles.formInputPage} placeholder="Closing KM"
                      value={formData.closingKm || ''}
                      onChange={(e) => setFormData({ ...formData, closingKm: e.target.value })}
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
                </div>

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
                      type="text" style={styles.formInputPage} placeholder="Vehicle Owner PAN No."
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

                {/* Material Details */}
                <h4 style={styles.subHeading}>Material Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>From</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Enter From Location"
                      value={formData.fromCity || ''}
                      onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>To</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Enter To Location"
                      value={formData.toCity || ''}
                      onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
                    />
                  </div>
                </div>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Load/Material Details</label>
                  <textarea
                    style={styles.formTextareaPage} placeholder="Material Details"
                    value={formData.goodsDescription || ''}
                    onChange={(e) => setFormData({ ...formData, goodsDescription: e.target.value })}
                  />
                  <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                </div>

                {/* Freight Details */}
                <h4 style={styles.subHeading}>Freight Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Actual Weight</label>
                    <input
                      type="number" style={styles.formInputPage} placeholder="Actual Weight"
                      value={formData.actualWeight || 0}
                      onChange={(e) => recalculateValues('actualWeight', Number(e.target.value))}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Guarantee Weight</label>
                    <input
                      type="text" style={styles.formInputPage} placeholder="Enter Guaranty Weight"
                      value={formData.guaranteeWeight || ''}
                      onChange={(e) => setFormData({ ...formData, guaranteeWeight: e.target.value })}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Unit</label>
                    <select
                      className="form-control" style={{ height: '40px' }}
                      value={formData.unit || 'Metric Ton (MT)'}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="Metric Ton (MT)">Metric Ton (MT)</option>
                      <option value="Kgs">Kgs</option>
                      <option value="Boxes">Boxes</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Rate</label>
                    <input
                      type="number" style={styles.formInputPage} placeholder="Rate"
                      value={formData.rate || 0}
                      onChange={(e) => recalculateValues('rate', Number(e.target.value))}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 0.5, marginTop: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.fixedRate} onChange={(e) => recalculateValues('fixedRate', e.target.checked)} /> FIXED
                    </label>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Freight Amount</label>
                    <input
                      type="text" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} placeholder="Freight Amount"
                      value={formData.fixedRate ? formData.rate : (formData.rate * formData.actualWeight)}
                    />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Halting Charge</label>
                    <input
                      type="number" style={styles.formInputPage} placeholder="Halting Charge"
                      value={formData.haltingCharge || 0}
                      onChange={(e) => recalculateValues('haltingCharge', Number(e.target.value))}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Other Charges</label>
                    <input
                      type="number" style={styles.formInputPage} placeholder="Other Charge"
                      value={formData.otherCharges || 0}
                      onChange={(e) => recalculateValues('otherCharges', Number(e.target.value))}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Total Amount</label>
                    <input
                      type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }}
                      value={formData.totalFreight || 0}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Advance(Rs)</label>
                    <input
                      type="number" style={styles.formInputPage} placeholder="Advance Amount"
                      value={formData.driverAdvance || 0}
                      onChange={(e) => recalculateValues('driverAdvance', Number(e.target.value))}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Balance(Rs)</label>
                    <input
                      type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }}
                      value={formData.balance || 0}
                    />
                  </div>
                </div>

                {/* Other Remarks */}
                <h4 style={styles.subHeading}>Other Remarks</h4>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Remarks</label>
                  <textarea
                    style={styles.formTextareaPage} placeholder="Other Remark"
                    value={formData.remarks || ''}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  />
                  <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                </div>

                <div style={{ display: 'flex', gap: '24px', margin: '8px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={formData.hideSupplier} onChange={(e) => setFormData({ ...formData, hideSupplier: e.target.checked })} /> Hide Supplier/Owner Details from PDF
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={formData.hideDatetime} onChange={(e) => setFormData({ ...formData, hideDatetime: e.target.checked })} /> Hide Generated Datetime from PDF
                  </label>
                </div>
              </div>

              <div style={styles.greenButtonContainer}>
                <button type="submit" style={styles.greenActionBtn}>
                  Generate Loading Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Printable Loading Slip Overlay */}
      {printingSlip && (
        <div style={styles.printOverlay}>
          <div className="print-container-visible" style={{ ...styles.printContainer, backgroundColor: loadingBgColor || '#ffffff' }}>
            
            {/* Format 1: Pavan Standard */}
            {selectedLoadingFormat === 1 && (
              <>
                <div style={styles.printHeader}>
                  <div style={styles.printLogo}>
                    {logoImg && <img src={logoImg} alt="Logo" style={{ height: '36px', verticalAlign: 'middle', marginRight: '8px' }} />}
                    <span style={{ color: headingColor || '#1e293b' }}>TRANSCORE LOGISTICS</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2 style={{ color: headingColor || '#0066cc', fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>LOADING ADVICE SLIP</h2>
                    <span style={{ fontSize: '0.8rem' }}><b>Slip No:</b> #{printingSlip.slipNo}</span><br />
                    <span style={{ fontSize: '0.8rem' }}><b>Date:</b> {printingSlip.date}</span>
                  </div>
                </div>

                <hr style={{ ...styles.divider, borderTopColor: headingColor || '#0066cc' }} />

                <div style={styles.printSection}>
                  <div style={styles.printCol}>
                    <h4 style={{ color: headingColor || '#0066cc', marginBottom: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>CONSIGNMENT DETAILS</h4>
                    <p><b>Consignor Name:</b> {printingSlip.consignorName}</p>
                    <p><b>From Location:</b> {printingSlip.fromCity}</p>
                    <p><b>To Location:</b> {printingSlip.toCity}</p>
                  </div>
                  <div style={styles.printCol}>
                    <h4 style={{ color: headingColor || '#0066cc', marginBottom: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>VEHICLE & BROKER</h4>
                    <p><b>Vehicle Assigned:</b> {printingSlip.vehicleNumber}</p>
                    <p><b>Broker / Lorry Supplier:</b> {printingSlip.brokerName || 'Direct'}</p>
                    <p><b>Remarks:</b> {printingSlip.remarks || 'None'}</p>
                  </div>
                </div>
              </>
            )}

            {/* Format 2: Roadwe Corporate */}
            {selectedLoadingFormat === 2 && (
              <>
                <div style={{ ...styles.printHeader, background: headingColor || '#1e293b', padding: '16px', borderRadius: '6px', color: '#ffffff' }}>
                  <div style={{ ...styles.printLogo, color: '#ffffff' }}>
                    {logoImg && <img src={logoImg} alt="Logo" style={{ height: '36px', verticalAlign: 'middle', marginRight: '8px', filter: 'brightness(0) invert(1)' }} />}
                    <span>TRANSCORE CORPORATE</span>
                  </div>
                  <div style={{ textAlign: 'right', color: '#ffffff' }}>
                    <h2 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>LOADING ADVICE</h2>
                    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}><b>Slip Ref:</b> #{printingSlip.slipNo} • <b>Date:</b> {printingSlip.date}</span>
                  </div>
                </div>

                <div style={{ height: '20px' }}></div>

                <div style={{ ...styles.printSection, gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div style={styles.printCol}>
                    <h4 style={{ color: headingColor || '#1e293b', fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>CONSIGNOR</h4>
                    <p><b>Name:</b> {printingSlip.consignorName}</p>
                  </div>
                  <div style={styles.printCol}>
                    <h4 style={{ color: headingColor || '#1e293b', fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>ROUTE</h4>
                    <p><b>From:</b> {printingSlip.fromCity}</p>
                    <p><b>To:</b> {printingSlip.toCity}</p>
                  </div>
                  <div style={styles.printCol}>
                    <h4 style={{ color: headingColor || '#1e293b', fontSize: '0.8rem', fontWeight: '700', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>DETAILS</h4>
                    <p><b>Vehicle:</b> {printingSlip.vehicleNumber}</p>
                    <p><b>Broker:</b> {printingSlip.brokerName || 'Direct'}</p>
                  </div>
                </div>
              </>
            )}

            <table style={styles.printTable}>
              <thead>
                <tr style={{ background: selectedLoadingFormat === 1 ? '#f8fafc' : '#eff6ff' }}>
                  <th style={styles.printTh}>Item Head Description</th>
                  <th style={styles.printTh}>Broker Account Details</th>
                  <th style={styles.printTh}>Promised Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.printTd}>Freight Loading Advice Charge</td>
                  <td style={styles.printTd}>{printingSlip.brokerName ? `Supplier Ledger: ${printingSlip.brokerName}` : 'Self Owned / Direct Vehicle'}</td>
                  <td style={styles.printTd}>₹{printingSlip.totalFreight || printingSlip.freightPromised}</td>
                </tr>
              </tbody>
            </table>

            <div style={styles.printFreightSummary}>
              <div style={styles.freightRow}><span>Total Freight Promised:</span> <b>₹{printingSlip.totalFreight || printingSlip.freightPromised}</b></div>
              <div style={styles.freightRow}><span>Driver Cash Advance:</span> <b style={{ color: '#ef4444' }}>- ₹{printingSlip.driverAdvance}</b></div>
              <div style={styles.freightRow}><span style={{ fontWeight: '700', color: headingColor || '#0066cc' }}>OUTSTANDING BALANCE:</span> <b style={{ color: '#10b981', fontSize: '1rem' }}>₹{printingSlip.balance}</b></div>
            </div>

            {/* Bank details block */}
            {showLoadBank && (
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

            {/* Stamp & Footer Block */}
            <div style={styles.printFooter}>
              <div style={{ flex: 1, marginRight: '20px' }}>
                <h5 style={{ fontSize: '0.75rem', color: headingColor || '#0066cc', marginBottom: '4px' }}>Loading Rules & Directions:</h5>
                <ol style={{ paddingLeft: '12px', margin: 0, fontSize: '0.6rem', color: '#475569', lineHeight: '1.4' }}>
                  <li>Weighbridge slip is mandatory at dispatch and offloading stations.</li>
                  <li>Any shortage, damage, or spillage will be deducted directly from lorry balance.</li>
                  <li>Advance payment is strictly for diesel fuel and driver allowance.</li>
                </ol>
              </div>

              <div style={styles.signatureBlock}>
                {stampImg ? (
                  <img src={stampImg} alt="Authorized Stamp" style={{ height: '48px', marginBottom: '4px', objectFit: 'contain' }} />
                ) : selectedLoadingFormat === 1 ? (
                  /* Circular PAVAN stamp */
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '3px double #16a34a',
                    color: '#16a34a',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.55rem',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    transform: 'rotate(-8deg)',
                    padding: '4px',
                    lineHeight: '1.1',
                    margin: '0 auto 8px auto'
                  }}>
                    <span>Pavan</span>
                    <span style={{ fontSize: '0.45rem', borderTop: '1px solid #16a34a', paddingTop: '2px' }}>Carriers</span>
                    <span style={{ fontSize: '0.45rem', color: '#16cb4a' }}>APPROVED</span>
                  </div>
                ) : (
                  /* Green APPROVED card box */
                  <div style={{
                    border: '2px solid #10b981',
                    backgroundColor: '#f0fdf4',
                    color: '#047857',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    display: 'inline-block',
                    marginBottom: '8px',
                    transform: 'rotate(-2deg)'
                  }}>
                    ✓ APPROVED CARD<br/>
                    <span style={{ fontSize: '0.55rem', fontWeight: 'normal', color: '#065f46' }}>TRANSCORE LOGISTICS</span>
                  </div>
                )}
                <div style={styles.sigLine}></div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Authorized Signatory</span>
              </div>
            </div>

            <div style={styles.printControls}>
              <button className="btn btn-secondary" onClick={() => setPrintingSlip(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>Print Loading Slip</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Filter Options Modal (Screenshot 5) */}
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
                  {Array.from(new Set(slips.map(s => s.consignorName))).filter(Boolean).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label style={styles.formLabelPage}>Vehicle Number</label>
                <select className="form-control" style={{ height: '38px' }} value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)}>
                  <option>Select Vehicle No.</option>
                  {Array.from(new Set(slips.map(s => s.vehicleNumber))).filter(Boolean).map(vNum => (
                    <option key={vNum} value={vNum}>{vNum}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label style={styles.formLabelPage}>Loading Slip No.</label>
                <select className="form-control" style={{ height: '38px' }} value={filterSlipNo} onChange={(e) => setFilterSlipNo(e.target.value)}>
                  <option>Select Loading Slip No.</option>
                  {slips.map(s => (
                    <option key={s._id} value={s.slipNo}>{s.slipNo}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label style={styles.formLabelPage}>From Location</label>
                <select className="form-control" style={{ height: '38px' }} value={filterFromLoc} onChange={(e) => setFilterFromLoc(e.target.value)}>
                  <option>Select From Location</option>
                  {Array.from(new Set(slips.map(s => s.fromCity))).filter(Boolean).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label style={styles.formLabelPage}>To Location</label>
                <select className="form-control" style={{ height: '38px' }} value={filterToLoc} onChange={(e) => setFilterToLoc(e.target.value)}>
                  <option>Select To Location</option>
                  {Array.from(new Set(slips.map(s => s.toCity))).filter(Boolean).map(city => (
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
                <label style={styles.formLabelPage}>Bill Status</label>
                <select className="form-control" style={{ height: '38px' }} value={filterBillStatus} onChange={(e) => setFilterBillStatus(e.target.value)}>
                  <option>Select Bill Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button className="btn btn-secondary" style={{ padding: '8px 24px', marginRight: 'auto' }} onClick={() => {
                setFilterParty('Select Party Name');
                setFilterVehicle('Select Vehicle No.');
                setFilterSlipNo('Select Loading Slip No.');
                setFilterFromLoc('Select From Location');
                setFilterToLoc('Select To Location');
                setFilterFromDate('');
                setFilterToDate('');
                setFilterBillStatus('Select Bill Status');
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

  // Grid / empty state styles
  emptyCardState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '260px',
    textAlign: 'center'
  },
  paginationBtn: {
    border: 'none',
    borderRadius: '4px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '700'
  },
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
    color: '#f97316',
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

  // Action column triggers
  actions: {
    display: 'flex',
    gap: '6px'
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
  }
};
