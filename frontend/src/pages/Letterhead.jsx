import React, { useState, useEffect } from 'react';
import { Plus, Printer, FileText, Share2, Search, X, Check, Filter } from 'lucide-react';

const API_BASE = '/api';

export default function Letterhead({ token, activePage, setActivePage }) {
  // Local list of generated letterheads with persistent storage fallback
  const [letterheads, setLetterheads] = useState(() => {
    const saved = localStorage.getItem('roadwe_letterheads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Pre-seeded entries matching company names in quotation lists
    return [
      {
        _id: 'lh1',
        letterheadNo: '0001',
        generateDate: '2026-05-13',
        companyName: 'TATA STEEL LTD',
        companyGst: '34AAACT1234F1Z1',
        companyMobile: '9876543210',
        companyAddress: 'Jamshedpur Works, Jamshedpur, Jharkhand - 831001',
        description: 'This is an official correspondence regarding raw material shipment transportation terms and freight rate structure for the year 2026.'
      },
      {
        _id: 'lh2',
        letterheadNo: '0002',
        generateDate: '2026-05-14',
        companyName: 'RELIANCE INDUSTRIES',
        companyGst: '27AAACR5678Q2Z2',
        companyMobile: '9988776655',
        companyAddress: 'Reliance Corporate Park, Thane-Belapur Road, Ghansoli, Navi Mumbai - 400701',
        description: 'Letter of authorization for logistics carrier access to refinery dispatch terminals. All loaded vehicles must carry physical copies of statutory declarations.'
      }
    ];
  });

  // State variables for Letterhead Creator Form (Screenshot 1)
  const [letterheadNo, setLetterheadNo] = useState('0003');
  const [generateDate, setGenerateDate] = useState(() => {
    // Current date in YYYY-MM-DD format
    return new Date().toISOString().split('T')[0];
  });
  const [companyName, setCompanyName] = useState('');
  const [companyGst, setCompanyGst] = useState('');
  const [companyMobile, setCompanyMobile] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [description, setDescription] = useState('');

  // Filter Modal states (Screenshot 3)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCompany, setFilterCompany] = useState('Select Company Name');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Active filters (applied to lists)
  const [appliedCompany, setAppliedCompany] = useState('');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [viewingLetterhead, setViewingLetterhead] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('roadwe_letterheads', JSON.stringify(letterheads));
  }, [letterheads]);

  // Determine prefill sequence for new letterheads
  useEffect(() => {
    if (activePage === 'letterhead-create') {
      const nextNum = letterheads.length > 0 
        ? String(Math.max(...letterheads.map(lh => parseInt(lh.letterheadNo) || 0)) + 1).padStart(4, '0')
        : '0001';
      setLetterheadNo(nextNum);
      setCompanyName('');
      setCompanyGst('');
      setCompanyMobile('');
      setCompanyAddress('');
      setDescription('');
    }
  }, [activePage, letterheads]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert('Company Name is required.');
      return;
    }

    const newLh = {
      _id: 'lh_' + Date.now(),
      letterheadNo,
      generateDate,
      companyName,
      companyGst,
      companyMobile,
      companyAddress,
      description
    };

    setLetterheads([newLh, ...letterheads]);
    alert('Letterhead Generated Successfully!');
    setActivePage('letterhead-list');
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this letterhead?')) {
      setLetterheads(letterheads.filter(lh => lh._id !== id));
    }
  };

  // Compile unique companies for filter dropdown
  const uniqueCompanies = Array.from(new Set(letterheads.map(lh => lh.companyName))).filter(Boolean);

  // Apply filters to letterheads list
  const filteredLetterheads = letterheads.filter(lh => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSearch = lh.companyName.toLowerCase().includes(q) || 
                          lh.letterheadNo.toLowerCase().includes(q) ||
                          (lh.companyGst && lh.companyGst.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    // 2. Company Filter
    if (appliedCompany) {
      if (lh.companyName !== appliedCompany) return false;
    }

    // 3. Date Filters
    if (appliedFromDate) {
      if (lh.generateDate < appliedFromDate) return false;
    }
    if (appliedToDate) {
      if (lh.generateDate > appliedToDate) return false;
    }

    return true;
  });

  const handleSearchFilter = () => {
    setAppliedCompany(filterCompany === 'Select Company Name' ? '' : filterCompany);
    setAppliedFromDate(filterFromDate);
    setAppliedToDate(filterToDate);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilterCompany('Select Company Name');
    setFilterFromDate('');
    setFilterToDate('');
    setAppliedCompany('');
    setAppliedFromDate('');
    setAppliedToDate('');
  };

  const isListMode = activePage === 'letterhead-list';
  const isCreateMode = activePage === 'letterhead-create';

  return (
    <div style={styles.container}>
      {/* CREATOR FORM VIEW (Screenshot 1) */}
      {isCreateMode && (
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Letterhead Form</h2>
            <button 
              className="btn btn-secondary" 
              style={{ backgroundColor: '#0066cc', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '0.85rem' }}
              onClick={() => setActivePage('letterhead-list')}
            >
              Letterhead List
            </button>
          </div>

          <form onSubmit={handleGenerate} style={{ marginTop: '20px' }}>
            {/* Metadata segment */}
            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>Letterhead Number <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  value={letterheadNo}
                  onChange={(e) => setLetterheadNo(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div style={styles.col}>
                <label style={styles.label}>Letterhead Generate Date <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="date" 
                  value={generateDate}
                  onChange={(e) => setGenerateDate(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* Company Details divider */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Company Details</span>
            </div>

            {/* Company inputs */}
            <div style={styles.row}>
              <div style={styles.col3}>
                <label style={styles.label}>Company name <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="Company Name" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>GST Number</label>
                <input 
                  type="text" 
                  placeholder="GST Number" 
                  value={companyGst}
                  onChange={(e) => setCompanyGst(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={styles.col3}>
                <label style={styles.label}>Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="Mobile Number" 
                  value={companyMobile}
                  onChange={(e) => setCompanyMobile(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ ...styles.row, marginTop: '15px' }}>
              <div style={styles.col12}>
                <label style={styles.label}>Address</label>
                <textarea 
                  placeholder="Address" 
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="form-control"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Description divider */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionTitle}>Description</span>
            </div>

            {/* Description inputs */}
            <div style={styles.row}>
              <div style={styles.col12}>
                <label style={styles.label}>Description</label>
                <textarea 
                  placeholder="Description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  style={{ minHeight: '140px', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Submit button aligned perfectly in the center */}
            <div style={styles.buttonContainer}>
              <button 
                type="submit" 
                className="btn" 
                style={styles.submitBtn}
              >
                Generate Letterhead
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
              Letterhead List ({filteredLetterheads.length})
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn" 
                style={{ backgroundColor: '#008ecc', color: '#ffffff', border: 'none', fontWeight: '700', padding: '8px 16px', borderRadius: '4px', fontSize: '0.85rem' }}
                onClick={() => setIsFilterOpen(true)}
              >
                Filter
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#0066cc', color: '#ffffff', border: 'none', fontWeight: '700', padding: '8px 16px', borderRadius: '4px', fontSize: '0.85rem' }}
                onClick={() => setActivePage('letterhead-create')}
              >
                Create Letterhead
              </button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(appliedCompany || appliedFromDate || appliedToDate) && (
            <div style={styles.filterAlert}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0369a1' }}>Active Filters:</span>
                {appliedCompany && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Company: {appliedCompany}
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

          {filteredLetterheads.length > 0 ? (
            <div style={{ marginTop: '16px' }}>
              {/* Search bar */}
              <div style={styles.filterBar}>
                <div style={{ position: 'relative', width: '320px' }}>
                  <input 
                    type="text" 
                    placeholder="Search by company or letterhead no..." 
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
                      <th>Letterhead No</th>
                      <th>Generate Date</th>
                      <th>Company Name</th>
                      <th>Mobile Number</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLetterheads.map((lh) => (
                      <tr key={lh._id}>
                        <td style={{ fontWeight: '700', color: '#0066cc' }}>{lh.letterheadNo}</td>
                        <td style={{ fontWeight: '500' }}>
                          {lh.generateDate.split('-').reverse().join('/')}
                        </td>
                        <td style={{ fontWeight: '600' }}>{lh.companyName}</td>
                        <td style={{ fontWeight: '500' }}>{lh.companyMobile || '—'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button 
                              className="btn-icon" 
                              onClick={() => setViewingLetterhead(lh)} 
                              title="Print & View Correspondence"
                              style={{ color: '#0066cc', border: '1px solid #cbd5e1', padding: '6px', borderRadius: '4px', backgroundColor: '#f8fafc' }}
                            >
                              <Printer size={14} />
                            </button>
                            <button 
                              className="btn-icon btn-danger" 
                              onClick={() => handleDelete(lh._id)} 
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

      {/* FILTER OPTIONS DIALOG MODAL (Screenshot 3) */}
      {isFilterOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Filter Options</h3>
              <button onClick={() => setIsFilterOpen(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Company Name</label>
                <select 
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  className="form-control"
                  style={{ width: '100%' }}
                >
                  <option>Select Company Name</option>
                  {uniqueCompanies.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={styles.row}>
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
                  onClick={() => setIsFilterOpen(false)}
                  style={styles.modalCloseBtn}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUTORY CORRESPONDENCE PRINT PREVIEW SHEET */}
      {viewingLetterhead && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, maxWidth: '800px', padding: 0 }}>
            <div style={{ ...styles.modalHeader, padding: '16px 20px', borderBottom: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: 0 }}>🖨️ Letterhead Print Preview</h3>
              <button onClick={() => setViewingLetterhead(null)} style={styles.closeBtn}><X size={18}/></button>
            </div>
            
            {/* Printable Frame */}
            <div style={styles.printFrame} className="print-only-document">
              <div style={styles.printHeader}>
                <div>
                  <h1 style={{ color: '#0066cc', margin: 0, fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif' }}>TRANSCORE LOGISTICS</h1>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                    GSTIN: 09AAACT9211C1ZA • Regd. Address: Vadodara, Gujarat, India
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ color: '#64748b', margin: 0 }}>OFFICIAL CORRESPONDENCE</h3>
                  <p style={{ fontSize: '0.85rem', margin: '4px 0 0 0' }}><b>Ref #:</b> LH-{viewingLetterhead.letterheadNo}</p>
                  <p style={{ fontSize: '0.85rem', margin: '2px 0 0 0' }}><b>Date:</b> {viewingLetterhead.generateDate.split('-').reverse().join('/')}</p>
                </div>
              </div>

              <div style={styles.printBody}>
                <div style={styles.companyRecipient}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Addressed To:</span>
                  <h4 style={{ margin: '4px 0 2px 0', fontSize: '1.1rem', color: '#1e293b' }}>{viewingLetterhead.companyName}</h4>
                  {viewingLetterhead.companyGst && <p style={{ margin: '2px 0', fontSize: '0.85rem' }}><b>GSTIN:</b> {viewingLetterhead.companyGst}</p>}
                  {viewingLetterhead.companyMobile && <p style={{ margin: '2px 0', fontSize: '0.85rem' }}><b>Mobile:</b> {viewingLetterhead.companyMobile}</p>}
                  {viewingLetterhead.companyAddress && <p style={{ margin: '2px 0', fontSize: '0.85rem', lineHeight: '1.4' }}><b>Address:</b> {viewingLetterhead.companyAddress}</p>}
                </div>

                <div style={styles.printContentContainer}>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '0.95rem', color: '#334155' }}>
                    {viewingLetterhead.description || 'No correspondence description text provided.'}
                  </p>
                </div>
              </div>

              <div style={styles.printFooter}>
                <div style={{ width: '180px', borderBottom: '1px solid #cbd5e1', height: '40px', marginBottom: '6px' }}></div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Authorized Signatory</span>
              </div>
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8fafc' }}>
              <button 
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ backgroundColor: '#0066cc', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
              >
                <Printer size={16} /> Print Document
              </button>
              <button 
                onClick={() => setViewingLetterhead(null)}
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
    maxWidth: '520px',
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
    marginBottom: '30px'
  },
  printBody: {
    marginTop: '20px'
  },
  companyRecipient: {
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    marginBottom: '30px'
  },
  printContentContainer: {
    marginTop: '20px',
    minHeight: '260px'
  },
  printFooter: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '20px',
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
};
