import React, { useState } from 'react';
import { Download, Calendar, Truck, Eye, X, Home } from 'lucide-react';

export default function Reports({ activePage }) {
  const isRevenue = activePage === 'reports-revenue';
  const isPL = activePage === 'reports-pl' || activePage === 'reports';

  // Date filters - matching Screenshot 1
  const [fromDate, setFromDate] = useState('2026-05-01');
  const [toDate, setToDate] = useState('2026-05-13');

  // Radio toggles for Truck Revenue Report
  const [reportType, setReportType] = useState('bilty'); // 'bilty' or 'loading'

  // Seeded Market Trucks - exactly matching Screenshot 2
  const marketTrucks = [
    { truckNo: 'GJ-19-X -5778', trips: 1, route: 'Vadodara to Kanpur', party: 'Nirma Chemicals', weight: '18 MT', freight: 48000, hire: 44000, commission: 2000 },
    { truckNo: 'UP-70-LT-3066', trips: 1, route: 'Ahmedabad to Lucknow', party: 'Reliance Ind', weight: '22 MT', freight: 58000, hire: 53500, commission: 2500 },
    { truckNo: 'UP-77-AT-3303', trips: 1, route: 'Surat to Kanpur', party: 'Alok Industries', weight: '16 MT', freight: 42000, hire: 38000, commission: 2000 },
    { truckNo: 'UP-78-GN-7527', trips: 1, route: 'Bharuch to Unnao', party: 'Grasim Textiles', weight: '20 MT', freight: 52000, hire: 48000, commission: 2200 },
    { truckNo: 'UP-78-HN-3039', trips: 1, route: 'Anand to Agra', party: 'Amul Dairy', weight: '15 MT', freight: 39000, hire: 35500, commission: 1800 },
    { truckNo: 'UP-78-HT-2627', trips: 1, route: 'Halol to Kanpur', party: 'Windsor Machines', weight: '24 MT', freight: 64000, hire: 59000, commission: 3000 }
  ];

  // Details Modal State
  const [selectedTruck, setSelectedTruck] = useState(null);

  const handleDownloadReport = () => {
    alert(`🎉 Preparing Profit / Loss Report sheet from ${fromDate} to ${toDate} for browser printing!`);
    window.print();
  };

  return (
    <div className="glass-panel" style={{ backgroundColor: '#ffffff', minHeight: '85vh', padding: '24px', position: 'relative' }}>
      
      {/* Breadcrumbs - Outlined Home icon inside the breadcrumb rows */}
      <div style={styles.breadcrumbs}>
        <span style={styles.breadcrumbItem}>
          <Home size={14} style={{ marginRight: '4px' }} /> Home
        </span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span>Reports</span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>Profit / Loss Report</span>
      </div>

      {/* Main Header & Date Picker Card */}
      <div style={styles.headerCard}>
        <h2 style={styles.headerTitle}>Profit / Loss Report</h2>
        <div style={styles.headerControls}>
          <div style={styles.datePickerWrapper}>
            <input 
              type="date" 
              className="form-control" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
              style={styles.datePickerInput} 
            />
          </div>
          <div style={styles.datePickerWrapper}>
            <input 
              type="date" 
              className="form-control" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
              style={styles.datePickerInput} 
            />
          </div>
          <button style={styles.downloadBtn} onClick={handleDownloadReport}>
            <Download size={14} style={{ marginRight: '6px' }} /> Download
          </button>
        </div>
      </div>

      {/* PROFIT & LOSS REPORT VIEW */}
      {isPL && (
        <div style={{ marginTop: '20px' }}>
          
          {/* Banner Row - Total Income = 0, Total Expense = 0 */}
          <div style={styles.incomeExpenseBanner}>
            <div style={styles.bannerText}>Total Income = 0</div>
            <div style={styles.bannerText}>Total Expense = 0</div>
          </div>

          {/* Cards Grid */}
          <div style={styles.plCardsGrid}>
            
            {/* Card 1: Bilty Expense */}
            <div style={styles.plCard}>
              <h3 style={styles.plCardHeader}>Bilty Expense</h3>
              <div style={styles.plCardColumns}>
                {/* Own Truck */}
                <div style={styles.plSubColumn}>
                  <h4 style={styles.redSubTitle}>Own Truck</h4>
                  <div style={styles.fieldRow}>
                    <span>Total Income :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Total Expense :</span>
                    <span>0</span>
                  </div>
                </div>

                {/* Market Truck */}
                <div style={styles.plSubColumn}>
                  <h4 style={styles.redSubTitle}>Market Truck</h4>
                  <div style={styles.fieldRow}>
                    <span>Total Freight :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Truck Hire Cost :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Commission Amount :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Total Income :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Total Expense :</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Loading Slip Expense */}
            <div style={styles.plCard}>
              <h3 style={styles.plCardHeader}>Loading Slip Expense</h3>
              <div style={styles.plCardColumns}>
                {/* Own Truck */}
                <div style={styles.plSubColumn}>
                  <h4 style={styles.redSubTitle}>Own Truck</h4>
                  <div style={styles.fieldRow}>
                    <span>Total Income :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Total Expense :</span>
                    <span>0</span>
                  </div>
                </div>

                {/* Market Truck */}
                <div style={styles.plSubColumn}>
                  <h4 style={styles.redSubTitle}>Market Truck</h4>
                  <div style={styles.fieldRow}>
                    <span>Total Freight :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Truck Hire Cost :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Commission Amount :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Total Income :</span>
                    <span>0</span>
                  </div>
                  <div style={styles.fieldRow}>
                    <span>Total Expense :</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Truck Expense */}
            <div style={styles.plCard}>
              <h3 style={styles.plCardHeader}>Truck Expense</h3>
              <div style={styles.plCardColumns}>
                {/* Own Truck */}
                <div style={styles.plSubColumn}>
                  <h4 style={styles.redSubTitle}>Own Truck</h4>
                  <div style={styles.fieldRow}>
                    <span>Total Expense :</span>
                    <span>0</span>
                  </div>
                </div>

                {/* Market Truck */}
                <div style={styles.plSubColumn}>
                  <h4 style={styles.redSubTitle}>Market Truck</h4>
                  <div style={styles.fieldRow}>
                    <span>Total Expense :</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Office Expense */}
            <div style={styles.plCard}>
              <h3 style={styles.plCardHeader}>Office Expense</h3>
              <div style={{ ...styles.plCardColumns, justifyContent: 'center' }}>
                <div style={{ ...styles.plSubColumn, alignItems: 'center', width: '100%' }}>
                  <div style={{ ...styles.fieldRow, width: '100%', maxWidth: '240px', justifyContent: 'space-between' }}>
                    <span>Total Expense :</span>
                    <span style={{ fontWeight: '700' }}>0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Employee Expense */}
            <div style={{ ...styles.plCard, gridColumn: 'span 2' }}>
              <h3 style={styles.plCardHeader}>Employee Expense</h3>
              <div style={styles.plCardColumns}>
                <div style={{ ...styles.plSubColumn, paddingRight: '40px' }}>
                  <div style={styles.fieldRow}>
                    <span>Total Advance :</span>
                    <span>0</span>
                  </div>
                </div>
                <div style={{ ...styles.plSubColumn, borderLeft: '1px solid #e2e8f0', paddingLeft: '40px' }}>
                  <div style={styles.fieldRow}>
                    <span>Total Salary :</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TRUCK REVENUE REPORT VIEW */}
      {isRevenue && (
        <div style={{ marginTop: '20px' }}>
          
          {/* Radio selectors for Revenue subcategories */}
          <div style={styles.radioTogglesRow}>
            <label style={styles.radioLabel}>
              <input 
                type="radio" 
                name="reportType" 
                value="bilty" 
                checked={reportType === 'bilty'} 
                onChange={() => setReportType('bilty')} 
                style={styles.radioInput}
              />
              Truck Revenue Report by Bilty
            </label>
            <label style={styles.radioLabel}>
              <input 
                type="radio" 
                name="reportType" 
                value="loading" 
                checked={reportType === 'loading'} 
                onChange={() => setReportType('loading')} 
                style={styles.radioInput}
              />
              Truck Revenue Report by Loading Slip
            </label>
          </div>

          {/* Aggregate metrics block */}
          <div style={styles.aggregateMetricsBlock}>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Total Trip</span>
              <h2 style={styles.metricVal}>{reportType === 'bilty' ? '6' : '0'}</h2>
            </div>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Total Revenue</span>
              <h2 style={styles.metricVal}>0</h2>
            </div>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Total Expense</span>
              <h2 style={styles.metricVal}>0</h2>
            </div>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Total Profit/Loss</span>
              <h2 style={styles.metricVal}>0</h2>
            </div>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>From Date - To Date</span>
              <h4 style={styles.metricDateVal}>01-05-2026 - 13-05-2026</h4>
            </div>
          </div>

          {/* Section 1: OWN TRUCK Table */}
          <div style={{ marginTop: '24px' }}>
            <h3 style={styles.tableTitle}>OWN TRUCK</h3>
            <div className="table-container">
              <table className="custom-table" style={{ border: '1px solid #d1d5db' }}>
                <thead>
                  <tr>
                    <th style={styles.tableTh}>Truck No.</th>
                    <th style={styles.tableTh}>Trip Count</th>
                    <th style={styles.tableTh}>Revenue</th>
                    <th style={styles.tableTh}>Expense</th>
                    <th style={styles.tableTh}>Profit/Loss</th>
                    <th style={styles.tableTh}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} style={styles.noDataRow}>No Data Found</td>
                  </tr>
                  {/* Totals row */}
                  <tr style={styles.totalsTr}>
                    <td style={{ fontWeight: '800' }}>Total</td>
                    <td style={{ fontWeight: '800' }}>0</td>
                    <td style={{ fontWeight: '800' }}>0</td>
                    <td style={{ fontWeight: '800' }}>0</td>
                    <td style={{ fontWeight: '800', color: '#10b981' }}>Total Profit/Loss : 0</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: MARKET TRUCK Table */}
          <div style={{ marginTop: '30px' }}>
            <h3 style={styles.tableTitle}>MARKET TRUCK</h3>
            <div className="table-container">
              <table className="custom-table" style={{ border: '1px solid #d1d5db' }}>
                <thead>
                  <tr>
                    <th style={styles.tableTh}>Truck No.</th>
                    <th style={styles.tableTh}>Trip Count</th>
                    <th style={styles.tableTh}>Total Amount</th>
                    <th style={styles.tableTh}>Truck Hire Cost</th>
                    <th style={styles.tableTh}>Commission Amount</th>
                    <th style={styles.tableTh}>Revenue</th>
                    <th style={styles.tableTh}>Expense</th>
                    <th style={styles.tableTh}>Profit/Loss</th>
                    <th style={styles.tableTh}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reportType === 'bilty' ? (
                    marketTrucks.map((truck) => (
                      <tr key={truck.truckNo}>
                        <td style={{ fontWeight: '700', color: '#0f172a' }}>{truck.truckNo}</td>
                        <td style={{ fontWeight: '600' }}>{truck.trips}</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td style={{ fontWeight: '700' }}>:</td>
                        <td>
                          <button 
                            className="btn" 
                            style={styles.viewDetailsBtn} 
                            onClick={() => setSelectedTruck(truck)}
                          >
                            <Eye size={12} style={{ marginRight: '4px' }} /> View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} style={styles.noDataRow}>No Data Found</td>
                    </tr>
                  )}
                  {/* Totals row */}
                  <tr style={styles.totalsTr}>
                    <td style={{ fontWeight: '800' }}>Total</td>
                    <td style={{ fontWeight: '800' }}>{reportType === 'bilty' ? '6' : '0'}</td>
                    <td style={{ fontWeight: '800' }}>0</td>
                    <td style={{ fontWeight: '800' }}>0</td>
                    <td style={{ fontWeight: '800' }}>0</td>
                    <td style={{ fontWeight: '800' }}>0</td>
                    <td style={{ fontWeight: '800' }}>0</td>
                    <td style={{ fontWeight: '800', color: '#10b981' }}>Total Profit/Loss : 0</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* High-Fidelity Details Overlay Modal for Selected Market Truck */}
      {selectedTruck && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🚚 Operating Dispatch Yield Details</h3>
              <button style={styles.modalCloseBtn} onClick={() => setSelectedTruck(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.truckDetailBadge}>
                <Truck size={18} style={{ color: '#0066cc', marginRight: '8px' }} />
                <span>Registration No: <b>{selectedTruck.truckNo}</b></span>
              </div>

              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailItemLabel}>Route / Path</span>
                  <span style={styles.detailItemValue}>{selectedTruck.route}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailItemLabel}>Client Party</span>
                  <span style={styles.detailItemValue}>{selectedTruck.party}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailItemLabel}>Payload Weight</span>
                  <span style={styles.detailItemValue}>{selectedTruck.weight}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailItemLabel}>Operating Trip Count</span>
                  <span style={styles.detailItemValue}>{selectedTruck.trips} Trip</span>
                </div>
              </div>

              <div style={styles.financialSection}>
                <h4 style={styles.financialSectionTitle}>Trip Financial breakdown</h4>
                <div style={styles.financialRow}>
                  <span>Client Freight Revenue</span>
                  <span style={{ fontWeight: '700', color: '#00b050' }}>₹{selectedTruck.freight.toLocaleString()}</span>
                </div>
                <div style={styles.financialRow}>
                  <span>Market Truck Hire Cost</span>
                  <span style={{ fontWeight: '700', color: '#ef4444' }}>- ₹{selectedTruck.hire.toLocaleString()}</span>
                </div>
                <div style={{ ...styles.financialRow, borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                  <span>Roadwe Service Commission</span>
                  <span style={{ fontWeight: '700', color: '#64748b' }}>₹{selectedTruck.commission.toLocaleString()}</span>
                </div>
                <div style={{ ...styles.financialRow, borderTop: '1px solid #0f172a', paddingTop: '10px', marginTop: '4px' }}>
                  <span style={{ fontWeight: '800' }}>Net Operating Margin Yield</span>
                  <span style={{ fontWeight: '800', color: '#0066cc', fontSize: '1.05rem' }}>
                    ₹{(selectedTruck.freight - selectedTruck.hire).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setSelectedTruck(null)}>Close Details</button>
            </div>

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
  breadcrumbItem: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#64748b'
  },
  breadcrumbSeparator: {
    color: '#94a3b8'
  },
  breadcrumbActive: {
    color: '#0066cc',
    fontWeight: '600'
  },
  headerCard: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  datePickerWrapper: {
    position: 'relative'
  },
  datePickerInput: {
    padding: '6px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '150px'
  },
  downloadBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 102, 204, 0.15)',
    transition: 'all 0.15s ease'
  },
  incomeExpenseBanner: {
    background: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '14px 24px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '20px'
  },
  bannerText: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  plCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  },
  plCard: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
  },
  plCardHeader: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    textDecoration: 'underline',
    marginBottom: '16px'
  },
  plCardColumns: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px'
  },
  plSubColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  redSubTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#ef4444',
    textDecoration: 'underline',
    marginBottom: '4px'
  },
  fieldRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.825rem',
    color: '#475569',
    fontWeight: '600'
  },
  radioTogglesRow: {
    background: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '14px 20px',
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
    marginBottom: '20px'
  },
  radioLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#0f172a',
    cursor: 'pointer',
    userSelect: 'none'
  },
  radioInput: {
    marginRight: '8px',
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  aggregateMetricsBlock: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  metricCard: {
    background: '#ffffff',
    border: '1px solid #000000', // Thin dark grey/black borders matching Screenshot 2
    borderRadius: '6px',
    padding: '12px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '80px'
  },
  metricLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    marginBottom: '4px'
  },
  metricVal: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#0f172a',
    fontFamily: 'Outfit'
  },
  metricDateVal: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#0f172a',
    fontFamily: 'Outfit'
  },
  tableTitle: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '10px'
  },
  tableTh: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#1e293b',
    textTransform: 'none',
    letterSpacing: 'normal',
    padding: '10px 12px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #cbd5e1'
  },
  noDataRow: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#64748b',
    padding: '30px 0',
    fontSize: '0.85rem'
  },
  totalsTr: {
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #cbd5e1'
  },
  viewDetailsBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    fontSize: '0.725rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  modalContent: {
    background: '#ffffff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  modalHeader: {
    backgroundColor: '#f8fafc',
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#0f172a'
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  modalBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  truckDetailBadge: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '0.85rem',
    color: '#1e40af',
    display: 'flex',
    alignItems: 'center'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  detailItem: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column'
  },
  detailItemLabel: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '2px'
  },
  detailItemValue: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  financialSection: {
    backgroundColor: '#fafafa',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  financialSectionTitle: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    marginBottom: '4px',
    borderBottom: '1px solid #cbd5e1',
    paddingBottom: '4px'
  },
  financialRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#334155',
    fontWeight: '600'
  },
  modalFooter: {
    backgroundColor: '#f8fafc',
    padding: '12px 20px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end'
  }
};
