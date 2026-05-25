import React, { useState } from 'react';
import { Home, Calendar, ShieldAlert } from 'lucide-react';

export default function AllLedgerSummary({ 
  mode = 'party', customers = [], seededSuppliers = [], invoices = [], vouchers = [], chalans = [], supplierAdvances = [], setActivePage 
}) {
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2027-03-31');

  // Filters actually applied
  const [appliedFromDate, setAppliedFromDate] = useState('2026-04-01');
  const [appliedToDate, setAppliedToDate] = useState('2027-03-31');

  // Local Seeded Suppliers matching master if not passed
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

  // Dynamically compile rows based on mode and date bounds
  const getSummaryRows = () => {
    let rows = [];

    const isDateInRange = (dateStr) => {
      if (!dateStr) return true;
      if (appliedFromDate && dateStr < appliedFromDate) return false;
      if (appliedToDate && dateStr > appliedToDate) return false;
      return true;
    };

    if (mode === 'party') {
      customers.forEach(c => {
        // Debits: Invoices billed to this customer
        const partyInvoices = invoices.filter(inv => inv.customerId === c._id && isDateInRange(inv.date));
        const totalBills = partyInvoices.length;
        const totalDebit = partyInvoices.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);

        // Credits: Receipt vouchers paid by this customer
        const partyReceipts = vouchers.filter(v => v.type === 'Receipt' && v.partyName === c.name && isDateInRange(v.date));
        const totalCredit = partyReceipts.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        const balance = totalDebit - totalCredit;

        rows.push({
          id: c._id,
          name: c.name,
          gst: c.gstin || 'N/A',
          billCount: totalBills,
          debit: totalDebit,
          credit: totalCredit,
          balance: balance
        });
      });
    } else if (mode === 'commission') {
      // Commission Ledger mode: track driver/supplier commissions on Hired Trip Chalans
      chalans.forEach(ch => {
        if (isDateInRange(ch.date)) {
          const commAmt = ch.commissionAmount || 0;
          const tds = ch.tdsAmount || 0;
          const balance = commAmt - tds;

          rows.push({
            id: ch._id,
            name: ch.supplierName || 'Manual Supplier',
            chalanNo: ch.chalanNo || 'N/A',
            date: ch.date || 'N/A',
            truckNo: `${ch.vPart1 || ''}${ch.vPart2 || ''}${ch.vPart3 || ''}${ch.vPart4 || ''}` || 'N/A',
            commType: ch.commissionType || 'Fixed',
            debit: commAmt,
            credit: tds,
            balance: balance,
            status: ch.commissionStatus || 'Paid'
          });
        }
      });
    } else {
      // Supplier mode - matching Screenshot 3's exact financial breakdown
      suppliersList.forEach(s => {
        // Debits: Hired lorry cost (Trip Chalans)
        const supplierChalans = chalans.filter(ch => ch.supplierName === s.name && isDateInRange(ch.date));
        const totalNoOfMemo = supplierChalans.length;
        const totalFreightAmt = supplierChalans.reduce((acc, curr) => acc + (curr.lorryFreight || 0), 0);
        const totalAdvanceAmt = supplierChalans.reduce((acc, curr) => acc + (curr.advancePaid || curr.totalAdvance || 0), 0);
        const totalBalanceAmt = supplierChalans.reduce((acc, curr) => acc + (curr.balanceToDriver || 0), 0);

        // Credits: Direct Payment Vouchers
        const supplierPayments = vouchers.filter(v => v.type === 'Payment' && v.partyName === s.name && isDateInRange(v.date));
        const totalPaidAmt = supplierPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        // Total Due
        const totalDueAmt = totalBalanceAmt; // Due represents driver outstanding balance

        // Total Commission
        const totalCommAmt = supplierChalans.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0);

        rows.push({
          id: s.name,
          name: s.name,
          pan: s.pan || 'N/A',
          memoCount: totalNoOfMemo,
          freightAmt: totalFreightAmt,
          advanceAmt: totalAdvanceAmt,
          balanceAmt: totalBalanceAmt,
          paidAmt: totalPaidAmt,
          dueAmt: totalDueAmt,
          commAmt: totalCommAmt,

          // Legacy placeholders for fallback aggregates
          debit: totalFreightAmt,
          credit: totalAdvanceAmt + totalPaidAmt,
          balance: totalDueAmt
        });
      });
    }

    return rows;
  };

  const rows = getSummaryRows();

  // Aggregate totals
  const totalCount = rows.length;
  const sumDebits = rows.reduce((acc, curr) => acc + curr.debit, 0);
  const sumCredits = rows.reduce((acc, curr) => acc + curr.credit, 0);
  const sumBalances = rows.reduce((acc, curr) => acc + curr.balance, 0);

  // Supplier-specific dynamic aggregates matching Screenshot 3 exactly
  const sumFreight = mode === 'supplier' ? rows.reduce((acc, curr) => acc + curr.freightAmt, 0) : 0;
  const sumAdvance = mode === 'supplier' ? rows.reduce((acc, curr) => acc + curr.advanceAmt, 0) : 0;
  const sumBalance = mode === 'supplier' ? rows.reduce((acc, curr) => acc + curr.balanceAmt, 0) : 0;
  const sumPaid = mode === 'supplier' ? rows.reduce((acc, curr) => acc + curr.paidAmt, 0) : 0;
  const sumDue = mode === 'supplier' ? rows.reduce((acc, curr) => acc + curr.dueAmt, 0) : 0;
  const sumComm = mode === 'supplier' ? rows.reduce((acc, curr) => acc + curr.commAmt, 0) : 0;

  const handleApply = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const handleReset = () => {
    setFromDate('2026-04-01');
    setToDate('2027-03-31');
    setAppliedFromDate('2026-04-01');
    setAppliedToDate('2027-03-31');
  };

  const getPageTitle = () => {
    if (mode === 'party') return 'All Party Ledger';
    if (mode === 'commission') return 'Commission Ledger Register';
    return 'All Supplier Ledger';
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
          <span style={styles.breadcrumbActive}>
            {getPageTitle()}
          </span>
        </div>
        
        <button 
          style={styles.headerBlueBtn} 
          onClick={() => setActivePage('ledger')}
        >
          Ledger List
        </button>
      </div>

      <div style={styles.mainCard}>
        <h2 style={styles.cardTitle}>
          {getPageTitle()}
        </h2>

        {/* Date Filters Card */}
        <div style={styles.filtersBox}>
          <h4 style={styles.filtersHeading}>Filters :</h4>
          <div style={styles.filtersGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>From Date :</label>
              <input 
                type="date" 
                className="form-control" 
                style={styles.filterInput} 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>To Date :</label>
              <input 
                type="date" 
                className="form-control" 
                style={styles.filterInput} 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div style={styles.filtersButtons}>
              <button style={styles.applyBtn} onClick={handleApply}>Apply</button>
              <button style={styles.resetBtn} onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>

        {/* Calculations summaries row matching screenshots exactly */}
        {mode === 'supplier' ? (
          <div style={styles.summaryBarCol}>
            <div style={styles.summaryRow}>
              <span style={{ marginRight: '24px' }}>Total Supplier : <strong>{totalCount}</strong></span>
              <span>Total Commission : <strong style={{ color: '#6366f1' }}>₹{sumComm}</strong></span>
            </div>
            <div style={{ ...styles.summaryRow, marginTop: '8px' }}>
              <span style={{ marginRight: '16px' }}>Total Freight : <strong style={{ color: '#ef4444' }}>₹{sumFreight}</strong></span>
              <span style={{ marginRight: '16px' }}>Total Advance : <strong style={{ color: '#10b981' }}>₹{sumAdvance}</strong></span>
              <span style={{ marginRight: '16px' }}>Total Balance : <strong style={{ color: '#ef4444' }}>₹{sumBalance}</strong></span>
              <span style={{ marginRight: '16px' }}>Total Paid : <strong style={{ color: '#10b981' }}>₹{sumPaid}</strong></span>
              <span>Net Due Amount : <strong style={{ color: '#ef4444' }}>₹{sumDue}</strong></span>
            </div>
          </div>
        ) : (
          <div style={styles.summaryBar}>
            <span style={styles.summaryItem}>
              {mode === 'commission' ? 'Total Records' : `Total ${mode === 'party' ? 'Party' : 'Supplier'}`} = <strong>{totalCount}</strong>
            </span>
            <span style={styles.summarySeparator}>|</span>
            <span style={styles.summaryItem}>
              {mode === 'commission' ? 'Total Commission' : 'Total Debit'} = <strong style={{ color: '#ef4444' }}>₹{sumDebits}</strong>
            </span>
            <span style={styles.summarySeparator}>|</span>
            <span style={styles.summaryItem}>
              {mode === 'commission' ? 'Total TDS Deducted' : 'Total Credit'} = <strong style={{ color: '#10b981' }}>₹{sumCredits}</strong>
            </span>
            <span style={styles.summarySeparator}>|</span>
            <span style={styles.summaryItem}>
              {mode === 'commission' ? 'Net Commission Payable' : 'Net Balance'} = <strong style={{ color: '#ef4444' }}>₹{sumBalances}</strong>
            </span>
          </div>
        )}

        {/* Details Table view */}
        <div className="table-container" style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginTop: '20px' }}>
          <table className="custom-table" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ width: '60px' }}>SNo.</th>
                {mode === 'commission' ? (
                  <>
                    <th>Chalan No.</th>
                    <th>Date</th>
                    <th>Truck No.</th>
                    <th>Supplier Name</th>
                    <th>Commission Amt</th>
                    <th>TDS (₹)</th>
                    <th>Net Balance</th>
                    <th>Status</th>
                  </>
                ) : mode === 'supplier' ? (
                  <>
                    <th>Supplier Name</th>
                    <th>Supplier PAN No.</th>
                    <th>Total No. of Memo</th>
                    <th>Total Freight Amount</th>
                    <th>Total Advance Amount</th>
                    <th>Total Balance Amount</th>
                    <th>Total Paid Amount</th>
                    <th>Total Due Amount</th>
                    <th>Total Commission Amount</th>
                  </>
                ) : (
                  <>
                    <th>Party Name</th>
                    <th>Party GST</th>
                    <th>Total No. of Bill</th>
                    <th>Total Debit</th>
                    <th>Total Credit</th>
                    <th>Total Balance</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td>{idx + 1}</td>
                  {mode === 'commission' ? (
                    <>
                      <td style={{ fontWeight: '700', color: '#0066cc' }}>{row.chalanNo}</td>
                      <td>{row.date}</td>
                      <td style={{ fontWeight: '600' }}>{row.truckNo}</td>
                      <td>{row.name}</td>
                      <td style={{ color: '#ef4444', fontWeight: '500' }}>₹{row.debit}/-</td>
                      <td style={{ color: '#10b981', fontWeight: '500' }}>₹{row.credit}/-</td>
                      <td style={{ fontWeight: '800', color: '#ef4444' }}>₹{row.balance}/-</td>
                      <td>
                        <span className={`status-badge ${row.status.toLowerCase() === 'paid' ? 'delivered' : 'dispatched'}`}>
                          {row.status}
                        </span>
                      </td>
                    </>
                  ) : mode === 'supplier' ? (
                    <>
                      <td style={{ fontWeight: '700' }}>{row.name}</td>
                      <td>{row.pan}</td>
                      <td style={{ fontWeight: '600' }}>{row.memoCount}</td>
                      <td style={{ color: '#ef4444', fontWeight: '500' }}>₹{row.freightAmt}/-</td>
                      <td style={{ color: '#10b981', fontWeight: '500' }}>₹{row.advanceAmt}/-</td>
                      <td style={{ color: '#ef4444', fontWeight: '500' }}>₹{row.balanceAmt}/-</td>
                      <td style={{ color: '#10b981', fontWeight: '500' }}>₹{row.paidAmt}/-</td>
                      <td style={{ color: '#ef4444', fontWeight: '800' }}>₹{row.dueAmt}/-</td>
                      <td style={{ color: '#6366f1', fontWeight: '600' }}>₹{row.commAmt}/-</td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: '700' }}>{row.name}</td>
                      <td>{row.gst}</td>
                      <td style={{ fontWeight: '600' }}>{row.billCount}</td>
                      <td style={{ color: '#ef4444', fontWeight: '500' }}>₹{row.debit}/-</td>
                      <td style={{ color: '#10b981', fontWeight: '500' }}>₹{row.credit}/-</td>
                      <td style={{ fontWeight: '800', color: row.balance > 0 ? '#ef4444' : '#10b981' }}>
                        ₹{row.balance}/-
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={mode === 'commission' ? 9 : mode === 'supplier' ? 10 : 7} style={{ textAlign: 'center', padding: '36px 0', color: '#64748b', fontWeight: '600' }}>
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
    minWidth: '200px',
    flex: 1
  },
  filterLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569'
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
    padding: '9px 28px',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  resetBtn: {
    backgroundColor: '#ff4d4d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '9px 28px',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  summaryBar: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '12px 20px',
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#334155',
    fontWeight: '600'
  },
  summaryBarCol: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    color: '#334155',
    fontWeight: '600'
  },
  summaryRow: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  summarySeparator: {
    color: '#cbd5e1',
    fontWeight: '400'
  }
};
