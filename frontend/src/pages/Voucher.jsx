import React, { useState, useEffect, useRef } from 'react';
import { Plus, Printer, Search, X, Check, Filter, Edit2, Trash2 } from 'lucide-react';

const API_BASE = '/api';

export default function Voucher({ 
  vouchers: propVouchers = [], customers = [],
  onCreateVoucher, onUpdateVoucher, onDeleteVoucher,
  headingColor, voucherBgColor, logoImg, stampImg,
  token, activePage, setActivePage
}) {
  // Local state list with fallback to propVouchers or localStorage persistence
  const [vouchersList, setVouchersList] = useState(() => {
    const saved = localStorage.getItem('roadwe_vouchers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        _id: 'v1',
        voucherNo: '1',
        date: '2026-05-13',
        type: 'Paid Payment', // Matches screenshotPaid/Received toggle
        partyName: 'SANDEEP KUMAR',
        partyMobile: '9129918353',
        amount: 12500,
        paymentMode: 'Cash',
        remarks: 'Paid advance cash to lorry driver for Vadodara-Jamshedpur trip chalan fuel pump credit.',
        signature: null
      },
      {
        _id: 'v2',
        voucherNo: '2',
        date: '2026-05-14',
        type: 'Received Payment',
        partyName: 'TATA STEEL LTD',
        partyMobile: '9876543210',
        amount: 45000,
        paymentMode: 'Bank Cheque',
        remarks: 'Received freight settlement balance outstanding amount for Invoice #INV-204.',
        signature: null
      }
    ];
  });

  // State variables for Creator Form (Screenshot 1)
  const [voucherNo, setVoucherNo] = useState('3');
  const [voucherType, setVoucherType] = useState('Paid Payment'); // Paid Payment or Received Payment
  const [partyName, setPartyName] = useState('');
  const [partyMobile, setPartyMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [paymentMode, setPaymentMode] = useState('Select Payment Mode');
  const [remarks, setRemarks] = useState('');

  // Signature canvas states
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);

  // --- Double-Row Filter Modal states (Screenshot 5) ---
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterSender, setFilterSender] = useState('Select Sender Name');
  const [filterReceiver, setFilterReceiver] = useState('Select Receiver Name');
  const [filterVoucherType, setFilterVoucherType] = useState('Select Voucher Type');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Active list filters
  const [appliedSender, setAppliedSender] = useState('');
  const [appliedReceiver, setAppliedReceiver] = useState('');
  const [appliedVoucherType, setAppliedVoucherType] = useState('');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  // --- Double-Row Report Options Modal states (Screenshot 3) ---
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSender, setReportSender] = useState('Select Sender Name');
  const [reportReceiver, setReportReceiver] = useState('Select Receiver Name');
  const [reportVoucherType, setReportVoucherType] = useState('Select Voucher Type');
  const [reportFromDate, setReportFromDate] = useState('');
  const [reportToDate, setReportToDate] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [viewingVoucher, setViewingVoucher] = useState(null);
  const [printingRegister, setPrintingRegister] = useState(null); // Compiled report for transaction register print

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('roadwe_vouchers', JSON.stringify(vouchersList));
  }, [vouchersList]);

  // Determine prefill sequence for new vouchers
  useEffect(() => {
    if (activePage === 'voucher-create') {
      const nextNum = vouchersList.length > 0
        ? String(Math.max(...vouchersList.map(v => parseInt(v.voucherNo) || 0)) + 1)
        : '1';
      setVoucherNo(nextNum);
      setVoucherType('Paid Payment');
      setPartyName('');
      setPartyMobile('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMode('Select Payment Mode');
      setRemarks('');
      setSignatureDataUrl(null);
      
      // Clear signature canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activePage, vouchersList]);

  // Canvas Drawing Handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    // Support mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    
    // Track continuous signatureURL
    setSignatureDataUrl(canvas.toDataURL());
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
    }
  }, [activePage]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!partyName.trim() || !amount || paymentMode === 'Select Payment Mode') {
      alert('Party Name, Amount, and Payment Mode are required.');
      return;
    }

    const newVoucher = {
      _id: 'v_' + Date.now(),
      voucherNo,
      date,
      type: voucherType,
      partyName,
      partyMobile,
      amount: parseFloat(amount) || 0,
      paymentMode,
      remarks,
      signature: signatureDataUrl
    };

    setVouchersList([newVoucher, ...vouchersList]);
    
    // Call legacy MERN creator if prop handler exists
    if (onCreateVoucher) {
      onCreateVoucher({
        voucherNo,
        date,
        type: voucherType === 'Paid Payment' ? 'Payment' : 'Receipt',
        partyName,
        description: remarks,
        amount: parseFloat(amount) || 0
      });
    }

    alert('Voucher Generated Successfully!');
    setActivePage('voucher-list');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this voucher?')) {
      setVouchersList(vouchersList.filter(v => v._id !== id));
      if (onDeleteVoucher) {
        onDeleteVoucher(id);
      }
    }
  };

  // Compile unique values
  const uniqueParties = Array.from(new Set(vouchersList.map(v => v.partyName))).filter(Boolean);

  // Apply filters
  const filteredVouchers = vouchersList.filter(v => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSearch = v.partyName.toLowerCase().includes(q) || 
                          v.voucherNo.toLowerCase().includes(q) ||
                          (v.remarks && v.remarks.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    // 2. Sender (Consignor mapping for Voucher as Sender Name)
    if (appliedSender && v.partyName !== appliedSender) return false;

    // 3. Receiver (Consignee mapping for Voucher as Receiver Name)
    if (appliedReceiver && v.partyName !== appliedReceiver) return false;

    // 4. Voucher Type Filter
    if (appliedVoucherType && v.type !== appliedVoucherType) return false;

    // 5. Date Filters
    if (appliedFromDate && v.date < appliedFromDate) return false;
    if (appliedToDate && v.date > appliedToDate) return false;

    return true;
  });

  const handleSearchFilter = () => {
    // Treat Sender Name/Receiver Name selection dynamically to look up partyName
    const party = filterSender !== 'Select Sender Name' ? filterSender 
                : filterReceiver !== 'Select Receiver Name' ? filterReceiver : '';
                
    setAppliedSender(filterSender === 'Select Sender Name' ? '' : filterSender);
    setAppliedReceiver(filterReceiver === 'Select Receiver Name' ? '' : filterReceiver);
    setAppliedVoucherType(filterVoucherType === 'Select Voucher Type' ? '' : filterVoucherType);
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilterSender('Select Sender Name');
    setFilterReceiver('Select Receiver Name');
    setFilterVoucherType('Select Voucher Type');
    setFilterFromDate('');
    setFilterToDate('');
    
    setAppliedSender('');
    setAppliedReceiver('');
    setAppliedVoucherType('');
    setAppliedFromDate('');
    setAppliedToDate('');
  };

  const handleGenerateReport = () => {
    const reportData = vouchersList.filter(v => {
      if (reportSender !== 'Select Sender Name' && v.partyName !== reportSender) return false;
      if (reportReceiver !== 'Select Receiver Name' && v.partyName !== reportReceiver) return false;
      if (reportVoucherType !== 'Select Voucher Type' && v.type !== reportVoucherType) return false;
      if (reportFromDate && v.date < reportFromDate) return false;
      if (reportToDate && v.date > reportToDate) return false;
      return true;
    });

    setPrintingRegister(reportData);
    setIsReportModalOpen(false);
  };

  const isListMode = activePage === 'voucher-list';
  const isCreateMode = activePage === 'voucher-create';

  return (
    <div style={styles.container}>
      {/* VOUCHER FORM VIEW (Screenshot 1) */}
      {isCreateMode && (
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Voucher Form</h2>
            <button 
              className="btn btn-secondary" 
              style={{ backgroundColor: '#0066cc', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '0.85rem' }}
              onClick={() => setActivePage('voucher-list')}
            >
              Voucher List
            </button>
          </div>

          <form onSubmit={handleGenerate} style={{ marginTop: '20px' }}>
            {/* Metadata row */}
            <div style={{ ...styles.row, alignItems: 'center' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={styles.label}>Voucher Number <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  value={voucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div style={{ flex: '2 1 300px', display: 'flex', gap: '20px', marginLeft: '20px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input 
                    type="radio" 
                    id="paidType" 
                    name="voucherType" 
                    value="Paid Payment"
                    checked={voucherType === 'Paid Payment'}
                    onChange={() => setVoucherType('Paid Payment')}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="paidType" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>
                    Paid Payment
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input 
                    type="radio" 
                    id="receivedType" 
                    name="voucherType" 
                    value="Received Payment"
                    checked={voucherType === 'Received Payment'}
                    onChange={() => setVoucherType('Received Payment')}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="receivedType" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>
                    Received Payment
                  </label>
                </div>
              </div>
            </div>

            {/* Party Details Divider */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Party Details</span>
            </div>

            <div style={styles.row}>
              <div style={styles.col3}>
                <label style={styles.label}>Party Name <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="Enter Party Name" 
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Party Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="Party Mobile Number" 
                  value={partyMobile}
                  onChange={(e) => setPartyMobile(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Amount <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="number" 
                  placeholder="Enter Amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div style={{ ...styles.row, marginTop: '12px' }}>
              <div style={{ flex: '1 1 280px' }}>
                <label style={styles.label}>Date <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div style={{ flex: '1 1 280px' }}>
                <label style={styles.label}>Payment Mode <span style={{ color: 'red' }}>*</span></label>
                <select 
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="form-control"
                  required
                >
                  <option>Select Payment Mode</option>
                  <option value="Cash">Cash Payment</option>
                  <option value="Bank Cheque">Bank Cheque Settlement</option>
                  <option value="Online IMPS/NEFT">Online Transfer (IMPS/NEFT)</option>
                  <option value="UPI / Wallet">UPI QR Scan / Wallet</option>
                </select>
              </div>
            </div>

            {/* Remarks Section */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Remarks</span>
            </div>
            <div style={styles.row}>
              <div style={styles.col12}>
                <label style={styles.label}>Remarks</label>
                <textarea 
                  placeholder="Remarks" 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="form-control"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* E-Signature Drawing Pad (Screenshot 1) */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>E-signature</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={styles.signatureWrapper}>
                <canvas 
                  ref={canvasRef}
                  width={340}
                  height={130}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={styles.sigCanvas}
                />
              </div>
              <div>
                <button 
                  type="button" 
                  onClick={handleClearSignature}
                  style={styles.clearSigBtn}
                >
                  CLEAR SIGNATURE
                </button>
              </div>
            </div>

            {/* Submit button aligned in the center */}
            <div style={styles.buttonContainer}>
              <button 
                type="submit" 
                className="btn" 
                style={styles.submitBtn}
              >
                Generate Voucher
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REGISTRY LIST VIEW (Screenshot 2) */}
      {isListMode && (
        <div>
          <div style={styles.headerRow}>
            <h2 style={styles.title}>
              Voucher List ({filteredVouchers.length})
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
                onClick={() => setActivePage('voucher-create')}
              >
                Create Voucher
              </button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(appliedSender || appliedReceiver || appliedVoucherType || appliedFromDate || appliedToDate) && (
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
                {appliedVoucherType && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Type: {appliedVoucherType}
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

          {filteredVouchers.length > 0 ? (
            <div style={{ marginTop: '16px' }}>
              {/* Search bar */}
              <div style={styles.filterBar}>
                <div style={{ position: 'relative', width: '320px' }}>
                  <input 
                    type="text" 
                    placeholder="Search by party name or voucher no..." 
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
                      <th>Voucher No</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Party Name</th>
                      <th>Payment Mode</th>
                      <th>Remarks</th>
                      <th>Amount Settled</th>
                      <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVouchers.map((v) => (
                      <tr key={v._id}>
                        <td style={{ fontWeight: '700', color: '#0066cc' }}>#{v.voucherNo}</td>
                        <td style={{ fontWeight: '500' }}>
                          {v.date.split('-').reverse().join('/')}
                        </td>
                        <td>
                          <span className={`status-badge ${v.type === 'Received Payment' ? 'delivered' : 'pending'}`} style={{ fontWeight: '700' }}>
                            {v.type === 'Received Payment' ? 'Receipt' : 'Payment'}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600' }}>{v.partyName}</td>
                        <td style={{ fontWeight: '500' }}>{v.paymentMode}</td>
                        <td>{v.remarks || '—'}</td>
                        <td style={{ fontWeight: '800', color: v.type === 'Received Payment' ? '#10b981' : '#ef4444' }}>
                          {v.type === 'Received Payment' ? '+' : '-'} ₹{v.amount.toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button 
                              className="btn-icon" 
                              onClick={() => setViewingVoucher(v)} 
                              title="Print Voucher Receipt Slip"
                              style={{ color: '#0066cc', border: '1px solid #cbd5e1', padding: '6px', borderRadius: '4px', backgroundColor: '#f8fafc' }}
                            >
                              <Printer size={14} />
                            </button>
                            <button 
                              className="btn-icon btn-danger" 
                              onClick={() => handleDelete(v._id)} 
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
            // Center Aligned Empty State Registry (Screenshot 2)
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
                    {uniqueParties.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
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
                    {uniqueParties.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 Dropdowns & Date Pickers */}
              <div style={{ ...styles.row, marginTop: '14px' }}>
                <div style={styles.col}>
                  <label style={styles.label}>Voucher Type</label>
                  <select 
                    value={filterVoucherType}
                    onChange={(e) => setFilterVoucherType(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Voucher Type</option>
                    <option value="Paid Payment">Paid Payment</option>
                    <option value="Received Payment">Received Payment</option>
                  </select>
                </div>
              </div>

              {/* Row 3 Date Ranges */}
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

      {/* REPORT OPTIONS DIALOG MODAL (Screenshot 3) */}
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
                    {uniqueParties.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
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
                    {uniqueParties.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 Dropdowns & Date Pickers */}
              <div style={{ ...styles.row, marginTop: '14px' }}>
                <div style={styles.col}>
                  <label style={styles.label}>Voucher Type</label>
                  <select 
                    value={reportVoucherType}
                    onChange={(e) => setReportVoucherType(e.target.value)}
                    className="form-control"
                    style={{ width: '100%' }}
                  >
                    <option>Select Voucher Type</option>
                    <option value="Paid Payment">Paid Payment</option>
                    <option value="Received Payment">Received Payment</option>
                  </select>
                </div>
              </div>

              {/* Row 3 Date Ranges */}
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

      {/* REPORT REGISTER SLIPS LIST STATEMENT PRINT MODAL */}
      {printingRegister && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '850px', padding: 0 }}>
            <div style={{ ...styles.modalHeader, padding: '16px 20px', borderBottom: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: 0 }}>🖨️ Voucher Register Print Preview</h3>
              <button onClick={() => setPrintingRegister(null)} style={styles.closeBtn}><X size={18}/></button>
            </div>
            
            {/* Printable Frame */}
            <div style={styles.printFrame} className="print-only-document">
              <div style={styles.printHeader}>
                <div>
                  <h1 style={{ color: '#0066cc', margin: 0, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif' }}>TRANSCORE LOGISTICS</h1>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    GSTIN: 09AAACT9211C1ZA • Official Receipts & Payments Voucher Register
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ color: '#64748b', margin: 0 }}>VOUCHER LEDGER REGISTER</h3>
                  <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}><b>Date of Compilation:</b> {new Date().toLocaleDateString('en-GB')}</p>
                  <p style={{ fontSize: '0.8rem', margin: '2px 0 0 0' }}><b>Vouchers Found:</b> {printingRegister.length}</p>
                </div>
              </div>

              <div style={styles.printBody}>
                {printingRegister.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Voucher No.</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Date</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Party Account Name</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Type</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Payment Mode</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Narration Remarks</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Inflow Credit (+)</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Outflow Debit (-)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printingRegister.map((v, idx) => (
                        <tr key={v._id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: '700' }}>#{v.voucherNo}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{v.date.split('-').reverse().join('/')}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontWeight: '600' }}>{v.partyName}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{v.type === 'Received Payment' ? 'Receipt' : 'Payment'}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>{v.paymentMode}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}>{v.remarks || '—'}</td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: '700', color: '#10b981' }}>
                            {v.type === 'Received Payment' ? `₹${v.amount.toLocaleString()}` : '—'}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: '700', color: '#ef4444' }}>
                            {v.type === 'Paid Payment' ? `₹${v.amount.toLocaleString()}` : '—'}
                          </td>
                        </tr>
                      ))}
                      {/* Aggregates footer */}
                      <tr style={{ background: '#f8fafc', fontWeight: '800', borderTop: '2px solid #cbd5e1' }}>
                        <td colSpan="6" style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>TOTAL TRANSACTIONS VALUE:</td>
                        <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#10b981' }}>
                          ₹{printingRegister.filter(v => v.type === 'Received Payment').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '10px 8px', border: '1px solid #cbd5e1', textAlign: 'right', color: '#ef4444' }}>
                          ₹{printingRegister.filter(v => v.type === 'Paid Payment').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
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

      {/* INDIVIDUAL VOUCHER PRINT PREVIEW OVERLAY (Screenshot 1 legacy style alignment) */}
      {viewingVoucher && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '800px', padding: 0 }}>
            <div style={{ ...styles.modalHeader, padding: '16px 20px', borderBottom: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: 0 }}>🖨️ Voucher Advice Slip</h3>
              <button onClick={() => setViewingVoucher(null)} style={styles.closeBtn}><X size={18}/></button>
            </div>
            
            {/* Printable Frame */}
            <div style={{ ...styles.printFrame, backgroundColor: voucherBgColor || '#ffffff' }} className="print-only-document">
              {/* Double border premium look */}
              <div style={{ border: '4px double #cbd5e1', padding: '30px', borderRadius: '4px' }}>
                <div style={styles.printHeader}>
                  <div>
                    {logoImg && <img src={logoImg} alt="Logo" style={{ height: '36px', verticalAlign: 'middle', marginRight: '8px' }} />}
                    <h1 style={{ display: 'inline', color: headingColor || '#0066cc', fontSize: '1.6rem', fontFamily: 'Outfit, sans-serif' }}>
                      TRANSCORE LOGISTICS
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                      GSTIN: 09AAACT9211C1ZA • Reg. Address: Kanpur Bypass Road, Kanpur, India
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2 style={{ color: headingColor || '#0066cc', fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
                      {viewingVoucher.type === 'Received Payment' ? 'RECEIPT SLIP' : 'PAYMENT SLIP'}
                    </h2>
                    <p style={{ fontSize: '0.85rem', margin: '4px 0 0 0' }}><b>Voucher #:</b> #{viewingVoucher.voucherNo}</p>
                    <p style={{ fontSize: '0.85rem', margin: '2px 0 0 0' }}><b>Date:</b> {viewingVoucher.date.split('-').reverse().join('/')}</p>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: `2px solid ${headingColor || '#0066cc'}`, margin: '20px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', fontSize: '0.9rem', color: '#334155', margin: '20px 0' }}>
                  <div>
                    <p>{viewingVoucher.type === 'Received Payment' ? 'Received with thanks from:' : 'Paid payment made to:'}</p>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px dashed #cbd5e1', paddingBottom: '4px', margin: '4px 0 16px 0' }}>
                      {viewingVoucher.partyName}
                    </h3>

                    <p>Narrations / Transaction details:</p>
                    <p style={{ fontStyle: 'italic', color: '#64748b', borderBottom: '1px dashed #cbd5e1', paddingBottom: '4px', margin: '4px 0 16px 0', lineHeight: '1.4' }}>
                      {viewingVoucher.remarks || 'Settlement of outstanding balances.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Volume Settled</span>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: viewingVoucher.type === 'Received Payment' ? '#10b981' : '#ef4444', margin: '8px 0' }}>
                      ₹{viewingVoucher.amount.toLocaleString()}
                    </h1>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: viewingVoucher.type === 'Received Payment' ? '#ecfdf5' : '#fef2f2', color: viewingVoucher.type === 'Received Payment' ? '#047857' : '#b91c1c', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      💰 {viewingVoucher.type} Mode
                    </span>
                  </div>
                </div>

                {/* Signature stamps footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic', maxWidth: '300px' }}>
                    * This is an official digital advice receipt slip. Legally valid with system timestamps.
                  </div>
                  <div style={{ textAlign: 'center', width: '200px' }}>
                    {viewingVoucher.signature ? (
                      <img src={viewingVoucher.signature} alt="E-Signature" style={{ height: '50px', objectFit: 'contain', marginBottom: '4px' }} />
                    ) : stampImg ? (
                      <img src={stampImg} alt="Stamp" style={{ height: '44px', marginBottom: '4px', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ border: '2px dashed #0066cc', color: '#0066cc', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', fontSize: '0.55rem', display: 'inline-block', marginBottom: '4px', transform: 'rotate(-2deg)' }}>
                        APPROVED STAMP
                      </div>
                    )}
                    <div style={{ borderBottom: '1px solid #64748b', width: '100%', height: '10px', marginBottom: '4px' }}></div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Authorized Signatory</span>
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
                <Printer size={16} /> Print Receipt
              </button>
              <button 
                onClick={() => setViewingVoucher(null)}
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
  signatureWrapper: {
    border: '2px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    width: '344px',
    height: '134px',
    overflow: 'hidden',
    position: 'relative'
  },
  sigCanvas: {
    cursor: 'crosshair',
    backgroundColor: '#ffffff'
  },
  clearSigBtn: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.75rem',
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.15)'
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
  }
};
