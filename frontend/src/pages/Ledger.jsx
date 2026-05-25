import React, { useState } from 'react';
import { Printer, Calendar, ShieldAlert, Plus, BookOpen } from 'lucide-react';

export default function Ledger({ customers, invoices, vouchers, chalans, supplierAdvances = [], onCreateVoucher, setActivePage }) {
  const [activeLedgerTab, setActiveLedgerTab] = useState('party'); // party, supplier
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [selectedTruckNo, setSelectedTruckNo] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('2026-05-23'); // Default to current system date

  const getUniqueVehicles = () => {
    const list = new Set();
    if (chalans) {
      chalans.forEach(ch => {
        const v = `${ch.vPart1 || ''}${ch.vPart2 || ''}${ch.vPart3 || ''}${ch.vPart4 || ''}`;
        if (v.trim()) list.add(v.trim());
      });
    }
    list.add('UP-77-AN-4876');
    list.add('DL-01-GB-1234');
    list.add('MH-12-PQ-9999');
    return Array.from(list);
  };

  const uniqueVehicles = getUniqueVehicles();

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

  // Modal to add a received payment from inside the ledger!
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDesc, setPaymentDesc] = useState('Direct party payment received');

  // Generate Ledger entries dynamically based on selections
  const getLedgerEntries = () => {
    if (!selectedPartyId) return [];

    let entries = [];

    if (activeLedgerTab === 'party') {
      const customer = customers.find(c => c._id === selectedPartyId) || {};
      
      // 1. Debits: Invoices billed to this customer
      const partyInvoices = invoices.filter(inv => inv.customerId === selectedPartyId);
      partyInvoices.forEach(inv => {
        entries.push({
          date: inv.date,
          ref: `Invoice #${inv.invoiceNo}`,
          type: 'Invoice Bill',
          debit: inv.grandTotal,
          credit: 0
        });
      });

      // 2. Credits: Receipts vouchers paid by this customer
      const partyReceipts = vouchers.filter(v => v.type === 'Receipt' && v.partyName === customer.name);
      partyReceipts.forEach(v => {
        entries.push({
          date: v.date,
          ref: `Receipt Voucher #${v.voucherNo}`,
          type: 'Payment Recd',
          debit: 0,
          credit: v.amount
        });
      });

    } else {
      // Supplier Ledger - selectedPartyId is the name of the supplier directly!
      
      // 1. Debits: Hired lorry Trip Chalans cost under this supplier name
      const supplierChalans = chalans.filter(ch => ch.supplierName === selectedPartyId);
      supplierChalans.forEach(ch => {
        const truck = `${ch.vPart1 || ''}${ch.vPart2 || ''}${ch.vPart3 || ''}${ch.vPart4 || ''}`;
        if (selectedTruckNo && truck !== selectedTruckNo) return;

        entries.push({
          date: ch.date,
          ref: `Trip Chalan #${ch.chalanNo} (${truck})`,
          type: 'Fuel Lorry Supplier',
          debit: ch.lorryFreight,
          credit: 0
        });
      });

      // 2. Credits: Payments vouchers paid to supplier
      const supplierPayments = vouchers.filter(v => v.type === 'Payment' && v.partyName === selectedPartyId);
      supplierPayments.forEach(v => {
        entries.push({
          date: v.date,
          ref: `Payment Voucher #${v.voucherNo}`,
          type: 'Supplier Paid',
          debit: 0,
          credit: v.amount
        });
      });

      // 3. Credits: Supplier Advances paid to this supplier
      const supplierAdvs = supplierAdvances.filter(adv => adv.supplierName === selectedPartyId);
      supplierAdvs.forEach(adv => {
        entries.push({
          date: adv.paymentDate,
          ref: `Supplier Advance Ledger`,
          type: 'Advance Paid',
          debit: 0,
          credit: adv.amount
        });
      });
    }

    // Sort entries chronologically by Date
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Filter by dates if they are selected
    let filtered = entries;
    if (fromDate) {
      filtered = filtered.filter(e => new Date(e.date) >= new Date(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter(e => new Date(e.date) <= new Date(toDate));
    }

    // Calculate Running Balance
    let runningBalance = 0;
    return filtered.map(entry => {
      runningBalance = runningBalance + entry.debit - entry.credit;
      return {
        ...entry,
        runningBalance
      };
    });
  };

  const handlePostReceivedPayment = (e) => {
    e.preventDefault();
    if (!activeParty.name) return;

    if (activeLedgerTab === 'party') {
      onCreateVoucher({
        voucherNo: `V-RC-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Receipt',
        partyName: activeParty.name,
        description: paymentDesc,
        amount: Number(paymentAmount)
      });
    } else {
      onCreateVoucher({
        voucherNo: `V-PY-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'Payment',
        partyName: activeParty.name,
        description: paymentDesc || 'Direct supplier payment',
        amount: Number(paymentAmount)
      });
    }

    setPaymentModalOpen(false);
    setPaymentAmount(0);
    setPaymentDesc(activeLedgerTab === 'party' ? 'Direct party payment received' : 'Direct supplier payment');
  };

  const ledgerEntries = getLedgerEntries();
  const activeParty = activeLedgerTab === 'party' 
    ? (customers.find(c => c._id === selectedPartyId) || {})
    : (seededSuppliers.find(s => s.name === selectedPartyId) || {});

  return (
    <div style={styles.container}>
      {/* 1. Top Breadcrumb Navigation */}
      <div style={styles.breadcrumb}>
        <span style={styles.crumbHome}>🏠 Home</span>
        <span style={styles.separator}>&gt;</span>
        <span style={styles.crumbActive}>Ledger</span>
      </div>

      {/* 2. Ledger Corporate Panel Card */}
      <div className="glass-panel" style={styles.ledgerHeaderCard}>
        <h2 style={styles.title}>Ledger</h2>
      </div>

      {/* 3. Action tab rows & compliance alert warning matching Screenshot 7 */}
      <div className="glass-panel" style={styles.tabsRowPanel}>
        <div style={styles.tabRowLeft}>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeLedgerTab === 'party' ? styles.tabBtnActive : {})
            }}
            onClick={() => {
              setActiveLedgerTab('party');
              setSelectedPartyId('');
            }}
          >
            Party Ledger
          </button>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeLedgerTab === 'supplier' ? styles.tabBtnActive : {})
            }}
            onClick={() => {
              setActiveLedgerTab('supplier');
              setSelectedPartyId('');
            }}
          >
            Supplier Ledger
          </button>

          {/* Red Safe Warning compliance alert */}
          <span style={styles.warningText}>
            (When ledger data is deleted then voucher and cash/bank ledger data is not deleted automatically.)
          </span>
        </div>

        {/* Dynamic Ledger Utility Action Buttons on the Right */}
        <div style={styles.tabRowRight}>
          {activeLedgerTab === 'party' ? (
            <>
              <button style={styles.allPartyBtn} onClick={() => setActivePage('all-party-ledger')}>
                All Party Ledger
              </button>
              <button 
                style={styles.addPaymentBtn} 
                onClick={() => setActivePage('party-received-payment')}
              >
                + Add Party Received Payment
              </button>
            </>
          ) : (
            <>
              <button style={styles.allPartyBtn} onClick={() => setActivePage('all-supplier-ledger')}>
                All Supplier Ledger
              </button>
              <button style={styles.advanceLedgerBtn} onClick={() => setActivePage('supplier-advance')}>
                Supplier Advance Ledger
              </button>
              <button style={styles.commissionLedgerBtn} onClick={() => setActivePage('commission-ledger')}>
                Commission Ledger
              </button>
              <button 
                style={styles.addPaymentBtn} 
                onClick={() => setActivePage('supplier-paid-payment')}
              >
                + Add Supplier Paid Payment
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4. Selector Search Bar Panel matching Screenshot 7 */}
      <div className="glass-panel" style={styles.selectorBar}>
        <div style={{
          ...styles.formGrid,
          gridTemplateColumns: activeLedgerTab === 'supplier' ? '2fr 1.5fr 1fr 1fr' : '2fr 1fr 1fr'
        }}>
          <div style={{ ...styles.formGroup }}>
            <label style={styles.label}>
              {activeLedgerTab === 'party' ? 'Party Name' : 'Supplier Name'} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              style={styles.select}
              value={selectedPartyId}
              required
              onChange={(e) => setSelectedPartyId(e.target.value)}
            >
              {activeLedgerTab === 'party' ? (
                <>
                  <option value="">-- Select Party --</option>
                  {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.city})</option>)}
                </>
              ) : (
                <>
                  <option value="">-- Select Supplier --</option>
                  {seededSuppliers.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </>
              )}
            </select>
          </div>

          {activeLedgerTab === 'supplier' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Truck No</label>
              <select
                style={styles.select}
                value={selectedTruckNo}
                onChange={(e) => setSelectedTruckNo(e.target.value)}
              >
                <option value="">-- All Trucks --</option>
                {uniqueVehicles.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>From Date</label>
            <input
              type="date"
              style={styles.dateInput}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>To Date</label>
            <input
              type="date"
              style={styles.dateInput}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 5. Ledger post statement details */}
      {selectedPartyId ? (
        <div className="glass-panel" style={{ backgroundColor: '#ffffff', padding: '0', marginTop: '8px' }}>
          {/* Statement details */}
          <div style={styles.statementHeader}>
            <div>
              <h3 style={{ color: '#0066cc' }}>ACCOUNT LEDGER STATEMENT</h3>
              <p style={styles.partyDetail}><b>Name:</b> {activeParty.name}</p>
              <p style={styles.partyDetail}><b>{activeLedgerTab === 'party' ? 'City' : 'PAN/Phone'}:</b> {activeLedgerTab === 'party' ? activeParty.city : `${activeParty.pan || 'N/A'} / ${activeParty.phone || 'N/A'}`}</p>
              <p style={styles.partyDetail}><b>{activeLedgerTab === 'party' ? 'GSTIN' : 'Address'}:</b> {activeLedgerTab === 'party' ? (activeParty.gstin || 'N/A') : (activeParty.address || 'N/A')}</p>
            </div>
            
            <div style={styles.balanceBadge}>
              <span style={styles.badgeLabel}>NET OUTSTANDING</span>
              <h2 style={{ 
                color: ledgerEntries[ledgerEntries.length - 1]?.runningBalance > 0 ? '#ef4444' : '#10b981',
                fontSize: '2rem'
              }}>
                ₹{(ledgerEntries[ledgerEntries.length - 1]?.runningBalance || 0).toFixed(0)}
              </h2>
            </div>
          </div>

          {/* Table */}
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="custom-table">
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th>Date</th>
                  <th>Description / Voucher No</th>
                  <th>Type</th>
                  <th>Debit (+)</th>
                  <th>Credit (-)</th>
                  <th>Running Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.map((e, idx) => (
                  <tr key={idx}>
                    <td>{e.date}</td>
                    <td style={{ fontWeight: '600' }}>{e.ref}</td>
                    <td><span style={styles.typeTag}>{e.type}</span></td>
                    <td style={{ color: e.debit > 0 ? '#ef4444' : 'inherit', fontWeight: '500' }}>{e.debit > 0 ? `₹${e.debit}` : '-'}</td>
                    <td style={{ color: e.credit > 0 ? '#10b981' : 'inherit', fontWeight: '500' }}>{e.credit > 0 ? `₹${e.credit}` : '-'}</td>
                    <td style={{ fontWeight: '700', color: e.runningBalance > 0 ? '#ef4444' : '#10b981' }}>
                      ₹{e.runningBalance.toFixed(0)}
                    </td>
                  </tr>
                ))}
                {ledgerEntries.length === 0 && (
                  <tr><td colSpan="6" style={styles.noRecords}>No transactions posted for this period.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={styles.promptPanel}>
          <BookOpen size={48} style={{ color: '#cbd5e1', marginBottom: '12px' }} />
          <h3>No Ledger Selection</h3>
          <p>Please select a Party Name from the dropdown search filter above to load accounts ledgers.</p>
        </div>
      )}

      {/* Received Payment overlay modal */}
      {paymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '420px', padding: '24px' }}>
            <h3 style={styles.modalTitle}>{activeLedgerTab === 'party' ? 'Receive Payment' : 'Post Supplier Payment'}</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
              Add a direct {activeLedgerTab === 'party' ? 'received payment cash credit' : 'paid payment cash debit'} entry to the ledger of <b>{activeParty.name}</b>.
            </p>
            <form onSubmit={handlePostReceivedPayment}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>{activeLedgerTab === 'party' ? 'Amount Received (₹) *' : 'Amount Paid (₹) *'}</label>
                <input 
                  type="number" required className="form-control"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Payment Description</label>
                <input 
                  type="text" className="form-control"
                  value={paymentDesc}
                  onChange={(e) => setPaymentDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setPaymentModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{activeLedgerTab === 'party' ? 'Credit Ledger' : 'Debit Ledger'}</button>
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
    gap: '16px'
  },
  breadcrumb: {
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#64748b',
    fontWeight: '500'
  },
  crumbHome: {
    cursor: 'pointer'
  },
  crumbActive: {
    color: '#0066cc',
    fontWeight: '600'
  },
  separator: {
    color: '#94a3b8'
  },
  ledgerHeaderCard: {
    backgroundColor: '#ffffff',
    padding: '16px 20px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px'
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#0f172a'
  },
  tabsRowPanel: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  tabRowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  tabBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    color: '#475569',
    padding: '8px 12px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s'
  },
  tabBtnActive: {
    color: '#0066cc',
    borderBottomColor: '#0066cc'
  },
  warningText: {
    fontSize: '0.72rem',
    color: '#ef4444',
    fontWeight: '600',
    letterSpacing: '-0.01em'
  },
  tabRowRight: {
    display: 'flex',
    gap: '10px'
  },
  allPartyBtn: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 14px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  advanceLedgerBtn: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 14px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  commissionLedgerBtn: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 14px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  addPaymentBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 14px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  selectorBar: {
    backgroundColor: '#f8fafc', // matches screenshot 7 selector bg
    border: '1px solid #cbd5e1',
    padding: '20px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '20px',
    width: '100%',
    alignItems: 'center'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#334155'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#ffffff',
    outline: 'none',
    color: '#1e293b'
  },
  dateInput: {
    padding: '7px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#ffffff',
    outline: 'none',
    color: '#1e293b'
  },
  statementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    borderRadius: '8px 8px 0 0'
  },
  partyDetail: {
    fontSize: '0.8rem',
    color: '#475569',
    marginTop: '2px'
  },
  balanceBadge: {
    border: '1px solid #e2e8f0',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    textAlign: 'center'
  },
  badgeLabel: {
    fontSize: '0.65rem',
    color: '#64748b',
    fontWeight: '700'
  },
  typeTag: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  noRecords: {
    textAlign: 'center',
    color: '#cbd5e1',
    padding: '30px 0'
  },
  promptPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: '#ffffff',
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#64748b'
  },
  modalTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '8px',
    marginBottom: '14px'
  }
};
