import React, { useState, useEffect } from 'react';
import { Home, Calendar, AlertCircle } from 'lucide-react';

export default function SupplierPaidPayment({ 
  seededSuppliers = [], chalans = [], supplierAdvances = [], onCreateVoucher, onUpdateChalan, setActivePage 
}) {
  const [selectedSupplierName, setSelectedSupplierName] = useState('');
  const [supplierPan, setSupplierPan] = useState('');
  const [supplierContact, setSupplierContact] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');

  // Form Fields
  const [paidAmount, setPaidAmount] = useState('');
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('Select Payment Mode');
  const [remarks, setRemarks] = useState('');
  const [createVoucher, setCreateVoucher] = useState(true);

  // Outstanding trip chalans
  const [outstandingChalans, setOutstandingChalans] = useState([]);
  const [allocations, setAllocations] = useState({}); // key: chalanId, value: adjustedAmount

  // Header Balances
  const [dueAmount, setDueAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);

  // Local Seeded Suppliers matching Master
  const suppliersList = seededSuppliers.length > 0 ? seededSuppliers : [
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

  // Auto-populate supplier details & compile outstanding trip records
  useEffect(() => {
    if (!selectedSupplierName) {
      setSupplierPan('');
      setSupplierContact('');
      setSupplierAddress('');
      setOutstandingChalans([]);
      setAllocations({});
      setDueAmount(0);
      setAdvanceAmount(0);
      return;
    }

    const supplier = suppliersList.find(s => s.name === selectedSupplierName) || {};
    setSupplierPan(supplier.pan || 'N/A');
    setSupplierContact(supplier.phone || 'N/A');
    setSupplierAddress(supplier.address || 'N/A');

    // 1. Gather Trip Chalans with balance > 0 (balanceToDriver or lorryFreight)
    const supplierChalans = chalans.filter(ch => ch.supplierName === selectedSupplierName && (ch.balanceToDriver > 0 || ch.balanceToDriver === undefined)).map(ch => ({
      _id: ch._id,
      chalanNo: `CH-${ch.chalanNo}`,
      date: ch.date,
      total: ch.lorryFreight || 0,
      balance: ch.balanceToDriver !== undefined ? ch.balanceToDriver : ch.lorryFreight,
      truckNo: `${ch.vPart1 || ''}${ch.vPart2 || ''}${ch.vPart3 || ''}${ch.vPart4 || ''}` || 'N/A'
    }));

    setOutstandingChalans(supplierChalans);

    // Initial allocations map
    const initialAlloc = {};
    supplierChalans.forEach(ch => {
      initialAlloc[ch._id] = 0;
    });
    setAllocations(initialAlloc);

    // Calculate header aggregates
    const totalDue = supplierChalans.reduce((acc, curr) => acc + curr.balance, 0);
    setDueAmount(totalDue);

    // Advances Paid sum
    const totalAdvs = supplierAdvances.filter(adv => adv.supplierName === selectedSupplierName).reduce((acc, curr) => acc + (curr.amount || 0), 0);
    setAdvanceAmount(totalAdvs);
  }, [selectedSupplierName, chalans, supplierAdvances]);

  // Adjust amount to be settled sum
  const amountToBeSettled = Object.values(allocations).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  const remainingPaid = (Number(paidAmount) || 0) - amountToBeSettled;

  const handleChalanCheck = (chalanId, checked) => {
    const nextAlloc = { ...allocations };
    const chObj = outstandingChalans.find(ch => ch._id === chalanId);
    if (!chObj) return;

    if (checked) {
      // Allocate outstanding balance of this chalan, or the remaining paid amount, whichever is smaller!
      const autoAlloc = Math.min(chObj.balance, Math.max(0, remainingPaid));
      nextAlloc[chalanId] = autoAlloc;
    } else {
      nextAlloc[chalanId] = 0;
    }
    setAllocations(nextAlloc);
  };

  const handleAdjustedAmountChange = (chalanId, val) => {
    const nextAlloc = { ...allocations };
    const chObj = outstandingChalans.find(ch => ch._id === chalanId);
    if (!chObj) return;

    const numVal = Number(val) || 0;
    // Cap allocation at the chalan's outstanding balance
    nextAlloc[chalanId] = Math.min(chObj.balance, numVal);
    setAllocations(nextAlloc);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedSupplierName) {
      alert('Please select a Supplier.');
      return;
    }

    const pAmt = Number(paidAmount) || 0;
    if (pAmt <= 0) {
      alert('Please enter a valid paid amount.');
      return;
    }

    if (amountToBeSettled !== pAmt) {
      alert(`Allocation mismatch! Amount to be settled (₹${amountToBeSettled}) must match the Paid Amount (₹${pAmt}).`);
      return;
    }

    if (paymentMode === 'Select Payment Mode') {
      alert('Please select a payment mode.');
      return;
    }

    // 1. Create Payment Voucher if checked
    if (createVoucher) {
      onCreateVoucher({
        voucherNo: `V-PY-${Date.now().toString().slice(-4)}`,
        date: paidDate,
        type: 'Payment',
        partyName: selectedSupplierName,
        description: remarks || `Paid payment to supplier: allocated against outstanding trip chalans.`,
        amount: pAmt
      });
    }

    // 2. Perform allocations updates in MongoDB/LocalState
    outstandingChalans.forEach(ch => {
      const adjusted = Number(allocations[ch._id]) || 0;
      if (adjusted > 0) {
        const nextBal = Math.max(0, ch.balance - adjusted);
        onUpdateChalan(ch._id, { balanceToDriver: nextBal });
      }
    });

    alert('Paid payment successfully recorded and allocated against outstanding trip chalans!');
    // Switch back to ledger
    setActivePage('ledger');
  };

  return (
    <div style={styles.container}>
      
      {/* Breadcrumbs Navigation */}
      <div style={styles.header}>
        <div style={styles.breadcrumbs}>
          <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={() => setActivePage('dashboard')} />
          <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('dashboard')}>Home</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('ledger')}>Ledger</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={styles.breadcrumbActive}>Add Supplier Paid Payment</span>
        </div>
        
        <button 
          style={styles.headerBlueBtn} 
          onClick={() => setActivePage('ledger')}
        >
          Ledger List
        </button>
      </div>

      <div style={styles.mainCard}>
        <h2 style={styles.cardTitle}>Supplier Paid Payment Form</h2>

        {/* Dual aggregates display row matching Screenshot 2 */}
        <div style={styles.balanceHeader}>
          <span style={{ marginRight: '24px' }}>Due Amount : <strong>₹{dueAmount}</strong></span>
          <span>Advance Amount : <strong>₹{advanceAmount}</strong></span>
        </div>

        <form onSubmit={handleFormSubmit} style={styles.splitRow}>
          
          {/* LEFT COLUMN: Supplier & Amount details */}
          <div style={styles.leftCol}>
            
            {/* Supplier Details section */}
            <div style={styles.sectionHeader}>Supplier Details</div>
            <div style={styles.formGroupPage}>
              <label style={styles.formLabelPage}>Supplier Name :</label>
              <select 
                className="form-control" 
                style={{ height: '40px' }}
                value={selectedSupplierName}
                onChange={(e) => setSelectedSupplierName(e.target.value)}
                required
              >
                <option value="">Select Supplier</option>
                {suppliersList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div style={styles.flexRow}>
              <div style={{ ...styles.formGroupPage, flex: 1 }}>
                <label style={styles.formLabelPage}>PAN Number</label>
                <input 
                  type="text" disabled style={styles.disabledInput} 
                  placeholder="PAN number" value={supplierPan} 
                />
              </div>
              <div style={{ ...styles.formGroupPage, flex: 1 }}>
                <label style={styles.formLabelPage}>Mobile Number</label>
                <input 
                  type="text" disabled style={styles.disabledInput} 
                  placeholder="Mobile number" value={supplierContact} 
                />
              </div>
            </div>

            <div style={styles.formGroupPage}>
              <label style={styles.formLabelPage}>Address</label>
              <textarea 
                disabled style={{ ...styles.formTextareaPage, height: '70px', backgroundColor: '#f1f5f9' }}
                placeholder="Address" value={supplierAddress} 
              />
            </div>

            {/* Amount Details section */}
            <div style={{ ...styles.sectionHeader, marginTop: '20px' }}>Amount Details</div>
            <div style={styles.flexRow}>
              <div style={{ ...styles.formGroupPage, flex: 1 }}>
                <label style={styles.formLabelPage}>Paid Amount *</label>
                <input 
                  type="number" className="form-control" required style={styles.formInputPage}
                  placeholder="Enter Amount" value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
              </div>
              <div style={{ ...styles.formGroupPage, flex: 1 }}>
                <label style={styles.formLabelPage}>Paid Date *</label>
                <input 
                  type="date" className="form-control" required style={styles.formInputPage}
                  value={paidDate} onChange={(e) => setPaidDate(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.flexRow}>
              <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                <label style={styles.formLabelPage}>Payment Modes *</label>
                <select 
                  className="form-control" style={{ height: '40px' }}
                  value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}
                  required
                >
                  <option value="Select Payment Mode">Select Payment Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div style={{ ...styles.formGroupPage, flex: 1 }}>
                <label style={styles.formLabelPage}>Amount to be Settled</label>
                <input 
                  type="number" disabled style={{ ...styles.disabledInput, backgroundColor: '#f8fafc', fontWeight: '800', color: '#10b981' }} 
                  value={amountToBeSettled} 
                />
              </div>
            </div>

            <div style={styles.formGroupPage}>
              <label style={styles.formLabelPage}>Remarks</label>
              <textarea 
                className="form-control" placeholder="Remarks" style={{ ...styles.formTextareaPage, height: '70px' }}
                value={remarks} onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
              <input 
                type="checkbox" checked={createVoucher} 
                onChange={(e) => setCreateVoucher(e.target.checked)} 
              />
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Create Voucher As Well</label>
            </div>

          </div>

          {/* RIGHT COLUMN: Outstanding chalan details & adjustments */}
          <div style={styles.rightCol}>
            <div style={styles.sectionHeader}>Chalan Details</div>
            
            <div style={styles.warningAlert}>
              <AlertCircle size={14} style={{ marginRight: '6px' }} />
              <span>Note : Select Chalan to Adjust Paid Amount.</span>
            </div>

            <div style={styles.billsScrollbox}>
              {outstandingChalans.map(ch => {
                const isSelected = (allocations[ch._id] || 0) > 0;
                return (
                  <div key={ch._id} style={{ ...styles.billCard, borderLeftColor: isSelected ? '#10b981' : '#cbd5e1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => handleChalanCheck(ch._id, e.target.checked)}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={styles.billNo}>{ch.chalanNo} ({ch.truckNo})</span>
                        <span style={styles.billDate}>Date: {ch.date}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={styles.billTotal}>Total: ₹{ch.total}</span>
                        <span style={styles.billBalance}>Due: <strong style={{ color: '#ef4444' }}>₹{ch.balance}</strong></span>
                      </div>
                    </div>

                    {isSelected && (
                      <div style={{ marginTop: '10px', borderTop: '1px solid #cbd5e1', paddingTop: '10px' }}>
                        <label style={{ ...styles.formLabelPage, fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>
                          Adjusted Amount (₹) :
                        </label>
                        <input 
                          type="number" className="form-control" style={{ height: '32px', fontSize: '0.8rem', padding: '6px' }}
                          value={allocations[ch._id] || ''}
                          max={ch.balance}
                          onChange={(e) => handleAdjustedAmountChange(ch._id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {outstandingChalans.length === 0 && (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '80px 0', fontSize: '0.85rem' }}>
                  No outstanding hired trip chalans found for this supplier selection.
                </div>
              )}
            </div>

          </div>

        </form>

        <div style={styles.greenButtonContainer}>
          <button type="button" style={styles.greenActionBtn} onClick={handleFormSubmit}>
            Submit
          </button>
        </div>

      </div>
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
  balanceHeader: {
    padding: '12px 20px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: '#475569',
    fontWeight: '700',
    marginBottom: '24px',
    display: 'flex'
  },
  splitRow: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap'
  },
  leftCol: {
    flex: 1.2,
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  rightCol: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    borderLeft: '1px solid #e2e8f0',
    paddingLeft: '24px'
  },
  sectionHeader: {
    fontSize: '0.8rem',
    color: '#0066cc',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderLeft: '3px solid #0066cc',
    paddingLeft: '8px',
    marginBottom: '8px'
  },
  flexRow: {
    display: 'flex',
    gap: '14px'
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
  disabledInput: {
    padding: '10px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    fontFamily: "'Inter', sans-serif",
    height: '40px',
    backgroundColor: '#e2e8f0',
    color: '#64748b'
  },
  formTextareaPage: {
    padding: '10px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    resize: 'none',
    fontFamily: "'Inter', sans-serif"
  },
  warningAlert: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#fff1f2',
    border: '1px solid #fecdd3',
    borderRadius: '6px',
    color: '#e11d48',
    fontSize: '0.75rem',
    fontWeight: '700'
  },
  billsScrollbox: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '14px',
    maxHeight: '340px',
    overflowY: 'auto',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  billCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderLeft: '4px solid #cbd5e1',
    borderRadius: '6px',
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column'
  },
  billNo: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#0066cc',
    display: 'block'
  },
  billDate: {
    fontSize: '0.7rem',
    color: '#64748b',
    display: 'block',
    marginTop: '2px'
  },
  billTotal: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#334155',
    display: 'block'
  },
  billBalance: {
    fontSize: '0.75rem',
    display: 'block',
    marginTop: '2px'
  },
  greenButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '20px'
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
