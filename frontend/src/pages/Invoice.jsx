import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Printer, Home, ChevronDown, ChevronUp, X, Check, FileText } from 'lucide-react';
import InvoiceTemplate from '../components/templates/InvoiceTemplate';

export default function Invoice({ 
  invoices, bilties, customers, slips, vehicles, initialOpen,
  onCreateInvoice, onUpdateInvoice, onDeleteInvoice,
  headingColor, showInvoiceBank, invoiceHeading, logoImg, stampImg
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormPage, setShowFormPage] = useState(initialOpen || false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [printingInvoice, setPrintingInvoice] = useState(null);

  // High-Fidelity Creation Desk States
  const [activeTab, setActiveTab] = useState('Bilty'); // Bilty | LoadingSlip | Manual
  const [biltyParty, setBiltyParty] = useState('Select Bilty Party Name');
  const [loadingParty, setLoadingParty] = useState('Select Loading Slip Party Name');
  
  // Selections
  const [selectedBiltyNos, setSelectedBiltyNos] = useState([]);
  const [selectedSlipNos, setSelectedSlipNos] = useState([]);

  // Form Mode & Collapse states
  const [formMode, setFormMode] = useState('MANUAL'); // MANUAL | BILTY | LOADING SLIP
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  const [showTdsDetails, setShowTdsDetails] = useState(false);
  const [editBankDetails, setEditBankDetails] = useState(false);

  // 10 Filter States for main table search
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterParty, setFilterParty] = useState('Select Party Name');
  const [filterInvoiceNo, setFilterInvoiceNo] = useState('Select Invoice No.');
  const [filterFromLoc, setFilterFromLoc] = useState('Select From Location');
  const [filterToLoc, setFilterToLoc] = useState('Select To Location');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('Select Payment Status');

  // Report Modals States
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportFromDate, setReportFromDate] = useState('2026-05-01');
  const [reportToDate, setReportToDate] = useState('2026-05-13');

  const [gstModalOpen, setGstModalOpen] = useState(false);
  const [gstFromDate, setGstFromDate] = useState('2026-05-01');
  const [gstToDate, setGstToDate] = useState('2026-05-13');

  const [tdsModalOpen, setTdsModalOpen] = useState(false);
  const [tdsFromDate, setTdsFromDate] = useState('2026-05-01');
  const [tdsToDate, setTdsToDate] = useState('2026-05-13');

  const [unsettledModalOpen, setUnsettledModalOpen] = useState(false);
  const [unsettledParty, setUnsettledParty] = useState('Select Party Name');
  const [unsettledFromDate, setUnsettledFromDate] = useState('2026-05-01');
  const [unsettledToDate, setUnsettledToDate] = useState('2026-05-13');

  const [printingReport, setPrintingReport] = useState(null);

  // Invoice main fields state
  const [invoiceNo, setInvoiceNo] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [branchCode, setBranchCode] = useState('');
  const [financialYear, setFinancialYear] = useState('2026-2027');

  // Billing Party Details
  const [consignorName, setConsignorName] = useState('');
  const [consignorContact, setConsignorContact] = useState('');
  const [consignorGstin, setConsignorGstin] = useState('');
  const [consignorAddress, setConsignorAddress] = useState('');

  // Shipping Party Details
  const [consigneeName, setConsigneeName] = useState('');
  const [consigneeContact, setConsigneeContact] = useState('');
  const [consigneeGstin, setConsigneeGstin] = useState('');
  const [consigneeAddress, setConsigneeAddress] = useState('');

  // Bank Details State
  const [bankName, setBankName] = useState('HDFC BANK');
  const [accountHolder, setAccountHolder] = useState('TRANSCORE LOGISTICS');
  const [accountNumber, setAccountNumber] = useState('50200108804813');
  const [ifscCode, setIfscCode] = useState('HDFC0008785');
  const [panCardNo, setPanCardNo] = useState('CTSPG1070M');

  // Dynamic LR/GR dynamic list
  const [items, setItems] = useState([createEmptyItem()]);

  // Global totals state
  const [hsnCode, setHsnCode] = useState('3101');
  const [gstType, setGstType] = useState('Select GST Type'); // CGST + SGST | IGST | Exempt
  const [gstPercentage, setGstPercentage] = useState('Select GST Percentage'); // 5 | 12 | 18
  const [gstPayableBy, setGstPayableBy] = useState('Select Payable By'); // Consignor | Consignee | Transporter
  const [isReverseCharge, setIsReverseCharge] = useState(false);

  // TDS details
  const [tdsPercentage, setTdsPercentage] = useState(0);
  const [tdsAmount, setTdsAmount] = useState(0);

  // Reminder & Remarks
  const [totalAdvanceAmount, setTotalAdvanceAmount] = useState(0);
  const [netPayableAmount, setNetPayableAmount] = useState(0);
  const [reminderStartDate, setReminderStartDate] = useState('');
  const [reminderDays, setReminderDays] = useState('Select No. of Day(s)');
  const [remarks, setRemarks] = useState('');
  const [hideDatetime, setHideDatetime] = useState(false);

  // Canvas drawing reference for E-Signature pad
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState('');

  function createEmptyItem() {
    return {
      id: Math.random().toString(),
      lrNo: '',
      date: '',
      fromCity: '',
      toCity: '',
      materialName: '',
      weight: 0,
      unit: 'MT',
      rate: 0,
      fixedRate: true,
      freightAmount: 0,
      // Split vehicle inputs
      vPart1: '', vPart2: '', vPart3: '', vPart4: '',
      haltingCharge: 0,
      otherCharges: 0,
      shortageQty: 0,
      shortageUnit: 'MT',
      shortageAmt: 0,
      partyBillNo: '',
      partyBillDate: '',
      totalAmount: 0,
      advancePaid: 0,
      balanceAmount: 0
    };
  }

  // Sync initialOpen trigger from Sidebar sub-navigation
  useEffect(() => {
    if (initialOpen) {
      setEditingInvoice(null);
      setActiveTab('Bilty');
      setShowFormPage(true);
    } else {
      setShowFormPage(false);
      setEditingInvoice(null);
    }
  }, [initialOpen]);

  // Trigger when formPage opens
  useEffect(() => {
    if (showFormPage && !editingInvoice) {
      setInvoiceNo((invoices?.length + 1).toString());
      setDate(new Date().toISOString().split('T')[0]);
      setBranchCode('');
      setFinancialYear('2026-2027');
      setItems([createEmptyItem()]);
      setBiltyParty('Select Bilty Party Name');
      setLoadingParty('Select Loading Slip Party Name');
      setSelectedBiltyNos([]);
      setSelectedSlipNos([]);
      setGstType('Select GST Type');
      setGstPercentage('Select GST Percentage');
      setGstPayableBy('Select Payable By');
      setIsReverseCharge(false);
      setTdsPercentage(0);
      setTdsAmount(0);
      setRemarks('');
      setSignatureData('');
    }
  }, [showFormPage, editingInvoice, invoices]);

  // Canvas Drawing Logic
  useEffect(() => {
    if (showFormPage && activeTab === 'Manual' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
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
    // Sync canvas data to state
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

  // Safe Fallback document count generator
  const getBiltyCountForParty = (pName) => {
    return bilties.filter(b => b.consignorName === pName).length;
  };

  const getSlipCountForParty = (pName) => {
    return slips.filter(s => s.consignorName === pName).length;
  };

  // Toggle checklist selections
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

  // Append new item card
  const handleAddItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  // Remove dynamic item card
  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const nextItems = [...items];
    nextItems.splice(index, 1);
    setItems(nextItems);
  };

  // Sync calculations for specific item
  const handleItemFieldChange = (index, field, value) => {
    const nextItems = [...items];
    const item = { ...nextItems[index], [field]: value };
    
    // Auto calculations inside item
    const rate = Number(item.rate) || 0;
    const weight = Number(item.weight) || 0;
    const isFixed = item.fixedRate;
    
    const freightAmount = isFixed ? rate : (rate * weight);
    item.freightAmount = freightAmount;

    const halting = Number(item.haltingCharge) || 0;
    const others = Number(item.otherCharges) || 0;
    const shortageAmt = Number(item.shortageAmt) || 0;

    const totalAmount = freightAmount + halting + others - shortageAmt;
    item.totalAmount = totalAmount;

    const advance = Number(item.advancePaid) || 0;
    item.balanceAmount = totalAmount - advance;

    nextItems[index] = item;
    setItems(nextItems);
  };

  // Global calculations across all items in array
  const subtotalSum = items.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);
  const advanceSum = items.reduce((sum, item) => sum + (Number(item.advancePaid) || 0), 0);

  // Compute GST Amount
  let calculatedGst = 0;
  const pct = Number(gstPercentage);
  if (!isNaN(pct)) {
    calculatedGst = (subtotalSum * pct) / 100;
  }

  // Compute TDS Amount
  const tdsAmtComputed = (subtotalSum * (Number(tdsPercentage) || 0)) / 100;

  // Net payable amount
  // Grand total includes GST if not Reverse Charge
  const forwardGstAmount = isReverseCharge ? 0 : calculatedGst;
  const grandTotalComputed = subtotalSum + forwardGstAmount;
  const netDueComputed = grandTotalComputed - advanceSum - tdsAmtComputed;

  // Sync global summaries to state variables
  useEffect(() => {
    setTotalAdvanceAmount(advanceSum);
    setTdsAmount(tdsAmtComputed);
    setNetPayableAmount(netDueComputed);
  }, [subtotalSum, advanceSum, calculatedGst, isReverseCharge, tdsAmtComputed, netDueComputed]);

  // Proceed handler for Bilty or Loading Slip tab
  const handleProceedWithSelections = () => {
    if (activeTab === 'Bilty') {
      const selected = bilties.filter(b => selectedBiltyNos.includes(b.biltyNo));
      if (selected.length === 0) return;
      
      // Auto-populate customer metadata from first selected bilty
      setConsignorName(selected[0].consignorName || '');
      setConsignorContact(selected[0].consignorContact || '');
      setConsignorGstin(selected[0].consignorGstin || '');
      setConsignorAddress(selected[0].consignorAddress || '');

      setConsigneeName(selected[0].consigneeName || '');
      setConsigneeContact(selected[0].consigneeContact || '');
      setConsigneeGstin(selected[0].consigneeGstin || '');
      setConsigneeAddress(selected[0].deliveryAddress || selected[0].consigneeAddress || '');

      // Load Bilty parameters into items list
      const loadedItems = selected.map(b => {
        const parts = (b.vehicleNumber || '').split('-');
        return {
          id: Math.random().toString(),
          lrNo: b.biltyNo,
          date: b.date,
          fromCity: b.fromCity,
          toCity: b.toCity,
          materialName: b.materialName || 'Agricultural Chemical Bags',
          weight: Number(b.actualWeight) || 0,
          unit: b.unit || 'Tons',
          rate: Number(b.rate) || 0,
          fixedRate: b.fixedRate,
          freightAmount: b.fixedRate ? Number(b.rate) : (Number(b.rate) * Number(b.actualWeight)),
          vPart1: parts[0] || '', vPart2: parts[1] || '', vPart3: parts[2] || '', vPart4: parts[3] || '',
          haltingCharge: Number(b.haltingCharge) || 0,
          otherCharges: Number(b.otherCharges) || 0,
          shortageQty: 0,
          shortageUnit: 'MT',
          shortageAmt: 0,
          partyBillNo: b.invoiceNumber || '',
          partyBillDate: b.invoiceDate || '',
          totalAmount: Number(b.totalFreight) || 0,
          advancePaid: Number(b.advancePaid) || 0,
          balanceAmount: Number(b.balanceAmount) || 0
        };
      });
      setItems(loadedItems);
      setFormMode('BILTY');
    } else if (activeTab === 'LoadingSlip') {
      const selected = slips.filter(s => selectedSlipNos.includes(s.slipNo));
      if (selected.length === 0) return;

      setConsignorName(selected[0].consignorName || '');
      setConsignorContact(selected[0].consignorContact || '');
      setConsignorGstin(selected[0].consignorGstin || '');
      setConsignorAddress(selected[0].consignorAddress || '');

      const loadedItems = selected.map(s => {
        const parts = (s.vehicleNumber || '').split('-');
        return {
          id: Math.random().toString(),
          lrNo: s.slipNo,
          date: s.date,
          fromCity: s.fromCity,
          toCity: s.toCity,
          materialName: s.goodsDescription || 'Consignment Cargo',
          weight: Number(s.actualWeight) || 0,
          unit: s.unit || 'MT',
          rate: Number(s.rate) || 0,
          fixedRate: s.fixedRate,
          freightAmount: s.fixedRate ? Number(s.rate) : (Number(s.rate) * Number(s.actualWeight)),
          vPart1: parts[0] || '', vPart2: parts[1] || '', vPart3: parts[2] || '', vPart4: parts[3] || '',
          haltingCharge: Number(s.haltingCharge) || 0,
          otherCharges: Number(s.otherCharges) || 0,
          shortageQty: 0,
          shortageUnit: 'MT',
          shortageAmt: 0,
          partyBillNo: '',
          partyBillDate: '',
          totalAmount: Number(s.totalFreight) || 0,
          advancePaid: Number(s.driverAdvance) || 0,
          balanceAmount: Number(s.balance) || 0
        };
      });
      setItems(loadedItems);
      setFormMode('LOADING SLIP');
    }
    setActiveTab('Manual'); // Switch directly to Manual form rendering but populated!
  };

  const handleOpenEdit = (inv) => {
    setEditingInvoice(inv);
    setInvoiceNo(inv.invoiceNo);
    setDate(inv.date);
    setBranchCode(inv.branchCode || '');
    setFinancialYear(inv.financialYear || '2026-2027');

    setConsignorName(inv.customerName || '');
    setConsignorContact(inv.consignorContact || '');
    setConsignorGstin(inv.consignorGstin || '');
    setConsignorAddress(inv.consignorAddress || '');

    setConsigneeName(inv.consigneeName || '');
    setConsigneeContact(inv.consigneeContact || '');
    setConsigneeGstin(inv.consigneeGstin || '');
    setConsigneeAddress(inv.consigneeAddress || '');

    setBankName(inv.bankName || 'HDFC BANK');
    setAccountHolder(inv.accountHolder || 'TRANSCORE LOGISTICS');
    setAccountNumber(inv.accountNumber || '50200108804813');
    setIfscCode(inv.ifscCode || 'HDFC0008785');
    setPanCardNo(inv.panCardNo || 'CTSPG1070M');

    setItems(inv.items || [createEmptyItem()]);
    setHsnCode(inv.hsnCode || '3101');
    setGstType(inv.gstType || 'Select GST Type');
    setGstPercentage(inv.gstPercentage || 'Select GST Percentage');
    setGstPayableBy(inv.gstPayableBy || 'Select Payable By');
    setIsReverseCharge(inv.isReverseCharge || false);
    setTdsPercentage(inv.tdsPercentage || 0);
    setTdsAmount(inv.tdsAmount || 0);
    setRemarks(inv.remarks || '');
    setSignatureData(inv.signatureData || '');
    
    setFormMode('MANUAL');
    setActiveTab('Manual');
    setShowFormPage(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!consignorName) {
      alert('Billing Customer Party Name is required.');
      return;
    }

    const payload = {
      invoiceNo,
      date,
      branchCode,
      financialYear,
      customerName: consignorName,
      consignorContact,
      consignorGstin,
      consignorAddress,
      consigneeName,
      consigneeContact,
      consigneeGstin,
      consigneeAddress,
      bankName,
      accountHolder,
      accountNumber,
      ifscCode,
      panCardNo,
      items: items.map(item => {
        const compiledVNum = item.vPart1 ? `${item.vPart1.toUpperCase()}-${item.vPart2.toUpperCase()}-${item.vPart3.toUpperCase()}-${item.vPart4.toUpperCase()}` : '';
        return {
          ...item,
          vehicleNumber: compiledVNum || item.lrNo // fallback
        };
      }),
      hsnCode,
      gstType,
      gstPercentage,
      gstPayableBy,
      isReverseCharge,
      gstAmount: calculatedGst,
      tdsPercentage,
      tdsAmount,
      totalFreight: subtotalSum,
      grandTotal: grandTotalComputed,
      amountPaid: totalAdvanceAmount,
      balance: netPayableAmount,
      dueDate: reminderStartDate,
      reminderDays,
      remarks,
      hideDatetime,
      signatureData
    };

    if (editingInvoice) {
      onUpdateInvoice(editingInvoice._id, payload);
    } else {
      onCreateInvoice(payload);
    }
    setShowFormPage(false);
  };

  const handleDownloadReport = (type, fromDate, toDate, partyName = '') => {
    let reportData = invoices;

    if (fromDate) {
      reportData = reportData.filter(inv => inv.date >= fromDate);
    }
    if (toDate) {
      reportData = reportData.filter(inv => inv.date <= toDate);
    }

    if (partyName && partyName !== 'Select Party Name' && partyName !== '') {
      reportData = reportData.filter(inv => inv.customerName === partyName);
    }

    if (type === 'UNSETTLED') {
      reportData = reportData.filter(inv => (Number(inv.balance) || 0) > 0);
    }

    setPrintingReport({
      type,
      data: reportData,
      fromDate,
      toDate,
      partyName
    });

    setReportModalOpen(false);
    setGstModalOpen(false);
    setTdsModalOpen(false);
    setUnsettledModalOpen(false);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterParty !== 'Select Party Name' && inv.customerName !== filterParty) return false;
    if (filterInvoiceNo !== 'Select Invoice No.' && `INV-${inv.invoiceNo}` !== filterInvoiceNo) return false;
    if (filterFromLoc && inv.items?.every(item => item.fromCity !== filterFromLoc)) return false;
    if (filterToLoc && inv.items?.every(item => item.toCity !== filterToLoc)) return false;
    if (filterFromDate && inv.date < filterFromDate) return false;
    if (filterToDate && inv.date > filterToDate) return false;
    if (filterStatus !== 'Select Payment Status') {
      const isPaid = (Number(inv.balance) || 0) === 0;
      if (filterStatus === 'Paid' && !isPaid) return false;
      if (filterStatus === 'Pending' && isPaid) return false;
    }

    return matchesSearch;
  });

  return (
    <div style={styles.container}>
      
      {/* 1. Invoices card list view */}
      {!showFormPage && (
        <>
          <div style={styles.header} className="print-hidden">
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('dashboard')} />
              <span style={{ cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('dashboard')}>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingInvoice(null); if (setActivePage) setActivePage('invoice'); }}>Invoice</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>Invoice List</span>
            </div>
          </div>

          <div style={styles.mainCard} className="print-hidden">
            <div style={styles.cardHeaderRow}>
              <h2 style={styles.cardTitle}>Invoice List ({filteredInvoices.length})</h2>
              
              <div style={styles.actionsBar}>
                <button style={styles.reportActionBtn} onClick={() => setReportModalOpen(true)}>Report</button>
                <button style={styles.reportActionBtn} onClick={() => setGstModalOpen(true)}>GST Report</button>
                <button style={styles.reportActionBtn} onClick={() => setTdsModalOpen(true)}>TDS Report</button>
                <button style={styles.reportActionBtn} onClick={() => setUnsettledModalOpen(true)}>Unsettled Bill Report</button>
                <button style={styles.reportActionBtn} onClick={() => setFilterModalOpen(true)}>Filter</button>
                <button style={styles.reportActionBtn} onClick={() => {
                  setEditingInvoice(null);
                  setActiveTab('Bilty');
                  setShowFormPage(true);
                }}>Create New Invoice</button>
              </div>
            </div>

            {filteredInvoices.length === 0 ? (
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
                      <th>Invoice No</th>
                      <th>Date</th>
                      <th>Billing Party Name</th>
                      <th>Subtotal</th>
                      <th>GST Amount</th>
                      <th>Total Value</th>
                      <th>Advance Paid</th>
                      <th>Net Balance Due</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((inv, idx) => (
                      <tr key={inv._id}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: '700', color: '#0066cc' }}>INV-{inv.invoiceNo}</td>
                        <td>{inv.date}</td>
                        <td style={{ fontWeight: '700' }}>{inv.customerName}</td>
                        <td>₹{inv.totalFreight || 0}/-</td>
                        <td>₹{inv.gstAmount || 0}/-</td>
                        <td style={{ fontWeight: '700' }}>₹{inv.grandTotal || 0}/-</td>
                        <td style={{ color: '#16a34a', fontWeight: '600' }}>₹{inv.amountPaid || 0}/-</td>
                        <td style={{ color: '#ef4444', fontWeight: '800' }}>₹{inv.balance || 0}/-</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button style={styles.actionBtn} onClick={() => handleOpenEdit(inv)} title="Edit"><Edit2 size={12} /></button>
                            <button style={styles.actionPrintBtn} onClick={() => setPrintingInvoice(inv)} title="Print Memo"><Printer size={12} /></button>
                            <button style={styles.actionDeleteBtn} onClick={() => onDeleteInvoice(inv._id)} title="Delete"><Trash2 size={12} /></button>
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

      {/* 2. Consolidated Invoice creation Desk (Screenshot 1 & 2) */}
      {showFormPage && activeTab !== 'Manual' && (
        <div style={styles.container} className="print-hidden">
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingInvoice(null); if (setActivePage) setActivePage('dashboard'); }} />
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingInvoice(null); if (setActivePage) setActivePage('dashboard'); }}>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingInvoice(null); }}>Invoice</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>Create New Invoice</span>
            </div>
            <button style={styles.backToListBtn} onClick={() => setShowFormPage(false)}>Invoice List</button>
          </div>

          <div style={styles.formCard}>
            <h2 style={styles.modalTitle}>Create Invoice</h2>

            <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '600', marginBottom: '24px' }}>
              Create Invoice Using :<br/>
              <span style={{ fontSize: '0.75rem', fontWeight: '500', display: 'block', marginTop: '4px' }}>
                ( NOTE: If you want to create Invoice using Bilty or Loading Slip, first select Party name and then select it's Bilty or Loading Slip and then proceed. )
              </span>
            </div>

            {/* Custom Tab Toggles matching Screenshots */}
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
                }}
              >
                Manual
              </button>
            </div>

            {/* A: Bilty tab selector block */}
            {activeTab === 'Bilty' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Party Name *</label>
                  <select 
                    className="form-control" 
                    style={{ height: '40px' }}
                    value={biltyParty}
                    onChange={(e) => {
                      setBiltyParty(e.target.value);
                      setSelectedBiltyNos([]);
                    }}
                  >
                    <option>Select Bilty Party Name</option>
                    {Array.from(new Set(bilties.map(b => b.consignorName))).filter(Boolean).map(name => (
                      <option key={name} value={name}>{name} (Bilties: {getBiltyCountForParty(name)})</option>
                    ))}
                  </select>
                </div>

                {biltyParty !== 'Select Bilty Party Name' && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                    <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ width: '50px' }}>Select</th>
                          <th>Bilty No.</th>
                          <th>Date</th>
                          <th>Route</th>
                          <th>Vehicle Number</th>
                          <th>Goods Value</th>
                          <th>Freight Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bilties.filter(b => b.consignorName === biltyParty).map(b => {
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
                              <td>₹{b.valueOfGoods || 0}/-</td>
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
                    Selected Invoice List: {selectedBiltyNos.length}
                  </span>
                  <button 
                    type="button"
                    style={{ ...styles.greenActionBtn, opacity: selectedBiltyNos.length === 0 ? 0.6 : 1, cursor: selectedBiltyNos.length === 0 ? 'not-allowed' : 'pointer' }}
                    disabled={selectedBiltyNos.length === 0}
                    onClick={handleProceedWithSelections}
                  >
                    Proceed to Generate Bill/Invoice
                  </button>
                </div>
              </div>
            )}

            {/* B: Loading Slip tab selector block */}
            {activeTab === 'LoadingSlip' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Party Name *</label>
                  <select 
                    className="form-control" 
                    style={{ height: '40px' }}
                    value={loadingParty}
                    onChange={(e) => {
                      setLoadingParty(e.target.value);
                      setSelectedSlipNos([]);
                    }}
                  >
                    <option>Select Loading Slip Party Name</option>
                    {Array.from(new Set(slips.map(s => s.consignorName))).filter(Boolean).map(name => (
                      <option key={name} value={name}>{name} (Slips: {getSlipCountForParty(name)})</option>
                    ))}
                  </select>
                </div>

                {loadingParty !== 'Select Loading Slip Party Name' && (
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
                          <th>Net Freight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slips.filter(s => s.consignorName === loadingParty).map(s => {
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
                    Selected Invoice List: {selectedSlipNos.length}
                  </span>
                  <button 
                    type="button"
                    style={{ ...styles.greenActionBtn, opacity: selectedSlipNos.length === 0 ? 0.6 : 1, cursor: selectedSlipNos.length === 0 ? 'not-allowed' : 'pointer' }}
                    disabled={selectedSlipNos.length === 0}
                    onClick={handleProceedWithSelections}
                  >
                    Proceed to Generate Bill/Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. High-Fidelity Manual & Proceeded Form (Screenshot 3, 4, 5) */}
      {showFormPage && activeTab === 'Manual' && (
        <div style={styles.container} className="print-hidden">
          <div style={styles.header}>
            <div style={styles.breadcrumbs}>
              <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingInvoice(null); if (setActivePage) setActivePage('dashboard'); }} />
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingInvoice(null); if (setActivePage) setActivePage('dashboard'); }}>Home</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={{ cursor: 'pointer' }} onClick={() => { setShowFormPage(false); setEditingInvoice(null); }}>Invoice</span>
              <span style={styles.breadcrumbSeparator}>&gt;</span>
              <span style={styles.breadcrumbActive}>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</span>
            </div>
            <button 
              style={styles.backToListBtn} 
              onClick={() => {
                setShowFormPage(false);
                setEditingInvoice(null);
              }}
            >
              Invoice List
            </button>
          </div>

          <div style={styles.formCard}>
            <h2 style={styles.modalTitle}>Invoice Form</h2>

            <div style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '24px', textTransform: 'uppercase' }}>
              Create Bill / Invoice Using : {formMode}
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={styles.formGridPage}>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Invoice No *</label>
                    <input 
                      type="text" required style={styles.formInputPage}
                      value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bill Generate Date *</label>
                    <input 
                      type="date" required style={styles.formInputPage}
                      value={date} onChange={(e) => setDate(e.target.value)}
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

                {/* Billing Company (Party) Details */}
                <h4 style={styles.subHeading}>Billing Company (Party) Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                    <label style={styles.formLabelPage}>Party Name *</label>
                    {formMode === 'MANUAL' ? (
                      <select 
                        className="form-control" style={{ height: '40px' }} required
                        value={consignorName} 
                        onChange={(e) => {
                          const cust = customers.find(c => c.name === e.target.value) || {};
                          setConsignorName(e.target.value);
                          setConsignorContact(cust.phone || '');
                          setConsignorGstin(cust.gstin || '');
                          setConsignorAddress(cust.address || '');
                        }}
                      >
                        <option value="">-- Choose Party --</option>
                        {customers.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                      </select>
                    ) : (
                      <input 
                        type="text" required style={styles.formInputPage} disabled
                        value={consignorName}
                      />
                    )}
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Contact Number</label>
                    <input 
                      type="text" style={styles.formInputPage} placeholder="Contact Number"
                      value={consignorContact} onChange={(e) => setConsignorContact(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>GSTIN</label>
                    <input 
                      type="text" style={styles.formInputPage} placeholder="GSTIN"
                      value={consignorGstin} onChange={(e) => setConsignorGstin(e.target.value)}
                    />
                  </div>
                </div>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Address</label>
                  <textarea 
                    style={styles.formTextareaPage} placeholder="Address"
                    value={consignorAddress} onChange={(e) => setConsignorAddress(e.target.value)}
                  />
                  <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                </div>

                {/* Collapsible Shipping Details */}
                <div 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', marginTop: '10px' }}
                  onClick={() => setShowShippingDetails(!showShippingDetails)}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
                    Shipping Company (Party) Details
                  </span>
                  {showShippingDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {showShippingDetails && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={styles.formGridRowPage}>
                      <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                        <label style={styles.formLabelPage}>Shipping Party Name</label>
                        <select 
                          className="form-control" style={{ height: '40px' }}
                          value={consigneeName}
                          onChange={(e) => {
                            const cust = customers.find(c => c.name === e.target.value) || {};
                            setConsigneeName(e.target.value);
                            setConsigneeContact(cust.phone || '');
                            setConsigneeGstin(cust.gstin || '');
                            setConsigneeAddress(cust.address || '');
                          }}
                        >
                          <option value="">-- Choose Shipping Party --</option>
                          {customers.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Shipping Contact</label>
                        <input type="text" style={styles.formInputPage} placeholder="Contact Number" value={consigneeContact} onChange={(e) => setConsigneeContact(e.target.value)} />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Shipping GSTIN</label>
                        <input type="text" style={styles.formInputPage} placeholder="GSTIN" value={consigneeGstin} onChange={(e) => setConsigneeGstin(e.target.value)} />
                      </div>
                    </div>
                    <div style={styles.formGroupPage}>
                      <label style={styles.formLabelPage}>Shipping Address</label>
                      <textarea style={styles.formTextareaPage} placeholder="Address" value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} />
                    </div>
                  </div>
                )}

                {/* Bank Details */}
                <h4 style={styles.subHeading}>Bank Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Bank Name</label>
                    <input 
                      type="text" style={styles.formInputPage} disabled={!editBankDetails}
                      value={bankName} onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Account Holder Name</label>
                    <input 
                      type="text" style={styles.formInputPage} disabled={!editBankDetails}
                      value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Account Number</label>
                    <input 
                      type="text" style={styles.formInputPage} disabled={!editBankDetails}
                      value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>IFSC Code</label>
                    <input 
                      type="text" style={styles.formInputPage} disabled={!editBankDetails}
                      value={ifscCode} onChange={(e) => setIfscCode(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                    <label style={styles.formLabelPage}>PAN Card No</label>
                    <input 
                      type="text" style={styles.formInputPage} disabled={!editBankDetails}
                      value={panCardNo} onChange={(e) => setPanCardNo(e.target.value)}
                    />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 0.6, marginTop: '24px' }}>
                    <button 
                      type="button" 
                      style={{ ...styles.actionBtnBlueFilled, width: '100%', height: '40px' }}
                      onClick={() => setEditBankDetails(!editBankDetails)}
                    >
                      {editBankDetails ? 'Lock' : 'Edit'}
                    </button>
                  </div>
                </div>

                {/* Dynamic LR/GR Consignment Array Cards */}
                <h4 style={styles.subHeading}>LR/GR Details</h4>
                {items.map((item, index) => (
                  <div key={item.id} style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', background: '#f8fafc', marginBottom: '16px', position: 'relative' }}>
                    {items.length > 1 && (
                      <button 
                        type="button" 
                        style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#fee2e2', color: '#ef4444', padding: '4px', borderRadius: '50%', cursor: 'pointer' }}
                        onClick={() => handleRemoveItem(index)}
                      >
                        <X size={14} />
                      </button>
                    )}
                    <h5 style={{ color: '#0066cc', fontSize: '0.8rem', fontWeight: '800', marginBottom: '16px', textTransform: 'uppercase' }}>LR Item #{index + 1}</h5>
                    
                    <div style={styles.formGridRowPage}>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Enter LR/GR Number *</label>
                        <input 
                          type="text" required style={styles.formInputPage} placeholder="Enter LR/GR Number"
                          value={item.lrNo} onChange={(e) => handleItemFieldChange(index, 'lrNo', e.target.value)}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Date</label>
                        <input 
                          type="date" style={styles.formInputPage}
                          value={item.date} onChange={(e) => handleItemFieldChange(index, 'date', e.target.value)}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>From</label>
                        <input 
                          type="text" style={styles.formInputPage} placeholder="From Location"
                          value={item.fromCity} onChange={(e) => handleItemFieldChange(index, 'fromCity', e.target.value)}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>To</label>
                        <input 
                          type="text" style={styles.formInputPage} placeholder="To Location"
                          value={item.toCity} onChange={(e) => handleItemFieldChange(index, 'toCity', e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={styles.formGridRowPage}>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Material Name</label>
                        <input 
                          type="text" style={styles.formInputPage} placeholder="Material Name"
                          value={item.materialName} onChange={(e) => handleItemFieldChange(index, 'materialName', e.target.value)}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 0.8 }}>
                        <label style={styles.formLabelPage}>Weight</label>
                        <input 
                          type="number" style={styles.formInputPage} placeholder="Weight"
                          value={item.weight} onChange={(e) => handleItemFieldChange(index, 'weight', Number(e.target.value))}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 0.6 }}>
                        <label style={styles.formLabelPage}>Unit</label>
                        <select 
                          className="form-control" style={{ height: '40px' }}
                          value={item.unit} onChange={(e) => handleItemFieldChange(index, 'unit', e.target.value)}
                        >
                          <option value="MT">MT</option>
                          <option value="Kgs">Kgs</option>
                          <option value="Boxes">Boxes</option>
                        </select>
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 0.8 }}>
                        <label style={styles.formLabelPage}>Rate</label>
                        <input 
                          type="number" style={styles.formInputPage} placeholder="Rate"
                          value={item.rate} onChange={(e) => handleItemFieldChange(index, 'rate', Number(e.target.value))}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 0.4, marginTop: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={item.fixedRate} onChange={(e) => handleItemFieldChange(index, 'fixedRate', e.target.checked)} /> FIXED
                        </label>
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Freight Amount</label>
                        <input 
                          type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} placeholder="Freight Amount"
                          value={item.freightAmount}
                        />
                      </div>
                    </div>

                    <div style={styles.formGridRowPage}>
                      <div style={{ ...styles.formGroupPage, flex: 1.6 }}>
                        <label style={styles.formLabelPage}>Vehicle Number *</label>
                        <div style={styles.quadInputRow}>
                          <input type="text" maxLength="2" style={styles.quadInputBox} placeholder="XX" value={item.vPart1} onChange={(e) => handleItemFieldChange(index, 'vPart1', e.target.value)} />
                          <input type="text" maxLength="2" style={styles.quadInputBox} placeholder="XX" value={item.vPart2} onChange={(e) => handleItemFieldChange(index, 'vPart2', e.target.value)} />
                          <input type="text" maxLength="2" style={styles.quadInputBox} placeholder="XX" value={item.vPart3} onChange={(e) => handleItemFieldChange(index, 'vPart3', e.target.value)} />
                          <input type="text" maxLength="4" style={styles.quadInputBox} placeholder="XXXX" value={item.vPart4} onChange={(e) => handleItemFieldChange(index, 'vPart4', e.target.value)} />
                        </div>
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Halting Charges</label>
                        <input 
                          type="number" style={styles.formInputPage} placeholder="Halting Charges"
                          value={item.haltingCharge} onChange={(e) => handleItemFieldChange(index, 'haltingCharge', Number(e.target.value))}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Other Charges</label>
                        <input 
                          type="number" style={styles.formInputPage} placeholder="Other Charges"
                          value={item.otherCharges} onChange={(e) => handleItemFieldChange(index, 'otherCharges', Number(e.target.value))}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Shortage Qty.</label>
                        <input 
                          type="number" style={styles.formInputPage} placeholder="Shortage Qty."
                          value={item.shortageQty} onChange={(e) => handleItemFieldChange(index, 'shortageQty', Number(e.target.value))}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 0.8 }}>
                        <label style={styles.formLabelPage}>Unit</label>
                        <select 
                          className="form-control" style={{ height: '40px' }}
                          value={item.shortageUnit} onChange={(e) => handleItemFieldChange(index, 'shortageUnit', e.target.value)}
                        >
                          <option value="MT">MT</option>
                          <option value="Kgs">Kgs</option>
                        </select>
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Shortage Amt.</label>
                        <input 
                          type="number" style={styles.formInputPage} placeholder="Shortage Amt."
                          value={item.shortageAmt} onChange={(e) => handleItemFieldChange(index, 'shortageAmt', Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div style={styles.formGridRowPage}>
                      <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                        <label style={styles.formLabelPage}>Bill/Invoice Number</label>
                        <input 
                          type="text" style={styles.formInputPage} placeholder="Party Bill/Invoice Number"
                          value={item.partyBillNo} onChange={(e) => handleItemFieldChange(index, 'partyBillNo', e.target.value)}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Bill/Invoice Date</label>
                        <input 
                          type="date" style={styles.formInputPage}
                          value={item.partyBillDate} onChange={(e) => handleItemFieldChange(index, 'partyBillDate', e.target.value)}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Total Amount</label>
                        <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={item.totalAmount} />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Advance Amount</label>
                        <input 
                          type="number" style={styles.formInputPage} placeholder="Advance Amount"
                          value={item.advancePaid} onChange={(e) => handleItemFieldChange(index, 'advancePaid', Number(e.target.value))}
                        />
                      </div>
                      <div style={{ ...styles.formGroupPage, flex: 1 }}>
                        <label style={styles.formLabelPage}>Balance Amount</label>
                        <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={item.balanceAmount} />
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  type="button" 
                  style={styles.actionBtnBlueFilled}
                  onClick={handleAddItem}
                >
                  + Add More
                </button>

                {/* Global Freight Details */}
                <h4 style={styles.subHeading}>Freight Details</h4>
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Total Amount</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={subtotalSum} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>HSN Code</label>
                    <input 
                      type="text" style={styles.formInputPage} placeholder="Enter HSN Code"
                      value={hsnCode} onChange={(e) => setHsnCode(e.target.value)}
                    />
                  </div>
                </div>

                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>GST Type</label>
                    <select 
                      className="form-control" style={{ height: '40px' }}
                      value={gstType} onChange={(e) => setGstType(e.target.value)}
                    >
                      <option value="Select GST Type">Select GST Type</option>
                      <option value="CGST + SGST">CGST + SGST</option>
                      <option value="IGST">IGST</option>
                      <option value="Exempt">Exempt</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>GST Percentage</label>
                    <select 
                      className="form-control" style={{ height: '40px' }}
                      value={gstPercentage} onChange={(e) => setGstPercentage(e.target.value)}
                    >
                      <option value="Select GST Percentage">Select GST Percentage</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>GST Payable By</label>
                    <select 
                      className="form-control" style={{ height: '40px' }}
                      value={gstPayableBy} onChange={(e) => setGstPayableBy(e.target.value)}
                    >
                      <option value="Select Payable By">Select Payable By</option>
                      <option value="Consignor">Consignor</option>
                      <option value="Consignee">Consignee</option>
                      <option value="Transporter">Transporter</option>
                    </select>
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Total Invoice Value (with GST) *</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={grandTotalComputed} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', margin: '8px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#b91c1c', fontWeight: '700' }}>
                    <input type="checkbox" checked={isReverseCharge} onChange={(e) => setIsReverseCharge(e.target.checked)} /> GST ON REVERSE CHARGE
                  </label>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569' }}>
                    GST Amount : <span style={{ color: '#0066cc' }}>₹{calculatedGst.toFixed(0)}/-</span>
                  </span>
                </div>

                {/* Collapsible TDS details */}
                <div 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', marginTop: '10px' }}
                  onClick={() => setShowTdsDetails(!showTdsDetails)}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
                    TDS Details
                  </span>
                  {showTdsDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {showTdsDetails && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ ...styles.formGroupPage, flex: 1 }}>
                      <label style={styles.formLabelPage}>TDS Percentage (%)</label>
                      <input 
                        type="number" style={styles.formInputPage} placeholder="Ex: 2"
                        value={tdsPercentage} onChange={(e) => setTdsPercentage(Number(e.target.value))}
                      />
                    </div>
                    <div style={{ ...styles.formGroupPage, flex: 1 }}>
                      <label style={styles.formLabelPage}>TDS Deducted Amount</label>
                      <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={tdsAmount} />
                    </div>
                  </div>
                )}

                {/* Global Adv & Net Payable */}
                <div style={styles.formGridRowPage}>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Total Advance Amount *</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={totalAdvanceAmount} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Net Payable Amount *</label>
                    <input type="number" disabled style={{ ...styles.formInputPage, backgroundColor: '#f1f5f9' }} value={netPayableAmount} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Reminder Start Date</label>
                    <input type="date" style={styles.formInputPage} value={reminderStartDate} onChange={(e) => setReminderStartDate(e.target.value)} />
                  </div>
                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Set Reminder for</label>
                    <select 
                      className="form-control" style={{ height: '40px' }}
                      value={reminderDays} onChange={(e) => setReminderDays(e.target.value)}
                    >
                      <option value="Select No. of Day(s)">Select No. of Day(s)</option>
                      <option value="7">7 Days</option>
                      <option value="15">15 Days</option>
                      <option value="30">30 Days</option>
                    </select>
                  </div>
                </div>

                {/* Remarks & Stamp upload drawers */}
                <h4 style={styles.subHeading}>Other Remarks</h4>
                <div style={styles.formGroupPage}>
                  <label style={styles.formLabelPage}>Remarks</label>
                  <textarea 
                    style={styles.formTextareaPage} placeholder="Other Remarks"
                    value={remarks} onChange={(e) => setRemarks(e.target.value)}
                  />
                  <span style={styles.warningText}>Please Avoid using Special Characters.</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                  <input type="checkbox" checked={hideDatetime} onChange={(e) => setHideDatetime(e.target.checked)} />
                  <label style={{ fontSize: '0.85rem' }}>Hide Generated Datetime from PDF</label>
                </div>

                {/* E-Signature Drawing Canvas (Screenshot 5) */}
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

                  <div style={{ ...styles.formGroupPage, flex: 1 }}>
                    <label style={styles.formLabelPage}>Previous E-Signature (TRANSPORTER APPROVAL STAMP)</label>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                      {stampImg ? (
                        <img src={stampImg} alt="Stamp" style={{ height: '90px', objectFit: 'contain' }} />
                      ) : (
                        /* Default Vector stamp */
                        <div style={{
                          border: '3px double #0066cc',
                          color: '#0066cc',
                          borderRadius: '50%',
                          width: '100px',
                          height: '100px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.6rem',
                          textTransform: 'uppercase',
                          transform: 'rotate(-4deg)',
                          padding: '6px',
                          textAlign: 'center',
                          lineHeight: '1.2'
                        }}>
                          <span>TRANSCORE</span>
                          <span style={{ fontSize: '0.45rem', borderTop: '1px solid #0066cc', paddingTop: '2px', marginTop: '2px' }}>LOGISTICS</span>
                          <span style={{ fontSize: '0.45rem', color: '#ef4444' }}>APPROVED</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              <div style={styles.greenButtonContainer}>
                <button type="submit" style={styles.greenActionBtn}>
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Beautiful Print ready Tax Invoice layout */}
      {printingInvoice && (
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
            <InvoiceTemplate 
              data={printingInvoice} 
              company={{ 
                companyName: 'TRANSCORE LOGISTICS', 
                address: 'Kanpur Nagar, Uttar Pradesh, India', 
                mobile: '9664874523', 
                pan: 'CTSPG1070M', 
                gstin: '24CTSPG1070M1ZF', 
                logo_img: logoImg, 
                stamp_img: stampImg, 
                heading_color: headingColor 
              }} 
            />

            <div style={styles.printControls}>
              <button className="btn btn-secondary" onClick={() => setPrintingInvoice(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>Print Invoice</button>
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
                <div style={{ flex: 1, minWidth: '180px' }} className="form-group">
                  <label style={styles.formLabelPage}>Party Name</label>
                  <select className="form-control" style={{ height: '38px' }} value={filterParty} onChange={(e) => setFilterParty(e.target.value)}>
                    <option>Select Party Name</option>
                    {Array.from(new Set(invoices.map(i => i.customerName))).filter(Boolean).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '180px' }} className="form-group">
                  <label style={styles.formLabelPage}>Invoice No.</label>
                  <select className="form-control" style={{ height: '38px' }} value={filterInvoiceNo} onChange={(e) => setFilterInvoiceNo(e.target.value)}>
                    <option>Select Invoice No.</option>
                    {invoices.map(inv => (
                      <option key={inv._id} value={`INV-${inv.invoiceNo}`}>INV-{inv.invoiceNo}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }} className="form-group">
                  <label style={styles.formLabelPage}>From Date</label>
                  <input type="date" className="form-control" style={{ height: '38px' }} value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }} className="form-group">
                  <label style={styles.formLabelPage}>To Date</label>
                  <input type="date" className="form-control" style={{ height: '38px' }} value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} />
                </div>
                <div style={{ flex: 1, minWidth: '180px' }} className="form-group">
                  <label style={styles.formLabelPage}>Payment Status</label>
                  <select className="form-control" style={{ height: '38px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option>Select Payment Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button className="btn btn-secondary" style={{ padding: '8px 24px', marginRight: 'auto' }} onClick={() => {
                setFilterParty('Select Party Name');
                setFilterInvoiceNo('Select Invoice No.');
                setFilterFromDate('');
                setFilterToDate('');
                setFilterStatus('Select Payment Status');
              }}>Reset</button>
              <button className="btn btn-primary" style={{ backgroundColor: '#00b050', border: 'none', padding: '8px 24px', fontWeight: '700' }} onClick={() => setFilterModalOpen(false)}>Search</button>
              <button className="btn btn-secondary" style={{ padding: '8px 24px' }} onClick={() => setFilterModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* TDS Report Modal */}
      {tdsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '90%', maxWidth: '600px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontWeight: '800', color: '#ef4444', fontSize: '1.1rem' }}>TDS Report Options</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setTdsModalOpen(false)} />
            </div>
            <div className="form-grid" style={{ fontSize: '0.85rem', display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }} className="form-group">
                <label style={styles.formLabelPage}>From Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={tdsFromDate} onChange={(e) => setTdsFromDate(e.target.value)} />
              </div>
              <div style={{ flex: 1 }} className="form-group">
                <label style={styles.formLabelPage}>To Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={tdsToDate} onChange={(e) => setTdsToDate(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button className="btn btn-primary" style={{ backgroundColor: '#00b050', border: 'none', padding: '8px 24px', fontWeight: '700' }} onClick={() => handleDownloadReport('TDS', tdsFromDate, tdsToDate)}>Download</button>
              <button className="btn btn-secondary" style={{ padding: '8px 24px' }} onClick={() => setTdsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* GST Report Modal */}
      {gstModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '90%', maxWidth: '600px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontWeight: '800', color: '#ef4444', fontSize: '1.1rem' }}>GST Report Options</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setGstModalOpen(false)} />
            </div>
            <div className="form-grid" style={{ fontSize: '0.85rem', display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }} className="form-group">
                <label style={styles.formLabelPage}>From Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={gstFromDate} onChange={(e) => setGstFromDate(e.target.value)} />
              </div>
              <div style={{ flex: 1 }} className="form-group">
                <label style={styles.formLabelPage}>To Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={gstToDate} onChange={(e) => setGstToDate(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button className="btn btn-primary" style={{ backgroundColor: '#00b050', border: 'none', padding: '8px 24px', fontWeight: '700' }} onClick={() => handleDownloadReport('GST', gstFromDate, gstToDate)}>Download</button>
              <button className="btn btn-secondary" style={{ padding: '8px 24px' }} onClick={() => setGstModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* General Report Modal */}
      {reportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '90%', maxWidth: '600px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontWeight: '800', color: '#ef4444', fontSize: '1.1rem' }}>Report Options</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setReportModalOpen(false)} />
            </div>
            <div className="form-grid" style={{ fontSize: '0.85rem', display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }} className="form-group">
                <label style={styles.formLabelPage}>From Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={reportFromDate} onChange={(e) => setReportFromDate(e.target.value)} />
              </div>
              <div style={{ flex: 1 }} className="form-group">
                <label style={styles.formLabelPage}>To Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={reportToDate} onChange={(e) => setReportToDate(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button className="btn btn-primary" style={{ backgroundColor: '#00b050', border: 'none', padding: '8px 24px', fontWeight: '700' }} onClick={() => handleDownloadReport('GENERAL', reportFromDate, reportToDate)}>Download</button>
              <button className="btn btn-secondary" style={{ padding: '8px 24px' }} onClick={() => setReportModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Unsettled Bill Report Modal */}
      {unsettledModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '90%', maxWidth: '700px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontWeight: '800', color: '#ef4444', fontSize: '1.1rem' }}>Unsettled Bill Report Options</h3>
              <X size={18} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setUnsettledModalOpen(false)} />
            </div>
            <div className="form-grid" style={{ fontSize: '0.85rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1.5, minWidth: '200px' }} className="form-group">
                <label style={styles.formLabelPage}>Party Name</label>
                <select className="form-control" style={{ height: '38px' }} value={unsettledParty} onChange={(e) => setUnsettledParty(e.target.value)}>
                  <option>Select Party Name</option>
                  {Array.from(new Set(invoices.map(i => i.customerName))).filter(Boolean).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '130px' }} className="form-group">
                <label style={styles.formLabelPage}>From Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={unsettledFromDate} onChange={(e) => setUnsettledFromDate(e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: '130px' }} className="form-group">
                <label style={styles.formLabelPage}>To Date</label>
                <input type="date" className="form-control" style={{ height: '38px' }} value={unsettledToDate} onChange={(e) => setUnsettledToDate(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button className="btn btn-primary" style={{ backgroundColor: '#00b050', border: 'none', padding: '8px 24px', fontWeight: '700' }} onClick={() => handleDownloadReport('UNSETTLED', unsettledFromDate, unsettledToDate, unsettledParty)}>Download</button>
              <button className="btn btn-secondary" style={{ padding: '8px 24px' }} onClick={() => setUnsettledModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Beautiful Print ready Reports overlay */}
      {printingReport && (
        <div style={styles.printOverlay} className="print-overlay-container">
          <div className="print-container-visible" style={styles.printContainer}>
            <div style={styles.printHeader}>
              <div style={styles.printLogo}>
                {logoImg && <img src={logoImg} alt="Logo" style={{ height: '36px', verticalAlign: 'middle', marginRight: '8px' }} />}
                <span style={{ color: headingColor || '#0066cc' }}>TRANSCORE LOGISTICS</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ color: headingColor || '#0066cc', fontSize: '1.2rem', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
                  {printingReport.type === 'GST' ? 'GST Recovery Report' :
                   printingReport.type === 'TDS' ? 'TDS Deductions Register' :
                   printingReport.type === 'UNSETTLED' ? 'Unsettled Receivables' : 'Sales Invoice Register'}
                </h2>
                <span style={{ fontSize: '0.75rem' }}><b>Report Period:</b> {printingReport.fromDate} to {printingReport.toDate}</span><br />
                {printingReport.partyName && printingReport.partyName !== 'Select Party Name' && (
                  <span style={{ fontSize: '0.75rem' }}><b>Customer:</b> {printingReport.partyName}</span>
                )}
              </div>
            </div>

            <hr style={{ ...styles.divider, borderTopColor: headingColor || '#0066cc' }} />

            <table style={styles.printTable}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={styles.printTh}>S.No.</th>
                  <th style={styles.printTh}>Invoice No</th>
                  <th style={styles.printTh}>Date</th>
                  <th style={styles.printTh}>Billing Party Name</th>
                  {printingReport.type === 'GST' && (
                    <>
                      <th style={styles.printTh}>Subtotal</th>
                      <th style={styles.printTh}>GST Rate</th>
                      <th style={styles.printTh}>GST Amount</th>
                      <th style={styles.printTh}>Total Value</th>
                    </>
                  )}
                  {printingReport.type === 'TDS' && (
                    <>
                      <th style={styles.printTh}>Subtotal</th>
                      <th style={styles.printTh}>TDS Rate</th>
                      <th style={styles.printTh}>TDS Deducted</th>
                      <th style={styles.printTh}>Net Amount</th>
                    </>
                  )}
                  {printingReport.type === 'UNSETTLED' && (
                    <>
                      <th style={styles.printTh}>Total Value</th>
                      <th style={styles.printTh}>Advances Paid</th>
                      <th style={styles.printTh}>Outstanding Balance</th>
                    </>
                  )}
                  {printingReport.type === 'GENERAL' && (
                    <>
                      <th style={styles.printTh}>Subtotal</th>
                      <th style={styles.printTh}>GST Amount</th>
                      <th style={styles.printTh}>Grand Total</th>
                      <th style={styles.printTh}>Advance Paid</th>
                      <th style={styles.printTh}>Balance Due</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {printingReport.data.map((inv, idx) => (
                  <tr key={inv._id || idx}>
                    <td style={styles.printTd}>{idx + 1}</td>
                    <td style={{ ...styles.printTd, fontWeight: '700' }}>INV-{inv.invoiceNo}</td>
                    <td style={styles.printTd}>{inv.date}</td>
                    <td style={{ ...styles.printTd, fontWeight: '700' }}>{inv.customerName}</td>
                    {printingReport.type === 'GST' && (
                      <>
                        <td style={styles.printTd}>₹{inv.totalFreight || 0}/-</td>
                        <td style={styles.printTd}>{inv.gstPercentage}%</td>
                        <td style={styles.printTd}>₹{inv.gstAmount || 0}/-</td>
                        <td style={{ ...styles.printTd, fontWeight: '700' }}>₹{inv.grandTotal || 0}/-</td>
                      </>
                    )}
                    {printingReport.type === 'TDS' && (
                      <>
                        <td style={styles.printTd}>₹{inv.totalFreight || 0}/-</td>
                        <td style={styles.printTd}>{inv.tdsPercentage}%</td>
                        <td style={{ ...styles.printTd, color: '#ef4444' }}>₹{inv.tdsAmount || 0}/-</td>
                        <td style={{ ...styles.printTd, fontWeight: '700' }}>₹{(inv.grandTotal - inv.tdsAmount) || 0}/-</td>
                      </>
                    )}
                    {printingReport.type === 'UNSETTLED' && (
                      <>
                        <td style={styles.printTd}>₹{inv.grandTotal || 0}/-</td>
                        <td style={{ ...styles.printTd, color: '#16a34a' }}>₹{inv.amountPaid || 0}/-</td>
                        <td style={{ ...styles.printTd, color: '#ef4444', fontWeight: '800' }}>₹{inv.balance || 0}/-</td>
                      </>
                    )}
                    {printingReport.type === 'GENERAL' && (
                      <>
                        <td style={styles.printTd}>₹{inv.totalFreight || 0}/-</td>
                        <td style={styles.printTd}>₹{inv.gstAmount || 0}/-</td>
                        <td style={{ ...styles.printTd, fontWeight: '700' }}>₹{inv.grandTotal || 0}/-</td>
                        <td style={{ ...styles.printTd, color: '#16a34a' }}>₹{inv.amountPaid || 0}/-</td>
                        <td style={{ ...styles.printTd, color: '#ef4444', fontWeight: '800' }}>₹{inv.balance || 0}/-</td>
                      </>
                    )}
                  </tr>
                ))}
                {printingReport.data.length === 0 && (
                  <tr>
                    <td colSpan="12" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '0.85rem' }}>No data records found in date range.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals Summary */}
            <div style={{ ...styles.printFreightSummary, width: '380px' }}>
              {printingReport.type === 'GST' && (
                <>
                  <div style={styles.freightRow}><span>Total Taxable Subtotal:</span> <b>₹{printingReport.data.reduce((s, x) => s + (x.totalFreight || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span>Total GST Recovered:</span> <b>₹{printingReport.data.reduce((s, x) => s + (x.gstAmount || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span style={{ fontWeight: '700', color: headingColor || '#0066cc' }}>TOTAL TAX REGISTER VALUE:</span> <b>₹{printingReport.data.reduce((s, x) => s + (x.grandTotal || 0), 0)}/-</b></div>
                </>
              )}
              {printingReport.type === 'TDS' && (
                <>
                  <div style={styles.freightRow}><span>Total Taxable Subtotal:</span> <b>₹{printingReport.data.reduce((s, x) => s + (x.totalFreight || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span>Total TDS Deductions:</span> <b style={{ color: '#ef4444' }}>₹{printingReport.data.reduce((s, x) => s + (x.tdsAmount || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span style={{ fontWeight: '700', color: headingColor || '#0066cc' }}>NET NET TAXABLE REALIZATIONS:</span> <b>₹{printingReport.data.reduce((s, x) => s + (x.grandTotal - x.tdsAmount || 0), 0)}/-</b></div>
                </>
              )}
              {printingReport.type === 'UNSETTLED' && (
                <>
                  <div style={styles.freightRow}><span>Total Invoiced Receivables:</span> <b>₹{printingReport.data.reduce((s, x) => s + (x.grandTotal || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span>Total Advances Realized:</span> <b style={{ color: '#16a34a' }}>₹{printingReport.data.reduce((s, x) => s + (x.amountPaid || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span style={{ fontWeight: '700', color: '#ef4444' }}>NET UNPAID BALANCE:</span> <b style={{ color: '#ef4444', fontSize: '1rem' }}>₹{printingReport.data.reduce((s, x) => s + (x.balance || 0), 0)}/-</b></div>
                </>
              )}
              {printingReport.type === 'GENERAL' && (
                <>
                  <div style={styles.freightRow}><span>Total Subtotal:</span> <b>₹{printingReport.data.reduce((s, x) => s + (x.totalFreight || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span>Total GST:</span> <b>₹{printingReport.data.reduce((s, x) => s + (x.gstAmount || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span>Grand Total:</span> <b>₹{printingReport.data.reduce((s, x) => s + (x.grandTotal || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span>Advances Paid:</span> <b style={{ color: '#16a34a' }}>₹{printingReport.data.reduce((s, x) => s + (x.amountPaid || 0), 0)}/-</b></div>
                  <div style={styles.freightRow}><span style={{ fontWeight: '700', color: '#ef4444' }}>TOTAL OUTSTANDING:</span> <b style={{ color: '#ef4444', fontSize: '1rem' }}>₹{printingReport.data.reduce((s, x) => s + (x.balance || 0), 0)}/-</b></div>
                </>
              )}
            </div>

            <div style={styles.printControls}>
              <button className="btn btn-secondary" onClick={() => setPrintingReport(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>Print Report</button>
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
  reportActionBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
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
  noRecords: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '40px 0',
    fontSize: '0.875rem'
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
  actionBtnBlueFilled: {
    backgroundColor: '#1976d2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
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
