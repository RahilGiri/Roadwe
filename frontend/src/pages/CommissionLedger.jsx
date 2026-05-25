import React, { useState, useEffect } from 'react';
import { Home, Calendar, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function CommissionLedger({ chalans = [], seededSuppliers = [], setActivePage }) {
  // Master lists
  const suppliersList = seededSuppliers.length > 0 ? seededSuppliers : [
    { name: 'SANDEEP KUMAR' },
    { name: 'SHYAM JI MISHRA' },
    { name: 'DELHI GUJRAT FLEET CARRIER PVT LTD' },
    { name: 'LKO KANPUR GOODS CARRIERS' },
    { name: 'LUCKNOW KANPUR ROADLINES' },
    { name: 'RIZWAN SIDDIQUI' },
    { name: 'RAJU' },
    { name: 'DIPAKKUMAR PRAJAPATI' },
    { name: 'RAKESH PANDEY' }
  ];

  const getUniqueVehicles = () => {
    const list = new Set();
    chalans.forEach(ch => {
      const v = `${ch.vPart1 || ''}${ch.vPart2 || ''}${ch.vPart3 || ''}${ch.vPart4 || ''}`;
      if (v.trim()) list.add(v.trim());
    });
    list.add('UP-77-AN-4876');
    list.add('DL-01-GB-1234');
    list.add('MH-12-PQ-9999');
    return Array.from(list);
  };
  const uniqueVehicles = getUniqueVehicles();

  // Filters State
  const [supplierName, setSupplierName] = useState('Select Supplier Name');
  const [truckNo, setTruckNo] = useState('Select Truck No.');
  const [commissionStatus, setCommissionStatus] = useState('Select Commission Status');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2027-03-31');

  // Applied Filters State
  const [appliedFilters, setAppliedFilters] = useState({
    supplierName: 'Select Supplier Name',
    truckNo: 'Select Truck No.',
    commissionStatus: 'Select Commission Status',
    fromDate: '2026-04-01',
    toDate: '2027-03-31'
  });

  const handleApply = () => {
    setAppliedFilters({
      supplierName,
      truckNo,
      commissionStatus,
      fromDate,
      toDate
    });
  };

  const handleReset = () => {
    setSupplierName('Select Supplier Name');
    setTruckNo('Select Truck No.');
    setCommissionStatus('Select Commission Status');
    setFromDate('2026-04-01');
    setToDate('2027-03-31');
    setAppliedFilters({
      supplierName: 'Select Supplier Name',
      truckNo: 'Select Truck No.',
      commissionStatus: 'Select Commission Status',
      fromDate: '2026-04-01',
      toDate: '2027-03-31'
    });
  };

  // Compile matching records
  const getCommissionRows = () => {
    let list = [];
    chalans.forEach(ch => {
      // Must have a commission amount set
      const commAmt = ch.commissionAmount || 0;
      if (commAmt <= 0) return;

      const dateStr = ch.date;
      if (appliedFilters.fromDate && dateStr < appliedFilters.fromDate) return;
      if (appliedFilters.toDate && dateStr > appliedFilters.toDate) return;

      if (appliedFilters.supplierName !== 'Select Supplier Name' && ch.supplierName !== appliedFilters.supplierName) return;

      const truck = `${ch.vPart1 || ''}${ch.vPart2 || ''}${ch.vPart3 || ''}${ch.vPart4 || ''}`;
      if (appliedFilters.truckNo !== 'Select Truck No.' && truck !== appliedFilters.truckNo) return;

      const status = ch.commissionStatus || 'Pending';
      if (appliedFilters.commissionStatus !== 'Select Commission Status' && status !== appliedFilters.commissionStatus) return;

      list.push({
        _id: ch._id,
        date: ch.date || 'N/A',
        memoNo: `CH-${ch.chalanNo || 'N/A'}`,
        supplierName: ch.supplierName || 'N/A',
        truckNo: truck || 'N/A',
        amount: commAmt,
        status: status
      });
    });

    // Sort chronologically by date
    list.sort((a, b) => new Date(a.date) - new Date(b.date));
    return list;
  };

  const rows = getCommissionRows();

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
          <span style={styles.breadcrumbActive}>Commission Ledger</span>
        </div>
        
        <button 
          style={styles.headerBlueBtn} 
          onClick={() => setActivePage('ledger')}
        >
          Ledger List
        </button>
      </div>

      <div style={styles.mainCard}>
        <h2 style={styles.cardTitle}>Commission Ledger</h2>

        {/* Filters Panel matching Screenshot 1 */}
        <div style={styles.filtersBox}>
          <h4 style={styles.filtersHeading}>Filters :</h4>
          <div style={styles.filtersGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Supplier Name</label>
              <select 
                className="form-control" 
                style={styles.filterInput}
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              >
                <option value="Select Supplier Name">Select Supplier Name</option>
                {suppliersList.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Truck No.</label>
              <select 
                className="form-control" 
                style={styles.filterInput}
                value={truckNo}
                onChange={(e) => setTruckNo(e.target.value)}
              >
                <option value="Select Truck No.">Select Truck No.</option>
                {uniqueVehicles.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Commission Status :</label>
              <select 
                className="form-control" 
                style={styles.filterInput}
                value={commissionStatus}
                onChange={(e) => setCommissionStatus(e.target.value)}
              >
                <option value="Select Commission Status">Select Commission Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div style={{ ...styles.filtersGrid, marginTop: '12px' }}>
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

        {/* Details Table view */}
        <div className="table-container" style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginTop: '20px' }}>
          <table className="custom-table" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ width: '60px' }}>S.No.</th>
                <th>Date</th>
                <th>Memo No.</th>
                <th>Supplier Name</th>
                <th>Truck No.</th>
                <th>Commission Amount</th>
                <th>Commission Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row._id}>
                  <td>{idx + 1}</td>
                  <td>{row.date}</td>
                  <td style={{ fontWeight: '700', color: '#0066cc' }}>{row.memoNo}</td>
                  <td style={{ fontWeight: '700' }}>{row.supplierName}</td>
                  <td style={{ fontWeight: '600' }}>{row.truckNo}</td>
                  <td style={{ color: '#ef4444', fontWeight: '800' }}>₹{row.amount}/-</td>
                  <td>
                    <span className={`status-badge ${row.status.toLowerCase() === 'paid' ? 'delivered' : 'dispatched'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px 0', color: '#64748b', fontWeight: '600' }}>
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
  }
};
