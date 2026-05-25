import React, { useState, useEffect } from 'react';
import { Home, ChevronsUpDown, Trash2, X } from 'lucide-react';

const API_BASE = '/api';

export default function CashBank({ token, activePage, setActivePage }) {
  // Local list states with localStorage persistence
  const [cashiers, setCashiers] = useState(() => {
    const saved = localStorage.getItem('roadwe_cashiers_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) { }
    }
    return [
      { _id: 'c_seed_1', cashierName: 'Admin Main Drawer', openingBalance: 50000, closingBalance: 50000, status: 'Enable' },
      { _id: 'c_seed_2', cashierName: 'Vadodara Hub Petty Cash', openingBalance: 15000, closingBalance: 15000, status: 'Enable' }
    ];
  });

  const [banks, setBanks] = useState(() => {
    const saved = localStorage.getItem('roadwe_banks_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) { }
    }
    return [
      { _id: 'b_seed_1', bankName: 'HDFC Bank - A/C 5020008174', accHolderName: 'TRANSCORE LOGISTICS', accNumber: '50200081740922', ifscCode: 'HDFC0000245', openingBalance: 250000, closingBalance: 250000, status: 'Enable' },
      { _id: 'b_seed_2', bankName: 'SBI - A/C 3102452291', accHolderName: 'TRANSCORE LOGISTICS', accNumber: '310245229188', ifscCode: 'SBIN0001070', openingBalance: 120000, closingBalance: 120000, status: 'Enable' }
    ];
  });

  const [khataTransactions, setKhataTransactions] = useState(() => {
    const saved = localStorage.getItem('roadwe_khata_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) { }
    }
    return [
      { _id: 'tx_1', date: '2026-05-20', tabType: 'cash', name: 'Admin Main Drawer', reason: 'Office Rent Payment', remark: 'Paid to landlord for Vadodara hub', createdBy: 'ADMIN', debit: 8000, credit: 0 },
      { _id: 'tx_2', date: '2026-05-22', tabType: 'cash', name: 'Vadodara Hub Petty Cash', reason: 'Fuel Expense Reimbursement', remark: 'Cash given to driver Ramesh Singh', createdBy: 'ADMIN', debit: 3500, credit: 0 },
      { _id: 'tx_3', date: '2026-05-23', tabType: 'bank', name: 'HDFC Bank - A/C 5020008174', reason: 'Party Freight Received', remark: 'Payment from TATA STEEL LTD', createdBy: 'ADMIN', debit: 0, credit: 41000 },
      { _id: 'tx_4', date: '2026-05-24', tabType: 'bank', name: 'SBI - A/C 3102452291', reason: 'Office Electricity Bill', remark: 'Paid via NetBanking', createdBy: 'ADMIN', debit: 4800, credit: 0 }
    ];
  });

  // Local page sub-views
  const [cashSubView, setCashSubView] = useState('list'); // 'list' or 'create'
  const [bankSubView, setBankSubView] = useState('list'); // 'list' or 'create'
  const [khataActiveTab, setKhataActiveTab] = useState('cash'); // 'cash' or 'bank'

  // Filter Options Modal States (Milestone 29)
  const [isKhataFilterModalOpen, setIsKhataFilterModalOpen] = useState(false);
  const [khataFilterModalType, setKhataFilterModalType] = useState('filter'); // 'filter' or 'report'
  const [khataFilterName, setKhataFilterName] = useState('');
  const [khataFilterFromDate, setKhataFilterFromDate] = useState('');
  const [khataFilterToDate, setKhataFilterToDate] = useState('');
  const [activeKhataFilters, setActiveKhataFilters] = useState(null);

  // Printing states (Milestone 29)
  const [printingKhataReport, setPrintingKhataReport] = useState(null);
  const [repFromDate, setRepFromDate] = useState('');
  const [repToDate, setRepToDate] = useState('');
  const [repSelectedName, setRepSelectedName] = useState('');

  // Determine primary tab from activePage prop
  const isCashPage = activePage === 'cashbank-cash-master';
  const isBankPage = activePage === 'cashbank-bank-master';
  const isKhataPage = activePage === 'cashbank-khata';

  // Cash Ledger Form States (Screenshot 4)
  const [ledgerFormDate, setLedgerFormDate] = useState('2026-05-13');
  const [ledgerFormCashier, setLedgerFormCashier] = useState('');
  const [ledgerFormReason, setLedgerFormReason] = useState('');
  const [ledgerFormDebitCredit, setLedgerFormDebitCredit] = useState('Debit');
  const [ledgerFormAmount, setLedgerFormAmount] = useState('');
  const [ledgerFormRemark, setLedgerFormRemark] = useState('');

  // Form states - Cash Form (Screenshot 2)
  const [cashierName, setCashierName] = useState('');
  const [cashOpeningBalance, setCashOpeningBalance] = useState('');
  const [cashStatus, setCashStatus] = useState('Enable');

  // Form states - Bank Form (Screenshot 3)
  const [bankName, setBankName] = useState('');
  const [accHolderName, setAccHolderName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankOpeningBalance, setBankOpeningBalance] = useState('');
  const [bankStatus, setBankStatus] = useState('Enable');

  // Form states - Quick Add Transaction Modal (for Khata payments)
  const [isKhataModalOpen, setIsKhataModalOpen] = useState(false);
  const [khataType, setKhataType] = useState('Debit'); // 'Debit' or 'Credit'
  const [khataName, setKhataName] = useState('');
  const [khataReason, setKhataReason] = useState('');
  const [khataRemark, setKhataRemark] = useState('');
  const [khataAmount, setKhataAmount] = useState('');

  // Sync lists to local storage
  useEffect(() => {
    localStorage.setItem('roadwe_cashiers_list', JSON.stringify(cashiers));
  }, [cashiers]);

  useEffect(() => {
    localStorage.setItem('roadwe_banks_list', JSON.stringify(banks));
  }, [banks]);

  useEffect(() => {
    localStorage.setItem('roadwe_khata_transactions', JSON.stringify(khataTransactions));
  }, [khataTransactions]);

  const handleCreateCashier = (e) => {
    e.preventDefault();
    if (!cashierName || !cashOpeningBalance) {
      alert('Please fill out all required fields.');
      return;
    }
    const newCashier = {
      _id: `cash_${Date.now()}`,
      cashierName,
      openingBalance: parseFloat(cashOpeningBalance) || 0,
      closingBalance: parseFloat(cashOpeningBalance) || 0, // matches opening initially
      status: cashStatus
    };

    setCashiers([newCashier, ...cashiers]);
    
    // Reset Form
    setCashierName('');
    setCashOpeningBalance('');
    setCashStatus('Enable');
    setCashSubView('list');
  };

  const handleCreateBank = (e) => {
    e.preventDefault();
    if (!bankName || !accHolderName || !accNumber || !ifscCode || !bankOpeningBalance) {
      alert('Please fill out all required fields.');
      return;
    }
    const newBank = {
      _id: `bank_${Date.now()}`,
      bankName,
      accHolderName,
      accNumber,
      ifscCode,
      openingBalance: parseFloat(bankOpeningBalance) || 0,
      closingBalance: parseFloat(bankOpeningBalance) || 0,
      status: bankStatus
    };

    setBanks([newBank, ...banks]);

    // Reset Form
    setBankName('');
    setAccHolderName('');
    setAccNumber('');
    setIfscCode('');
    setBankOpeningBalance('');
    setBankStatus('Enable');
    setBankSubView('list');
  };

  const handleAddKhataTransaction = (e) => {
    e.preventDefault();
    if (!khataName || !khataAmount || !khataReason) {
      alert('Please fill out all required fields.');
      return;
    }
    const newTx = {
      _id: `tx_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      tabType: khataActiveTab, // 'cash' or 'bank'
      name: khataName,
      reason: khataReason,
      remark: khataRemark,
      createdBy: 'ADMIN',
      debit: khataType === 'Debit' ? parseFloat(khataAmount) : 0,
      credit: khataType === 'Credit' ? parseFloat(khataAmount) : 0
    };

    setKhataTransactions([newTx, ...khataTransactions]);

    // Adjust Cashier / Bank Closing Balance dynamically
    if (khataActiveTab === 'cash') {
      setCashiers(prev => prev.map(c => {
        if (c.cashierName === khataName) {
          const change = (newTx.credit - newTx.debit); // credit increases cash, debit decreases it
          return { ...c, closingBalance: c.closingBalance + change };
        }
        return c;
      }));
    } else {
      setBanks(prev => prev.map(b => {
        if (b.bankName === khataName) {
          const change = (newTx.credit - newTx.debit);
          return { ...b, closingBalance: b.closingBalance + change };
        }
        return b;
      }));
    }

    // Reset and Close
    setKhataName('');
    setKhataAmount('');
    setKhataReason('');
    setKhataRemark('');
    setIsKhataModalOpen(false);
  };

  const handleKhataFilterSubmit = (e) => {
    e.preventDefault();
    if (khataFilterModalType === 'filter') {
      setActiveKhataFilters({
        name: khataFilterName,
        fromDate: khataFilterFromDate,
        toDate: khataFilterToDate
      });
      setIsKhataFilterModalOpen(false);
    } else {
      setRepFromDate(khataFilterFromDate || 'All Time');
      setRepToDate(khataFilterToDate || 'All Time');
      setRepSelectedName(khataFilterName || 'All Treasuries');

      const repList = khataTransactions.filter(t => {
        if (t.tabType !== khataActiveTab) return false;
        if (khataFilterName && t.name !== khataFilterName) return false;
        if (khataFilterFromDate && t.date < khataFilterFromDate) return false;
        if (khataFilterToDate && t.date > khataFilterToDate) return false;
        return true;
      });

      setPrintingKhataReport(repList);
      setIsKhataFilterModalOpen(false);
    }
  };

  const handleDeleteCashier = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this cash master drawer?')) {
      setCashiers(cashiers.filter(c => c._id !== id));
    }
  };

  const handleDeleteBank = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this bank account master?')) {
      setBanks(banks.filter(b => b._id !== id));
    }
  };

  const handleDeleteKhataTx = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this Khata ledger entry?')) {
      setKhataTransactions(khataTransactions.filter(t => t._id !== id));
    }
  };

  const handleAddLedgerPayment = (e) => {
    e.preventDefault();
    if (!ledgerFormCashier) {
      alert('Please select Cashier Name!');
      return;
    }
    if (!ledgerFormReason) {
      alert('Please select Reason!');
      return;
    }
    if (!ledgerFormAmount || parseFloat(ledgerFormAmount) <= 0) {
      alert('Please enter a valid positive Amount!');
      return;
    }

    const amt = parseFloat(ledgerFormAmount);
    
    // Create new cashier transaction
    const newTx = {
      _id: 'tx_' + Date.now(),
      date: ledgerFormDate,
      tabType: 'cash',
      name: ledgerFormCashier,
      reason: ledgerFormReason,
      remark: ledgerFormRemark,
      createdBy: 'ADMIN',
      debit: ledgerFormDebitCredit === 'Debit' ? amt : 0,
      credit: ledgerFormDebitCredit === 'Credit' ? amt : 0
    };

    // Prepend to transaction list
    setKhataTransactions(prev => [newTx, ...prev]);

    // Update cashier drawer closing balance
    setCashiers(prev => prev.map(c => {
      if (c.cashierName === ledgerFormCashier) {
        const balanceChange = newTx.credit - newTx.debit;
        return { ...c, closingBalance: c.closingBalance + balanceChange };
      }
      return c;
    }));

    // Reset Form
    setLedgerFormCashier('');
    setLedgerFormReason('');
    setLedgerFormAmount('');
    setLedgerFormRemark('');

    alert('🎉 Cash Ledger entry successfully created and posted to cash master balance!');
    setActivePage('cashbank-cash-ledger-list');
  };

  const filteredKhataTx = khataTransactions.filter(t => {
    if (t.tabType !== khataActiveTab) return false;
    if (activeKhataFilters) {
      if (activeKhataFilters.name && t.name !== activeKhataFilters.name) return false;
      if (activeKhataFilters.fromDate && t.date < activeKhataFilters.fromDate) return false;
      if (activeKhataFilters.toDate && t.date > activeKhataFilters.toDate) return false;
    }
    return true;
  });

  return (
    <div style={styles.pageContainer}>
      {/* High-Fidelity Outlined Breadcrumbs matching screenshots */}
      <div style={styles.breadcrumbs}>
        <div style={styles.breadcrumbLink}>
          <Home size={14} style={styles.homeIcon} /> Home
        </div>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <div style={styles.breadcrumbLink}>Cash/Bank Manage</div>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>
          {isCashPage && (cashSubView === 'list' ? 'Cash List' : 'Add Cash Master')}
          {isBankPage && (bankSubView === 'list' ? 'Bank List' : 'Add Bank Master')}
          {isKhataPage && 'Cash/Bank Khata'}
          {activePage === 'cashbank-cash-ledger-form' && 'Cash Ledger Form'}
          {activePage === 'cashbank-cash-ledger-list' && 'Cash Ledger List'}
        </span>
      </div>

      {/* VIEW SECTION 1: CASH MASTER WORKSPACE */}
      {isCashPage && (
        <div style={styles.card}>
          {cashSubView === 'list' ? (
            /* Cash List Directory view (Screenshot 1) */
            <>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>
                  Cash List ( {cashiers.length} )
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setActivePage('cashbank-cash-ledger-form')} 
                    style={{ ...styles.addButton, backgroundColor: '#00b050' }}
                  >
                    Add Cash Payment (Ledger)
                  </button>
                  <button 
                    onClick={() => setCashSubView('create')} 
                    style={styles.addButton}
                  >
                    Add Cash Master
                  </button>
                </div>
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={{ ...styles.th, width: '100px' }}>
                        <div style={styles.thContent}>
                          SNo. <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          Cashier Name <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          Opening Balance <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          Closing Balance <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          Status <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={{ ...styles.th, width: '150px' }}>
                        <div style={{ ...styles.thContent, justifyContent: 'center' }}>
                          Action <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashiers.length > 0 ? (
                      cashiers.map((c, index) => (
                        <tr key={c._id || index} style={styles.tr}>
                          <td style={styles.tdSno}>{index + 1}.</td>
                          <td style={styles.tdBranchName}>{c.cashierName}</td>
                          <td style={styles.td}>₹{c.openingBalance.toLocaleString()}</td>
                          <td style={styles.td}>₹{c.closingBalance.toLocaleString()}</td>
                          <td style={styles.td}>
                            <span style={{ 
                              ...styles.statusText,
                              color: c.status === 'Enable' ? '#137333' : '#c5221f'
                            }}>
                              {c.status}
                            </span>
                          </td>
                          <td style={styles.tdActions}>
                            <div style={styles.actionCell}>
                              <button 
                                onClick={(e) => handleDeleteCashier(c._id, e)} 
                                style={styles.actionDeleteBtn} 
                                title="Delete Cash Master"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      /* Centered "No Data Found" spanning 6 columns */
                      <tr>
                        <td colSpan="6" style={styles.tdEmpty}>
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Pagination */}
              <div style={styles.paginationRow}>
                <div style={styles.paginationText}>Showing Page 1 of 1</div>
                <div style={styles.paginationControls}>
                  <button style={styles.pageBtn} disabled>Previous</button>
                  <button style={styles.pageBtnActive}>1</button>
                  <button style={styles.pageBtn} disabled>Next</button>
                </div>
              </div>
            </>
          ) : (
            /* Cash Form Creator view (Screenshot 2) */
            <>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Cash Form</h3>
                <button 
                  onClick={() => setCashSubView('list')} 
                  style={styles.addButton}
                >
                  Cash List
                </button>
              </div>

              <form onSubmit={handleCreateCashier} style={styles.form}>
                <div style={styles.row}>
                  <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={styles.label}>Cashier Name <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      placeholder="Cashier Name"
                      value={cashierName}
                      onChange={(e) => setCashierName(e.target.value)}
                      style={styles.inputControl}
                      required
                    />
                  </div>
                  <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={styles.label}>Opening Balance</label>
                    <input 
                      type="number" 
                      placeholder="Opening Balance"
                      value={cashOpeningBalance}
                      onChange={(e) => setCashOpeningBalance(e.target.value)}
                      style={styles.inputControl}
                    />
                  </div>
                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={styles.label}>Status <span style={{ color: 'red' }}>*</span></label>
                    <select 
                      value={cashStatus}
                      onChange={(e) => setCashStatus(e.target.value)}
                      style={styles.inputControl}
                      required
                    >
                      <option value="Enable">Enable</option>
                      <option value="Disable">Disable</option>
                    </select>
                  </div>
                </div>

                <div style={styles.btnCenterWrapper}>
                  <button type="submit" style={styles.createBtn}>
                    Add Cash Details
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* VIEW SECTION 2: BANK MASTER WORKSPACE */}
      {isBankPage && (
        <div style={styles.card}>
          {bankSubView === 'list' ? (
            /* Bank List Directory view */
            <>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>
                  Bank List ( {banks.length} )
                </h3>
                <button 
                  onClick={() => setBankSubView('create')} 
                  style={styles.addButton}
                >
                  Add Bank Master
                </button>
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={{ ...styles.th, width: '100px' }}>
                        <div style={styles.thContent}>
                          SNo. <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          Bank Name <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          A/C Number <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          IFSC <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          Status <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                      <th style={{ ...styles.th, width: '150px' }}>
                        <div style={{ ...styles.thContent, justifyContent: 'center' }}>
                          Action <ChevronsUpDown size={12} style={styles.sortIcon} />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {banks.length > 0 ? (
                      banks.map((b, index) => (
                        <tr key={b._id || index} style={styles.tr}>
                          <td style={styles.tdSno}>{index + 1}.</td>
                          <td style={styles.tdBranchName}>
                            {b.bankName}
                            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>
                              Holder: {b.accHolderName}
                            </div>
                          </td>
                          <td style={styles.td}>{b.accNumber}</td>
                          <td style={styles.td}>{b.ifscCode}</td>
                          <td style={styles.td}>
                            <span style={{ 
                              ...styles.statusText,
                              color: b.status === 'Enable' ? '#137333' : '#c5221f'
                            }}>
                              {b.status}
                            </span>
                          </td>
                          <td style={styles.tdActions}>
                            <div style={styles.actionCell}>
                              <button 
                                onClick={(e) => handleDeleteBank(b._id, e)} 
                                style={styles.actionDeleteBtn} 
                                title="Delete Bank Master"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      /* Centered "No Data Found" spanning 6 columns */
                      <tr>
                        <td colSpan="6" style={styles.tdEmpty}>
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Pagination */}
              <div style={styles.paginationRow}>
                <div style={styles.paginationText}>Showing Page 1 of 1</div>
                <div style={styles.paginationControls}>
                  <button style={styles.pageBtn} disabled>Previous</button>
                  <button style={styles.pageBtnActive}>1</button>
                  <button style={styles.pageBtn} disabled>Next</button>
                </div>
              </div>
            </>
          ) : (
            /* Bank Form Creator view (Screenshot 3) */
            <>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Bank Form</h3>
                <button 
                  onClick={() => setBankSubView('list')} 
                  style={styles.addButton}
                >
                  Bank List
                </button>
              </div>

              <form onSubmit={handleCreateBank} style={styles.form}>
                {/* Row 1 */}
                <div style={styles.row}>
                  <div style={styles.col6}>
                    <label style={styles.label}>Bank Name <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      placeholder="Bank Name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      style={styles.inputControl}
                      required
                    />
                  </div>
                  <div style={styles.col6}>
                    <label style={styles.label}>Account Holder Name <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      placeholder="Account Holder Name"
                      value={accHolderName}
                      onChange={(e) => setAccHolderName(e.target.value)}
                      style={styles.inputControl}
                      required
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div style={styles.row}>
                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={styles.label}>Account Number <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      placeholder="Enter Account No."
                      value={accNumber}
                      onChange={(e) => setAccNumber(e.target.value)}
                      style={styles.inputControl}
                      required
                    />
                  </div>
                  <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={styles.label}>IFSC <span style={{ color: 'red' }}>*</span></label>
                    <input 
                      type="text" 
                      placeholder="Enter IFSC"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      style={styles.inputControl}
                      required
                    />
                  </div>
                  <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={styles.label}>Opening Balance</label>
                    <input 
                      type="number" 
                      placeholder="Opening Balance"
                      value={bankOpeningBalance}
                      onChange={(e) => setBankOpeningBalance(e.target.value)}
                      style={styles.inputControl}
                    />
                  </div>
                  <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={styles.label}>Status <span style={{ color: 'red' }}>*</span></label>
                    <select 
                      value={bankStatus}
                      onChange={(e) => setBankStatus(e.target.value)}
                      style={styles.inputControl}
                      required
                    >
                      <option value="Enable">Enable</option>
                      <option value="Disable">Disable</option>
                    </select>
                  </div>
                </div>

                <div style={styles.btnCenterWrapper}>
                  <button type="submit" style={styles.createBtn}>
                    Add Bank Details
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* VIEW SECTION 3: CASH / BANK KHATA WORKSPACE (Screenshot 4) */}
      {isKhataPage && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Cash / Bank Khata</h3>
          </div>

          <div style={{ padding: '0 24px' }}>
            {/* Horizontal sub-tabs for Khata */}
            <div style={styles.khataTabsBar}>
              <button 
                onClick={() => setKhataActiveTab('cash')}
                style={{
                  ...styles.khataTab,
                  ...(khataActiveTab === 'cash' ? styles.khataTabActive : {})
                }}
              >
                Cash Khata
              </button>
              <button 
                onClick={() => setKhataActiveTab('bank')}
                style={{
                  ...styles.khataTab,
                  ...(khataActiveTab === 'bank' ? styles.khataTabActive : {})
                }}
              >
                Bank Khata
              </button>
            </div>

            {/* Buttons action bar under subtabs */}
            <div style={styles.khataActionsRow}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {activeKhataFilters && (
                  <button 
                    onClick={() => {
                      setActiveKhataFilters(null);
                      setKhataFilterName('');
                      setKhataFilterFromDate('');
                      setKhataFilterToDate('');
                    }} 
                    style={{ ...styles.khataBlueBtn, backgroundColor: '#c5221f' }}
                  >
                    Reset Filter
                  </button>
                )}
                <button 
                  onClick={() => {
                    setKhataFilterModalType('report');
                    setKhataFilterName('');
                    setKhataFilterFromDate('');
                    setKhataFilterToDate('');
                    setIsKhataFilterModalOpen(true);
                  }} 
                  style={styles.khataBlueBtn}
                >
                  Report
                </button>
                <button 
                  onClick={() => {
                    setKhataFilterModalType('filter');
                    if (activeKhataFilters) {
                      setKhataFilterName(activeKhataFilters.name || '');
                      setKhataFilterFromDate(activeKhataFilters.fromDate || '');
                      setKhataFilterToDate(activeKhataFilters.toDate || '');
                    } else {
                      setKhataFilterName('');
                      setKhataFilterFromDate('');
                      setKhataFilterToDate('');
                    }
                    setIsKhataFilterModalOpen(true);
                  }} 
                  style={styles.khataBlueBtn}
                >
                  Filter
                </button>
                <button onClick={() => setActivePage('cashbank-cash-ledger-form')} style={{ ...styles.khataBlueBtn, backgroundColor: '#00b050' }}>
                  Add Payment Ledger
                </button>
                <button onClick={() => setIsKhataModalOpen(true)} style={styles.khataBlueBtn}>
                  Add New Payment
                </button>
              </div>
            </div>

            {/* Table Directory for Khata transaction logs */}
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>SNo.</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>
                      {khataActiveTab === 'cash' ? 'Cashier Name' : 'Bank / A/C'}
                    </th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Remark</th>
                    <th style={styles.th}>Created By</th>
                    <th style={styles.th}>Debit</th>
                    <th style={styles.th}>Credit</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKhataTx.length > 0 ? (
                    filteredKhataTx.map((tx, index) => (
                      <tr key={tx._id || index} style={styles.tr}>
                        <td style={styles.tdSno}>{index + 1}.</td>
                        <td style={styles.td}>{tx.date}</td>
                        <td style={styles.tdBranchName}>{tx.name}</td>
                        <td style={styles.td}>{tx.reason}</td>
                        <td style={styles.td}>{tx.remark || 'N/A'}</td>
                        <td style={styles.td}>{tx.createdBy}</td>
                        <td style={{ ...styles.td, color: tx.debit > 0 ? '#c5221f' : '#475569', fontWeight: tx.debit > 0 ? '700' : '400' }}>
                          {tx.debit > 0 ? `₹${tx.debit.toLocaleString()}` : '-'}
                        </td>
                        <td style={{ ...styles.td, color: tx.credit > 0 ? '#137333' : '#475569', fontWeight: tx.credit > 0 ? '700' : '400' }}>
                          {tx.credit > 0 ? `₹${tx.credit.toLocaleString()}` : '-'}
                        </td>
                        <td style={styles.tdActions}>
                          <div style={styles.actionCell}>
                            <button 
                              onClick={(e) => handleDeleteKhataTx(tx._id, e)} 
                              style={styles.actionDeleteBtn}
                              title="Delete Transaction"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    /* Centered "No Data Found" spanning 9 columns */
                    <tr>
                      <td colSpan="9" style={styles.tdEmpty}>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Pagination */}
            {filteredKhataTx.length > 0 && (
              <div style={styles.paginationRow}>
                <div style={styles.paginationText}>Showing Page 1 of 1</div>
                <div style={styles.paginationControls}>
                  <button style={styles.pageBtn} disabled>Previous</button>
                  <button style={styles.pageBtnActive}>1</button>
                  <button style={styles.pageBtn} disabled>Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK ADD KHATA TRANSACTION MODAL */}
      {isKhataModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                💳 Record {khataActiveTab === 'cash' ? 'Cashier' : 'Bank'} Payment Entry
              </h3>
              <button onClick={() => setIsKhataModalOpen(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddKhataTransaction} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Transaction Flow *</label>
                <select 
                  value={khataType} 
                  onChange={(e) => setKhataType(e.target.value)} 
                  style={styles.inputControl}
                  required
                >
                  <option value="Debit">Debit (Cash Paid Out / Withdraw)</option>
                  <option value="Credit">Credit (Cash Received In / Deposit)</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Select {khataActiveTab === 'cash' ? 'Cashier *' : 'Bank *'}
                </label>
                <select 
                  value={khataName} 
                  onChange={(e) => setKhataName(e.target.value)} 
                  style={styles.inputControl}
                  required
                >
                  <option value="">Select Target Treasury</option>
                  {khataActiveTab === 'cash' ? (
                    cashiers.map((c, i) => <option key={i} value={c.cashierName}>{c.cashierName}</option>)
                  ) : (
                    banks.map((b, i) => <option key={i} value={b.bankName}>{b.bankName}</option>)
                  )}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Reason / Category *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fuel Payment, Party Freight"
                  value={khataReason} 
                  onChange={(e) => setKhataReason(e.target.value)} 
                  style={styles.inputControl}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Transaction Amount (₹) *</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000"
                  value={khataAmount} 
                  onChange={(e) => setKhataAmount(e.target.value)} 
                  style={styles.inputControl}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Remark</label>
                <textarea 
                  placeholder="Narration details..."
                  value={khataRemark} 
                  onChange={(e) => setKhataRemark(e.target.value)} 
                  style={{ ...styles.inputControl, minHeight: '60px', resize: 'vertical' }}
                />
              </div>

              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  onClick={() => setIsKhataModalOpen(false)} 
                  style={styles.modalCancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={styles.modalSubmitBtn}
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* FILTER AND REPORT OPTIONS MODAL (Milestone 29) */}
      {isKhataFilterModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '650px' }}>
            <div style={styles.modalHeaderRed}>
              <h3 style={styles.modalTitleRed}>Filter Options</h3>
              <button 
                type="button" 
                onClick={() => setIsKhataFilterModalOpen(false)} 
                style={styles.closeBtn}
              >
                <X size={18} style={{ color: '#64748b' }} />
              </button>
            </div>
            <form onSubmit={handleKhataFilterSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={styles.label}>
                    {khataActiveTab === 'cash' ? 'Cashier Name' : 'Bank Name'}
                  </label>
                  <select
                    value={khataFilterName}
                    onChange={(e) => setKhataFilterName(e.target.value)}
                    style={styles.inputControl}
                  >
                    <option value="">
                      {khataActiveTab === 'cash' ? 'Select Cashier Name' : 'Select Bank Name'}
                    </option>
                    {khataActiveTab === 'cash' ? (
                      cashiers.map((c, i) => <option key={i} value={c.cashierName}>{c.cashierName}</option>)
                    ) : (
                      banks.map((b, i) => <option key={i} value={b.bankName}>{b.bankName}</option>)
                    )}
                  </select>
                </div>
                <div style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={styles.label}>From Date</label>
                  <input
                    type="date"
                    value={khataFilterFromDate}
                    onChange={(e) => setKhataFilterFromDate(e.target.value)}
                    style={styles.inputControl}
                  />
                </div>
                <div style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={styles.label}>To Date</label>
                  <input
                    type="date"
                    value={khataFilterToDate}
                    onChange={(e) => setKhataFilterToDate(e.target.value)}
                    style={styles.inputControl}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={styles.modalSubmitBtn}
                >
                  {khataFilterModalType === 'report' ? 'Download' : 'Search'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsKhataFilterModalOpen(false)}
                  style={styles.modalCancelBtn}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. CASH LEDGER FORM (Screenshot 4) */}
      {activePage === 'cashbank-cash-ledger-form' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Cash Ledger Form</h3>
            <button 
              onClick={() => setActivePage('cashbank-cash-ledger-list')}
              style={{ ...styles.addButton, backgroundColor: '#0066cc' }}
            >
              Cash Ledger List
            </button>
          </div>
          
          <form onSubmit={handleAddLedgerPayment} style={styles.form}>
            <div style={styles.formRowThree}>
              <div style={styles.formGroup}>
                <label style={styles.formGroupLabel}>Date <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={ledgerFormDate} 
                  onChange={(e) => setLedgerFormDate(e.target.value)} 
                  required
                  style={styles.inputStyle}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formGroupLabel}>Cashier Name <span style={{ color: '#ef4444' }}>*</span></label>
                <select 
                  className="form-control" 
                  value={ledgerFormCashier} 
                  onChange={(e) => setLedgerFormCashier(e.target.value)}
                  required
                  style={styles.selectStyle}
                >
                  <option value="">Select Cashier Name</option>
                  {cashiers.map(c => (
                    <option key={c._id || c.cashierName} value={c.cashierName}>{c.cashierName}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formGroupLabel}>Reason <span style={{ color: '#ef4444' }}>*</span></label>
                <select 
                  className="form-control" 
                  value={ledgerFormReason} 
                  onChange={(e) => setLedgerFormReason(e.target.value)}
                  required
                  style={styles.selectStyle}
                >
                  <option value="">Select Reason</option>
                  <option value="Office Rent Payment">Office Rent Payment</option>
                  <option value="Fuel Expense Reimbursement">Fuel Expense Reimbursement</option>
                  <option value="Office Electricity Bill">Office Electricity Bill</option>
                  <option value="Salary Payment">Salary Payment</option>
                  <option value="Miscellaneous Office Expense">Miscellaneous Office Expense</option>
                  <option value="Party Freight Received">Party Freight Received</option>
                  <option value="Supplier Paid Payment">Supplier Paid Payment</option>
                </select>
              </div>
            </div>

            <div style={styles.formRowThree}>
              <div style={styles.formGroup}>
                <label style={styles.formGroupLabel}>Debit/Credit <span style={{ color: '#ef4444' }}>*</span></label>
                <select 
                  className="form-control" 
                  value={ledgerFormDebitCredit} 
                  onChange={(e) => setLedgerFormDebitCredit(e.target.value)}
                  required
                  style={styles.selectStyle}
                >
                  <option value="Debit">Debit</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formGroupLabel}>Amount <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Enter Amount" 
                  value={ledgerFormAmount} 
                  onChange={(e) => setLedgerFormAmount(e.target.value)}
                  min="0.01"
                  step="any"
                  required
                  style={styles.inputStyle}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formGroupLabel}>Remark</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter Remark" 
                  value={ledgerFormRemark} 
                  onChange={(e) => setLedgerFormRemark(e.target.value)}
                  style={styles.inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button type="submit" style={styles.greenSubmitBtn}>
                Add Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CASH LEDGER LIST VIEW */}
      {activePage === 'cashbank-cash-ledger-list' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              Cash Ledger List ( {khataTransactions.filter(t => t.tabType === 'cash').length} entries )
            </h3>
            <button 
              onClick={() => setActivePage('cashbank-cash-ledger-form')}
              style={{ ...styles.addButton, backgroundColor: '#00b050' }}
            >
              Add Cash Payment
            </button>
          </div>

          <div style={{ padding: '0 24px 24px 24px' }}>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={{ ...styles.th, width: '60px' }}>SNo.</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Cashier Name</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Debit (Paid)</th>
                    <th style={styles.th}>Credit (Recv)</th>
                    <th style={styles.th}>Remark</th>
                    <th style={styles.th}>Created By</th>
                    <th style={{ ...styles.th, width: '100px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {khataTransactions.filter(t => t.tabType === 'cash').length > 0 ? (
                    khataTransactions.filter(t => t.tabType === 'cash').map((t, index) => (
                      <tr key={t._id || index} style={styles.tr}>
                        <td style={styles.tdSno}>{index + 1}.</td>
                        <td style={styles.td}>{t.date}</td>
                        <td style={styles.tdBranchName}>{t.name}</td>
                        <td style={{ ...styles.td, fontWeight: '700', color: '#475569' }}>{t.reason}</td>
                        <td style={{ ...styles.td, color: '#c5221f', fontWeight: '700' }}>
                          {t.debit > 0 ? `₹${t.debit.toLocaleString()}` : '-'}
                        </td>
                        <td style={{ ...styles.td, color: '#137333', fontWeight: '700' }}>
                          {t.credit > 0 ? `₹${t.credit.toLocaleString()}` : '-'}
                        </td>
                        <td style={styles.td}>{t.remark || '-'}</td>
                        <td style={styles.td}>{t.createdBy}</td>
                        <td style={styles.tdActions}>
                          <div style={styles.actionCell}>
                            <button 
                              onClick={(e) => handleDeleteKhataTx(t._id, e)} 
                              style={styles.actionDeleteBtn} 
                              title="Delete Entry"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={styles.tdEmpty}>No Data Found</td>
                    </tr>
                  )}
                  {/* Ledger summary totals row */}
                  <tr style={styles.totalsRow}>
                    <td colSpan="4" style={{ fontWeight: '800', textAlign: 'right', paddingRight: '20px' }}>Total Ledger sums:</td>
                    <td style={{ fontWeight: '800', color: '#c5221f' }}>
                      ₹{khataTransactions.filter(t => t.tabType === 'cash').reduce((acc, curr) => acc + (curr.debit || 0), 0).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '800', color: '#137333' }}>
                      ₹{khataTransactions.filter(t => t.tabType === 'cash').reduce((acc, curr) => acc + (curr.credit || 0), 0).toLocaleString()}
                    </td>
                    <td colSpan="3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. PRINTABLE LEDGER REGISTER PRINT OVERLAY (Milestone 29) */}
      {printingKhataReport && (() => {
        const logoImg = localStorage.getItem('settings_logoImg') || '';
        const headingColor = localStorage.getItem('settings_headingColor') || '#0066cc';

        let selectedOpening = 0;
        if (khataActiveTab === 'cash') {
          if (repSelectedName && repSelectedName !== 'All Treasuries') {
            const match = cashiers.find(c => c.cashierName === repSelectedName);
            if (match) selectedOpening = match.openingBalance;
          } else {
            selectedOpening = cashiers.reduce((acc, curr) => acc + (curr.openingBalance || 0), 0);
          }
        } else {
          if (repSelectedName && repSelectedName !== 'All Treasuries') {
            const match = banks.find(b => b.bankName === repSelectedName);
            if (match) selectedOpening = match.openingBalance;
          } else {
            selectedOpening = banks.reduce((acc, curr) => acc + (curr.openingBalance || 0), 0);
          }
        }

        const totalDebits = printingKhataReport.reduce((acc, curr) => acc + (curr.debit || 0), 0);
        const totalCredits = printingKhataReport.reduce((acc, curr) => acc + (curr.credit || 0), 0);
        const netClosingBalance = selectedOpening + totalCredits - totalDebits;

        return (
          <div style={styles.printOverlay}>
            <div className="print-container-visible" style={{ ...styles.printContainer, maxWidth: '950px' }}>
              <div style={styles.printHeader}>
                <div style={styles.printLogo}>
                  {logoImg && <img src={logoImg} alt="Logo" style={{ height: '34px', verticalAlign: 'middle', marginRight: '8px' }} />}
                  <span style={{ color: headingColor }}>TRANSCORE LOGISTICS</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ color: headingColor, fontSize: '1.1rem', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
                    {khataActiveTab === 'cash' ? 'CASHIER LEDGER REGISTER' : 'BANK ACCOUNT LEDGER REGISTER'}
                  </h3>
                  <span style={{ fontSize: '0.7rem' }}><b>Report Period:</b> {repFromDate} to {repToDate}</span>
                </div>
              </div>

              <hr style={{ ...styles.divider, borderTopColor: headingColor, margin: '14px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.8rem', marginBottom: '16px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <div>
                  <b>Treasury Target:</b> {repSelectedName}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <b>Opening Balance:</b> ₹{selectedOpening.toLocaleString()}
                </div>
              </div>

              <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
                <table className="custom-table" style={{ fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th>SNo.</th>
                      <th>Date</th>
                      <th>{khataActiveTab === 'cash' ? 'Cashier Name' : 'Bank / A/C'}</th>
                      <th>Reason</th>
                      <th>Remark</th>
                      <th>Created By</th>
                      <th>Debit</th>
                      <th>Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printingKhataReport.map((tx, idx) => (
                      <tr key={tx._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{tx.date}</td>
                        <td style={{ fontWeight: '700' }}>{tx.name}</td>
                        <td>{tx.reason}</td>
                        <td>{tx.remark || 'N/A'}</td>
                        <td>{tx.createdBy}</td>
                        <td style={{ color: tx.debit > 0 ? '#c5221f' : '#475569', fontWeight: tx.debit > 0 ? '700' : '400' }}>
                          {tx.debit > 0 ? `₹${tx.debit.toLocaleString()}` : '-'}
                        </td>
                        <td style={{ color: tx.credit > 0 ? '#137333' : '#475569', fontWeight: tx.credit > 0 ? '700' : '400' }}>
                          {tx.credit > 0 ? `₹${tx.credit.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                    {printingKhataReport.length === 0 && (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
                          No transactions matched your report criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', background: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Total Transactions: <b>{printingKhataReport.length}</b> | Total Debits: <b style={{ color: '#c5221f' }}>₹{totalDebits.toLocaleString()}</b> | Total Credits: <b style={{ color: '#137333' }}>₹{totalCredits.toLocaleString()}</b>
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>
                  Net Closing Balance: <span style={{ color: '#0066cc' }}>₹{netClosingBalance.toLocaleString()}/-</span>
                </span>
              </div>

              <div style={{ ...styles.printControls, marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn btn-secondary" style={styles.modalCancelBtn} onClick={() => setPrintingKhataReport(null)}>Close</button>
                <button className="btn btn-primary" style={styles.modalSubmitBtn} onClick={() => window.print()}>Print Register</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
    fontFamily: "'Inter', sans-serif"
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    backgroundColor: '#ffffff',
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  breadcrumbLink: {
    color: '#64748b',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  homeIcon: {
    color: '#0066cc'
  },
  breadcrumbSeparator: {
    color: '#cbd5e1'
  },
  breadcrumbActive: {
    color: '#0066cc',
    fontWeight: '700'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    paddingBottom: '16px'
  },
  cardHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: 0
  },
  addButton: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 102, 204, 0.15)',
    transition: 'background-color 0.2s ease',
    outline: 'none'
  },
  form: {
    padding: '4px 24px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  col6: {
    flex: '1 1 280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569'
  },
  inputControl: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '0.85rem',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b'
  },
  btnCenterWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '12px'
  },
  createBtn: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 36px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 176, 80, 0.25)',
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  toolbar: {
    display: 'flex',
    backgroundColor: '#ffffff',
    padding: '0 24px 16px 24px',
    justifyContent: 'flex-end'
  },
  toolsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  searchLabel: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#475569'
  },
  searchInput: {
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '6px 12px',
    outline: 'none',
    fontSize: '0.85rem',
    color: '#1e293b',
    width: '240px',
    backgroundColor: '#ffffff'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    margin: '0 24px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #cbd5e1'
  },
  th: {
    padding: '12px 16px',
    fontWeight: '700',
    color: '#475569',
    verticalAlign: 'middle'
  },
  thContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  sortIcon: {
    color: '#94a3b8',
    marginLeft: '6px'
  },
  tr: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.15s ease'
  },
  tdSno: {
    padding: '14px 16px',
    color: '#64748b',
    fontWeight: '600',
    verticalAlign: 'middle'
  },
  tdBranchName: {
    padding: '14px 16px',
    color: '#0f172a',
    fontWeight: '700',
    verticalAlign: 'middle'
  },
  td: {
    padding: '14px 16px',
    color: '#334155',
    verticalAlign: 'middle'
  },
  tdActions: {
    padding: '14px 16px',
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  actionCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionDeleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fce8e6',
    color: '#c5221f',
    border: 'none',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  statusText: {
    fontWeight: '700'
  },
  tdEmpty: {
    padding: '24px 16px',
    textAlign: 'center',
    color: '#64748b',
    fontWeight: '500'
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px'
  },
  paginationText: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '600'
  },
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  pageBtn: {
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    color: '#64748b',
    padding: '5px 12px',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'default',
    outline: 'none'
  },
  pageBtnActive: {
    border: '1px solid #0066cc',
    borderRadius: '4px',
    backgroundColor: '#0066cc',
    color: '#ffffff',
    padding: '5px 12px',
    fontSize: '0.78rem',
    fontWeight: '700',
    minWidth: '28px',
    textAlign: 'center',
    outline: 'none',
    cursor: 'default'
  },
  khataTabsBar: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '20px'
  },
  khataTab: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    fontWeight: '700',
    fontSize: '0.85rem',
    padding: '8px 4px 12px 4px',
    cursor: 'pointer',
    outline: 'none',
    borderBottom: '2px solid transparent',
    transition: 'all 0.15s ease'
  },
  khataTabActive: {
    color: '#0066cc',
    borderBottomColor: '#0066cc'
  },
  khataActionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px'
  },
  khataBlueBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0, 102, 204, 0.15)'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '500px',
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
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#cbd5e1',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCancelBtn: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.8rem',
    padding: '8px 18px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    cursor: 'pointer'
  },
  modalSubmitBtn: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.85rem',
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 176, 80, 0.15)'
  },
  modalHeaderRed: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #cbd5e1',
    backgroundColor: '#ffffff'
  },
  modalTitleRed: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#ef4444',
    margin: 0
  },
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
    border: '1px solid #cbd5e1',
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
  formRowThree: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    padding: '10px 24px'
  },
  formGroupLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '6px'
  },
  inputStyle: {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%'
  },
  selectStyle: {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%',
    cursor: 'pointer'
  },
  greenSubmitBtn: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 40px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 176, 80, 0.2)',
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  totalsRow: {
    backgroundColor: '#f8fafc',
    borderTop: '2px solid #cbd5e1'
  }
};
