import React, { useState, useEffect } from 'react';
import { Home, Calendar, AlertCircle } from 'lucide-react';

export default function PartyReceivedPayment({ 
  customers = [], invoices = [], bilties = [], onCreateVoucher, onUpdateInvoice, onUpdateBilty, setActivePage 
}) {
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [partyGstin, setPartyGstin] = useState('');
  const [partyContact, setPartyContact] = useState('');
  const [partyAddress, setPartyAddress] = useState('');

  // Form Fields
  const [receivedAmount, setReceivedAmount] = useState('');
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('Select Payment Mode');
  const [remarks, setRemarks] = useState('');
  const [createVoucher, setCreateVoucher] = useState(true);

  // Outstanding bills list for allocation
  const [outstandingBills, setOutstandingBills] = useState([]);
  const [allocations, setAllocations] = useState({}); // key: invoiceId/biltyId, value: adjustedAmount

  // Auto-populate customer details & gather outstanding bills
  useEffect(() => {
    if (!selectedPartyId) {
      setPartyGstin('');
      setPartyContact('');
      setPartyAddress('');
      setOutstandingBills([]);
      setAllocations({});
      return;
    }

    const customer = customers.find(c => c._id === selectedPartyId) || {};
    setPartyGstin(customer.gstin || 'N/A');
    setPartyContact(customer.phone || 'N/A');
    setPartyAddress(customer.address || 'N/A');

    // 1. Gather invoices with balance > 0
    const partyInvoices = invoices.filter(inv => inv.customerId === selectedPartyId && (inv.balance > 0 || inv.balance === undefined)).map(inv => ({
      _id: inv._id,
      billNo: `INV-${inv.invoiceNo}`,
      date: inv.date,
      total: inv.grandTotal,
      balance: inv.balance !== undefined ? inv.balance : inv.grandTotal,
      type: 'invoice'
    }));

    // 2. Gather To-Pay/TBB Bilties with balance > 0
    const partyBilties = bilties.filter(b => b.consignorName === customer.name && (b.balanceAmount > 0 || b.balanceAmount === undefined)).map(b => ({
      _id: b._id,
      billNo: `LR-${b.biltyNo}`,
      date: b.date,
      total: b.totalFreight,
      balance: b.balanceAmount !== undefined ? b.balanceAmount : b.totalFreight,
      type: 'bilty'
    }));

    const allBills = [...partyInvoices, ...partyBilties];
    setOutstandingBills(allBills);

    // Initial allocations map
    const initialAlloc = {};
    allBills.forEach(b => {
      initialAlloc[b._id] = 0;
    });
    setAllocations(initialAlloc);
  }, [selectedPartyId, customers, invoices, bilties]);

  // Adjust amount to be settled sum
  const amountToBeSettled = Object.values(allocations).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  const remainingReceived = (Number(receivedAmount) || 0) - amountToBeSettled;

  const handleBillCheck = (billId, checked) => {
    const nextAlloc = { ...allocations };
    const billObj = outstandingBills.find(b => b._id === billId);
    if (!billObj) return;

    if (checked) {
      // Allocate either the outstanding balance of this bill, or the remaining received amount, whichever is smaller!
      const autoAlloc = Math.min(billObj.balance, Math.max(0, remainingReceived));
      nextAlloc[billId] = autoAlloc;
    } else {
      nextAlloc[billId] = 0;
    }
    setAllocations(nextAlloc);
  };

  const handleAdjustedAmountChange = (billId, val) => {
    const nextAlloc = { ...allocations };
    const billObj = outstandingBills.find(b => b._id === billId);
    if (!billObj) return;

    const numVal = Number(val) || 0;
    // Cap allocation at the bill's outstanding balance
    nextAlloc[billId] = Math.min(billObj.balance, numVal);
    setAllocations(nextAlloc);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedPartyId) {
      alert('Please select a Party.');
      return;
    }

    const recAmt = Number(receivedAmount) || 0;
    if (recAmt <= 0) {
      alert('Please enter a valid received amount.');
      return;
    }

    if (amountToBeSettled !== recAmt) {
      alert(`Allocation mismatch! Amount to be settled (₹${amountToBeSettled}) must match the Received Amount (₹${recAmt}).`);
      return;
    }

    if (paymentMode === 'Select Payment Mode') {
      alert('Please select a payment mode.');
      return;
    }

    const activeParty = customers.find(c => c._id === selectedPartyId) || {};

    // 1. Create Receipt Voucher if checkbox is checked
    if (createVoucher) {
      onCreateVoucher({
        voucherNo: `V-RC-${Date.now().toString().slice(-4)}`,
        date: receivedDate,
        type: 'Receipt',
        partyName: activeParty.name,
        description: remarks || `Party payment received: allocated against outstanding bills.`,
        amount: recAmt
      });
    }

    // 2. Perform allocations updates in MongoDB/LocalState
    outstandingBills.forEach(bill => {
      const adjusted = Number(allocations[bill._id]) || 0;
      if (adjusted > 0) {
        const nextBal = Math.max(0, bill.balance - adjusted);
        if (bill.type === 'invoice') {
          onUpdateInvoice(bill._id, { balance: nextBal });
        } else {
          onUpdateBilty(bill._id, { balanceAmount: nextBal });
        }
      }
    });

    alert('Received payment successfully recorded and allocated against selected bills!');
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
          <span style={styles.breadcrumbActive}>Add Party Received Payment</span>
        </div>
        
        <button 
          style={styles.headerBlueBtn} 
          onClick={() => setActivePage('ledger')}
        >
          Ledger List
        </button>
      </div>

      <div style={styles.mainCard}>
        <h2 style={styles.cardTitle}>Party Received Payment Form</h2>

        {/* Balance Amount display matching Screenshot 3 */}
        <div style={styles.balanceHeader}>
          Balance Amount : <strong>₹{remainingReceived >= 0 ? remainingReceived : 0}</strong>
        </div>

        <form onSubmit={handleFormSubmit} style={styles.splitRow}>
          
          {/* LEFT COLUMN: Party & Amount details */}
          <div style={styles.leftCol}>
            
            {/* Party Details section */}
            <div style={styles.sectionHeader}>Party Details</div>
            <div style={styles.formGroupPage}>
              <label style={styles.formLabelPage}>Party Name :</label>
              <select 
                className="form-control" 
                style={{ height: '40px' }}
                value={selectedPartyId}
                onChange={(e) => setSelectedPartyId(e.target.value)}
                required
              >
                <option value="">Select Party</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.city})</option>)}
              </select>
            </div>

            <div style={styles.flexRow}>
              <div style={{ ...styles.formGroupPage, flex: 1 }}>
                <label style={styles.formLabelPage}>GSTIN Number</label>
                <input 
                  type="text" disabled style={styles.disabledInput} 
                  placeholder="Gstin number" value={partyGstin} 
                />
              </div>
              <div style={{ ...styles.formGroupPage, flex: 1 }}>
                <label style={styles.formLabelPage}>Contact Number</label>
                <input 
                  type="text" disabled style={styles.disabledInput} 
                  placeholder="Contact number" value={partyContact} 
                />
              </div>
            </div>

            <div style={styles.formGroupPage}>
              <label style={styles.formLabelPage}>Address</label>
              <textarea 
                disabled style={{ ...styles.formTextareaPage, height: '70px', backgroundColor: '#f1f5f9' }}
                placeholder="Address" value={partyAddress} 
              />
            </div>

            {/* Amount Details section */}
            <div style={{ ...styles.sectionHeader, marginTop: '20px' }}>Amount Details</div>
            <div style={styles.flexRow}>
              <div style={{ ...styles.formGroupPage, flex: 1 }}>
                <label style={styles.formLabelPage}>Received Amount *</label>
                <input 
                  type="number" className="form-control" required style={styles.formInputPage}
                  placeholder="Enter Amount" value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                />
              </div>
              <div style={{ ...styles.formGroupPage, flex: 1 }}>
                <label style={styles.formLabelPage}>Received Date *</label>
                <input 
                  type="date" className="form-control" required style={styles.formInputPage}
                  value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)}
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

          {/* RIGHT COLUMN: Outstanding bill list & adjustments */}
          <div style={styles.rightCol}>
            <div style={styles.sectionHeader}>Bill Details</div>
            
            <div style={styles.warningAlert}>
              <AlertCircle size={14} style={{ marginRight: '6px' }} />
              <span>Note : Select Bill to Adjust Received Amount.</span>
            </div>

            <div style={styles.billsScrollbox}>
              {outstandingBills.map(bill => {
                const isSelected = (allocations[bill._id] || 0) > 0;
                return (
                  <div key={bill._id} style={{ ...styles.billCard, borderLeftColor: isSelected ? '#10b981' : '#cbd5e1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => handleBillCheck(bill._id, e.target.checked)}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={styles.billNo}>{bill.billNo}</span>
                        <span style={styles.billDate}>Date: {bill.date}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={styles.billTotal}>Total: ₹{bill.total}</span>
                        <span style={styles.billBalance}>Bal: <strong style={{ color: '#ef4444' }}>₹{bill.balance}</strong></span>
                      </div>
                    </div>

                    {isSelected && (
                      <div style={{ marginTop: '10px', borderTop: '1px solid #cbd5e1', paddingTop: '10px' }}>
                        <label style={{ ...styles.formLabelPage, fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>
                          Adjusted Amount (₹) :
                        </label>
                        <input 
                          type="number" className="form-control" style={{ height: '32px', fontSize: '0.8rem', padding: '6px' }}
                          value={allocations[bill._id] || ''}
                          max={bill.balance}
                          onChange={(e) => handleAdjustedAmountChange(bill._id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {outstandingBills.length === 0 && (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '80px 0', fontSize: '0.85rem' }}>
                  No outstanding bills found for this party selection.
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
    padding: '8px 16px',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.85rem',
    color: '#475569',
    fontWeight: '700',
    marginBottom: '24px',
    textTransform: 'uppercase'
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
