import React, { useState } from 'react';
import { Plus, Search, Trash2, Fuel, Users, Landmark, FileSpreadsheet, Building, Truck, X } from 'lucide-react';

export default function Accounts({ activePage, setActivePage }) {
  // Determine sub-tab selection based on sidebar navigation
  // Option maps:
  // - accounts-pump (Pump Master)
  // - accounts-driver-khata (Driver/EMP Khata)
  // - accounts-bilty-expense (Bilty Expense)
  // - accounts-loading-expense (Loading Slip Expense)
  // - accounts-truck-expense (Direct Truck Expense)
  // - accounts-office-expense (Office Expense)

  // Staged local masters
  const [pumps, setPumps] = useState([
    { _id: 'p1', name: 'HP Pump (Vadodara Express)', city: 'Vadodara', dieselRate: 89.5, creditLimit: 200000 },
    { _id: 'p2', name: 'Reliance Fuel Depot', city: 'Jamnagar', dieselRate: 88.2, creditLimit: 500000 }
  ]);

  const [staffKhata, setStaffKhata] = useState([
    { _id: 's1', name: 'Ramesh Singh (Driver)', role: 'Driver', balance: -10000, desc: 'Trip Advance for Slip #504' },
    { _id: 's2', name: 'Sanjay Dutt (Clerk)', role: 'Loading Clerk', balance: 18000, desc: 'May 2026 Monthly Salary Credit' }
  ]);

  const [expenses, setExpenses] = useState([
    { _id: 'e1', type: 'Bilty', docNo: '1000011205', category: 'Labor / Hamali', amount: 1200, desc: 'Unloading charges paid' },
    { _id: 'e2', type: 'Truck', docNo: 'UP-77-AN-4876', category: 'Toll plaza tax', amount: 3400, desc: 'NH8 NH48 FASTag Toll debit' },
    { _id: 'e3', type: 'Office', docNo: 'GEN-204', category: 'Internet Bills', amount: 1500, desc: 'Office Wi-Fi broadband billing' }
  ]);

  // Form modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState('pump'); // pump, staff, expense

  // Pump Form
  const [pumpName, setPumpName] = useState('');
  const [pumpCity, setPumpCity] = useState('');
  const [pumpRate, setPumpRate] = useState('');
  const [pumpLimit, setPumpLimit] = useState('');

  // Staff Form
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Driver');
  const [staffBalance, setStaffBalance] = useState('');

  // Expense Form
  const [expType, setExpType] = useState('Bilty');
  const [expDocNo, setExpDocNo] = useState('');
  const [expCategory, setExpCategory] = useState('Office Stationery');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  const isPump = activePage === 'accounts-pump';
  const isDriverKhata = activePage === 'accounts-driver-khata';
  const isBiltyExp = activePage === 'accounts-bilty-expense';
  const isLoadingExp = activePage === 'accounts-loading-expense';
  const isTruckExp = activePage === 'accounts-direct-truck-expense' || activePage === 'accounts-truck-expense';
  const isOfficeExp = activePage === 'accounts-office-expense';

  const handleOpenAdd = () => {
    if (isPump) {
      setPumpName('');
      setPumpCity('');
      setPumpRate('');
      setPumpLimit('');
      setActiveForm('pump');
    } else if (isDriverKhata) {
      setStaffName('');
      setStaffRole('Driver');
      setStaffBalance('');
      setActiveForm('staff');
    } else {
      setExpType(isBiltyExp ? 'Bilty' : isLoadingExp ? 'Loading Slip' : isTruckExp ? 'Truck' : 'Office');
      setExpDocNo('');
      setExpCategory(isOfficeExp ? 'Office Stationery' : 'Fuel / Toll');
      setExpAmount('');
      setExpDesc('');
      setActiveForm('expense');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (activeForm === 'pump') {
      const newPump = {
        _id: Math.random().toString(),
        name: pumpName,
        city: pumpCity,
        dieselRate: parseFloat(pumpRate) || 0,
        creditLimit: parseFloat(pumpLimit) || 0
      };
      setPumps([...pumps, newPump]);
    } else if (activeForm === 'staff') {
      const newStaff = {
        _id: Math.random().toString(),
        name: staffName,
        role: staffRole,
        balance: parseFloat(staffBalance) || 0,
        desc: 'Opening balance provision'
      };
      setStaffKhata([...staffKhata, newStaff]);
    } else {
      const newExp = {
        _id: Math.random().toString(),
        type: expType,
        docNo: expDocNo,
        category: expCategory,
        amount: parseFloat(expAmount) || 0,
        desc: expDesc
      };
      setExpenses([newExp, ...expenses]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="glass-panel" style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '24px' }}>
      
      {/* Breadcrumbs */}
      <div style={styles.breadcrumbs}>
        <span style={{ cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('dashboard')}>🏠 Home</span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={{ cursor: 'pointer' }} onClick={() => setActivePage && setActivePage('accounts-pump')}>Accounts</span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>
          {isPump && 'Pump Master'}
          {isDriverKhata && 'Driver/EMP Khata'}
          {isBiltyExp && 'Bilty Expense'}
          {isLoadingExp && 'Loading Slip Expense'}
          {isTruckExp && 'Direct Truck Expense'}
          {isOfficeExp && 'Office Expense'}
        </span>
      </div>

      {/* Header Row */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>
            {isPump && '⛽ Fuel Pump Station Masters'}
            {isDriverKhata && '👥 Drivers & Employee Salary Khata'}
            {isBiltyExp && '📄 Bilty Shipment Expense Register'}
            {isLoadingExp && '📋 Loading Slip Dispatch Expenses'}
            {isTruckExp && '🚚 Direct Vehicle Operating Trip Expenses'}
            {isOfficeExp && '🏢 Office General Administrative Bills'}
          </h2>
          <p style={styles.subtitle}>
            {isPump && 'Configure diesel credit terminals at key highway intersections connected with digital billing logs.'}
            {isDriverKhata && 'Bookkeeper ledger tracking driver Advances, monthly salary credits, and running staff balances.'}
            {isBiltyExp || isLoadingExp || isTruckExp || isOfficeExp ? 'Directly book operational trip cash outflows and fastag debits.' : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd} style={styles.addButton}>
          <Plus size={16} /> Add {isPump ? 'Pump Depot' : isDriverKhata ? 'Employee A/C' : 'Expense Record'}
        </button>
      </div>

      {/* Dynamic Sub-tab Listings */}
      {isPump && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Pump Depot Name</th>
                <th>City Location</th>
                <th>Standard Diesel Rate</th>
                <th>Active Fuel Credit Limit</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pumps.map(pump => (
                <tr key={pump._id}>
                  <td style={{ fontWeight: '700', color: '#0066cc' }}>
                    <Fuel size={14} style={{ marginRight: 6, color: '#ef4444' }} />
                    {pump.name}
                  </td>
                  <td style={{ fontWeight: '600' }}>{pump.city}</td>
                  <td style={{ fontWeight: '700', color: '#10b981' }}>₹{pump.dieselRate}/Ltr</td>
                  <td style={{ fontFamily: 'Outfit', fontWeight: '600' }}>₹{pump.creditLimit.toLocaleString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn-icon btn-danger" onClick={() => setPumps(pumps.filter(p => p._id !== pump._id))}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isDriverKhata && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee / Driver Name</th>
                <th>Designated Role</th>
                <th>Narrative Summary</th>
                <th style={{ textAlign: 'right' }}>Running Balance</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffKhata.map(staff => (
                <tr key={staff._id}>
                  <td style={{ fontWeight: '700', color: '#334155' }}>
                    <Users size={14} style={{ marginRight: 6, color: '#0066cc' }} />
                    {staff.name}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                      {staff.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{staff.desc}</td>
                  <td style={{ textAlign: 'right', fontWeight: '700', color: staff.balance < 0 ? '#ef4444' : '#10b981', fontFamily: 'Outfit' }}>
                    {staff.balance < 0 ? `₹${Math.abs(staff.balance).toLocaleString()} Dr (Advance)` : `₹${staff.balance.toLocaleString()} Cr (Wage)`}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn-icon btn-danger" onClick={() => setStaffKhata(staffKhata.filter(s => s._id !== staff._id))}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(isBiltyExp || isLoadingExp || isTruckExp || isOfficeExp) && (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference Type</th>
                <th>Ref ID / Doc No</th>
                <th>Expense Head Category</th>
                <th>Narrative Details</th>
                <th style={{ textAlign: 'right' }}>Outflow Amount</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses
                .filter(e => {
                  if (isBiltyExp) return e.type === 'Bilty';
                  if (isLoadingExp) return e.type === 'Loading Slip';
                  if (isTruckExp) return e.type === 'Truck';
                  return e.type === 'Office';
                })
                .map(exp => (
                  <tr key={exp._id}>
                    <td style={{ fontWeight: '700', color: '#475569' }}>{exp.type}</td>
                    <td style={{ fontWeight: '600', color: '#0066cc' }}>{exp.docNo}</td>
                    <td style={{ fontWeight: '700' }}>{exp.category}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{exp.desc}</td>
                    <td style={{ textAlign: 'right', fontWeight: '700', color: '#ef4444', fontFamily: 'Outfit' }}>
                      ₹{exp.amount.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon btn-danger" onClick={() => setExpenses(expenses.filter(e => e._id !== exp._id))}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pop-up Modals */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, color: '#0066cc' }}>
                {activeForm === 'pump' && '⛽ New Fuel Pump Depot'}
                {activeForm === 'staff' && '👤 Add Staff Khata Profile'}
                {activeForm === 'expense' && '📄 Record Expense Cash Outflow'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSave} style={{ padding: '20px' }}>
              {activeForm === 'pump' && (
                <>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Pump Station Name *</label>
                    <input 
                      type="text" required className="form-control"
                      placeholder="e.g. HP Pump Vadodara HQ"
                      value={pumpName} onChange={(e) => setPumpName(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>City Location *</label>
                    <input 
                      type="text" required className="form-control"
                      placeholder="e.g. Vadodara"
                      value={pumpCity} onChange={(e) => setPumpCity(e.target.value)}
                    />
                  </div>
                  <div className="form-grid" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label>Diesel Price (₹/Ltr) *</label>
                      <input 
                        type="number" required step="0.01" className="form-control"
                        placeholder="89.5"
                        value={pumpRate} onChange={(e) => setPumpRate(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Credit Limit (₹)</label>
                      <input 
                        type="number" className="form-control"
                        placeholder="200000"
                        value={pumpLimit} onChange={(e) => setPumpLimit(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeForm === 'staff' && (
                <>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Staff / Driver Name *</label>
                    <input 
                      type="text" required className="form-control"
                      placeholder="e.g. Ramesh Singh"
                      value={staffName} onChange={(e) => setStaffName(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Role Capacity *</label>
                    <select className="form-control" value={staffRole} onChange={(e) => setStaffRole(e.target.value)}>
                      <option value="Driver">Trip Driver</option>
                      <option value="Loading Clerk">Loading Clerk</option>
                      <option value="Accountant">Branch Accountant</option>
                      <option value="Manager">Office Manager</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Opening Wage Balance / Advance (₹) *</label>
                    <input 
                      type="number" required className="form-control"
                      placeholder="e.g. -5000 for advance, 12000 for wage credit"
                      value={staffBalance} onChange={(e) => setStaffBalance(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeForm === 'expense' && (
                <>
                  <div className="form-grid" style={{ marginBottom: '12px' }}>
                    <div className="form-group">
                      <label>Ref Type *</label>
                      <select className="form-control" value={expType} onChange={(e) => setExpType(e.target.value)}>
                        <option value="Bilty">Bilty Lorry</option>
                        <option value="Loading Slip">Loading Slip</option>
                        <option value="Truck">Truck Direct</option>
                        <option value="Office">Office Admin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Doc / Truck No *</label>
                      <input 
                        type="text" required className="form-control"
                        placeholder="e.g. 1000011205"
                        value={expDocNo} onChange={(e) => setExpDocNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Expense Head Category *</label>
                    <input 
                      type="text" required className="form-control"
                      placeholder="e.g. Tea / Coffee, Fastag toll, Lorry loading"
                      value={expCategory} onChange={(e) => setExpCategory(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label>Outflow Amount (₹) *</label>
                    <input 
                      type="number" required className="form-control"
                      placeholder="1200"
                      value={expAmount} onChange={(e) => setExpAmount(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Narrative Description</label>
                    <textarea 
                      className="form-control"
                      rows="2"
                      placeholder="Enter specific trip or invoice breakdown details..."
                      value={expDesc} onChange={(e) => setExpDesc(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Book Account Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '16px'
  },
  breadcrumbSeparator: {
    color: '#94a3b8'
  },
  breadcrumbActive: {
    color: '#0066cc',
    fontWeight: '600'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#0f172a'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '4px'
  },
  addButton: {
    padding: '8px 16px',
    fontSize: '0.85rem'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer'
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px',
    marginTop: '16px'
  }
};
