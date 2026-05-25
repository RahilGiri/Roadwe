import React, { useState, useEffect } from 'react';
import { Home, Plus, X, Search, Calendar, ChevronDown, Trash2 } from 'lucide-react';

export default function SupplierAdvance({ 
  supplierAdvances, initialOpen, onCreateAdvance, onDeleteAdvance, setActivePage 
}) {
  const [showForm, setShowForm] = useState(initialOpen || false);

  // Seeded Suppliers list matching Master
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

  // Filters State
  const [filterSupplier, setFilterSupplier] = useState('Select Supplier');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Active Applied Filters (defaults same as state)
  const [appliedSupplier, setAppliedSupplier] = useState('Select Supplier');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  // Form Fields State
  const [supplierName, setSupplierName] = useState('Select Supplier');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  // Sync initialOpen props
  useEffect(() => {
    setShowForm(initialOpen || false);
  }, [initialOpen]);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (supplierName === 'Select Supplier') {
      alert('Please select a Supplier Name.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (!reason.trim()) {
      alert('Please enter a reason for giving the advance.');
      return;
    }

    const matchedSupplierObj = seededSuppliers.find(s => s.name === supplierName) || {};

    const payload = {
      supplierName,
      supplierPan: matchedSupplierObj.pan || '',
      paymentDate,
      amount: Number(amount),
      reason,
      settledAmount: 0,
      balance: Number(amount),
      createdBy: 'Transcore Admin'
    };

    onCreateAdvance(payload);
    // Reset Form & Switch back
    setSupplierName('Select Supplier');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setAmount('');
    setReason('');
    setShowForm(false);
  };

  // Filter logic
  const filteredAdvances = supplierAdvances.filter(adv => {
    if (appliedSupplier !== 'Select Supplier' && adv.supplierName !== appliedSupplier) return false;
    if (appliedFromDate && adv.paymentDate < appliedFromDate) return false;
    if (appliedToDate && adv.paymentDate > appliedToDate) return false;
    return true;
  });

  // Dynamic calculations row aggregates
  const totalAdvance = filteredAdvances.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalSettled = filteredAdvances.reduce((acc, curr) => acc + (curr.settledAmount || 0), 0);
  const totalBalance = filteredAdvances.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  const handleApplyFilters = () => {
    setAppliedSupplier(filterSupplier);
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
  };

  const handleResetFilters = () => {
    setFilterSupplier('Select Supplier');
    setFilterFromDate('');
    setFilterToDate('');
    setAppliedSupplier('Select Supplier');
    setAppliedFromDate('');
    setAppliedToDate('');
  };

  return (
    <div style={styles.container}>
      
      {/* Breadcrumbs Banner */}
      <div style={styles.header}>
        <div style={styles.breadcrumbs}>
          <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => setActivePage('dashboard')} />
          <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('dashboard')}>Home</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('ledger')}>Ledger</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={styles.breadcrumbActive}>
            {showForm ? 'Add Supplier Advance' : 'Supplier Advance Ledger'}
          </span>
        </div>
        
        {showForm ? (
          <button 
            style={styles.headerBlueBtn} 
            onClick={() => setShowForm(false)}
          >
            Supplier Advance Ledger List
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              style={styles.headerBlueBtn} 
              onClick={() => setActivePage('ledger')}
            >
              Ledger List
            </button>
            <button 
              style={styles.headerBlueBtn} 
              onClick={() => setShowForm(true)}
            >
              Add Supplier Advance
            </button>
          </div>
        )}
      </div>

      {/* A. List Workspace */}
      {!showForm && (
        <div style={styles.mainCard}>
          <h2 style={styles.cardTitle}>Supplier Advance Ledger</h2>

          {/* Filters Area */}
          <div style={styles.filtersBox}>
            <h4 style={styles.filtersHeading}>Filters :</h4>
            <div style={styles.filtersGrid}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Supplier Name :</label>
                <select 
                  className="form-control" 
                  style={styles.filterSelect}
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                >
                  <option value="Select Supplier">Select Supplier</option>
                  {seededSuppliers.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>From Date :</label>
                <input 
                  type="date" 
                  className="form-control" 
                  style={styles.filterInput} 
                  value={filterFromDate}
                  onChange={(e) => setFilterFromDate(e.target.value)}
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>To Date :</label>
                <input 
                  type="date" 
                  className="form-control" 
                  style={styles.filterInput} 
                  value={filterToDate}
                  onChange={(e) => setFilterToDate(e.target.value)}
                />
              </div>

              <div style={styles.filtersButtons}>
                <button style={styles.applyBtn} onClick={handleApplyFilters}>Apply</button>
                <button style={styles.resetBtn} onClick={handleResetFilters}>Reset</button>
              </div>
            </div>
          </div>

          {/* Dynamic math totals bar */}
          <div style={styles.summaryBar}>
            <span style={styles.summaryItem}>Total Advance = <strong style={{ color: '#ef4444' }}>₹{totalAdvance}</strong></span>
            <span style={styles.summarySeparator}>|</span>
            <span style={styles.summaryItem}>Total Settled = <strong style={{ color: '#10b981' }}>₹{totalSettled}</strong></span>
            <span style={styles.summarySeparator}>|</span>
            <span style={styles.summaryItem}>Balance = <strong style={{ color: '#ef4444' }}>₹{totalBalance}</strong></span>
          </div>

          {/* Transaction Ledger list */}
          <div className="table-container" style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginTop: '16px' }}>
            <table className="custom-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th>SNo.</th>
                  <th>Payment Date</th>
                  <th>Supplier Name</th>
                  <th>Supplier PAN No.</th>
                  <th>Reason</th>
                  <th>Created By</th>
                  <th>Advance Amt.</th>
                  <th>Settled Amt.</th>
                  <th>Balance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvances.map((adv, idx) => (
                  <tr key={adv._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{adv.paymentDate}</td>
                    <td style={{ fontWeight: '700' }}>{adv.supplierName}</td>
                    <td>{adv.supplierPan || 'N/A'}</td>
                    <td>{adv.reason}</td>
                    <td>{adv.createdBy || 'Transcore Admin'}</td>
                    <td style={{ color: '#ef4444', fontWeight: '600' }}>₹{adv.amount}/-</td>
                    <td style={{ color: '#10b981', fontWeight: '600' }}>₹{adv.settledAmount}/-</td>
                    <td style={{ color: '#ef4444', fontWeight: '800' }}>₹{adv.balance}/-</td>
                    <td>
                      <button 
                        style={styles.actionDeleteBtn} 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this supplier advance entry?')) {
                            onDeleteAdvance(adv._id);
                          }
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAdvances.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '32px 0', color: '#64748b', fontWeight: '500' }}>
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* B. Form Workspace */}
      {showForm && (
        <div style={styles.mainCard}>
          <h2 style={styles.cardTitle}>Supplier Advance Ledger Form</h2>

          <form onSubmit={handleSubmit} style={styles.formContainer}>
            <div style={styles.formRow}>
              <div style={{ ...styles.formGroupPage, flex: 2 }}>
                <label style={styles.formLabelPage}>Supplier Name :</label>
                <select 
                  className="form-control" 
                  style={{ height: '40px' }}
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  required
                >
                  <option value="Select Supplier">Select Supplier</option>
                  {seededSuppliers.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                <label style={styles.formLabelPage}>Payment Date *</label>
                <input 
                  type="date" 
                  className="form-control" 
                  style={styles.formInputPage}
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
              </div>

              <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                <label style={styles.formLabelPage}>Amount *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Enter Amount"
                  style={styles.formInputPage}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroupPage}>
              <label style={styles.formLabelPage}>Reason for Giving Advance *</label>
              <textarea 
                className="form-control" 
                placeholder="Enter Reason for Giving Advance"
                style={styles.formTextareaPage}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div style={styles.greenButtonContainer}>
              <button type="submit" style={styles.greenActionBtn}>
                Add Supplier Advance Details
              </button>
            </div>
          </form>

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
  headerBlueBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  mainCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px'
  },
  filtersBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px'
  },
  filtersHeading: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '12px'
  },
  filtersGrid: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '180px',
    flex: 1
  },
  filterLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569'
  },
  filterSelect: {
    height: '38px',
    fontSize: '0.8rem',
    padding: '8px',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    outline: 'none',
    backgroundColor: '#ffffff'
  },
  filterInput: {
    height: '38px',
    fontSize: '0.8rem',
    padding: '8px',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    outline: 'none',
    backgroundColor: '#ffffff'
  },
  filtersButtons: {
    display: 'flex',
    gap: '10px'
  },
  applyBtn: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '9px 24px',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  resetBtn: {
    backgroundColor: '#ff4d4d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '9px 24px',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  summaryBar: {
    backgroundColor: '#e0f2fe',
    border: '1px solid #bae6fd',
    borderRadius: '6px',
    padding: '12px 20px',
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#0369a1',
    fontWeight: '600'
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  summarySeparator: {
    color: '#bae6fd',
    fontWeight: '400'
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
    cursor: 'pointer',
    margin: '0 auto'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginTop: '10px'
  },
  formRow: {
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
    height: '100px',
    resize: 'none',
    fontFamily: "'Inter', sans-serif"
  },
  greenButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px'
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
    outline: 'none'
  }
};
