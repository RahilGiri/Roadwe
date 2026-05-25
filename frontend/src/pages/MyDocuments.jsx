import React, { useState } from 'react';
import { Upload, Download, FileText, Check, AlertCircle, Home, Shield } from 'lucide-react';

export default function MyDocuments() {
  // Staged files states for preview/status
  const [stagedFiles, setStagedFiles] = useState({
    panFront: null,
    businessFront: null,
    businessBack: null,
    gstFront: null,
    gstBack: null,
    tdsPan: null,
    bankPassbook: null,
    bankQr: null
  });

  // TDS Declaration form states - matching Screenshot 5
  const [tdsName, setTdsName] = useState('TRANSCORE LOGISTICS');
  const [tdsGst, setTdsGst] = useState('09AAACT9211C1ZA');
  const [tdsPan, setTdsPan] = useState('AAACT9211C');
  const [tdsPlace, setTdsPlace] = useState('Kanpur');
  const [tdsTrucks, setTdsTrucks] = useState('2');
  const [tdsFy, setTdsFy] = useState('2026-2027');
  const [tdsDeclaringBy, setTdsDeclaringBy] = useState('Proprietor');

  // Bank Details states - matching Screenshot 5
  const [bankHolder, setBankHolder] = useState('TRANSCORE LOGISTICS PVT LTD');
  const [bankName, setBankName] = useState('State Bank of India (SBI)');
  const [bankAccNo, setBankAccNo] = useState('33004455221');
  const [bankIfsc, setBankIfsc] = useState('SBIN0001234');
  const [bankPanNo, setBankPanNo] = useState('AAACT9211C');
  const [bankPanName, setBankPanName] = useState('TRANSCORE LOGISTICS');

  const handleFileChange = (key, file) => {
    if (file) {
      setStagedFiles(prev => ({
        ...prev,
        [key]: file.name
      }));
    }
  };

  const handleUpload = (docType) => {
    alert(`🎉 Secure upload triggered! ${docType} has been successfully saved to your Transporter KYC locker.`);
  };

  const handleDownloadPDF = (title, data) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - TRANSCORE LOGISTICS</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background-color: #f8fafc; }
            .letterhead { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { display: flex; justify-content: space-between; border-bottom: 3px double #0066cc; padding-bottom: 20px; }
            .company-name { font-size: 1.6rem; font-weight: 800; color: #0f172a; font-family: 'Outfit', sans-serif; letter-spacing: 0.02em; }
            .subtitle { font-size: 0.8rem; color: #64748b; font-weight: 600; margin-top: 4px; }
            .title-banner { background-color: #eff6ff; color: #0066cc; text-align: center; padding: 12px; border-radius: 6px; font-weight: 800; font-size: 1.1rem; margin: 30px 0; border: 1px solid #bfdbfe; text-transform: uppercase; font-family: 'Outfit', sans-serif; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
            .field-box { background-color: #fafafa; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 6px; }
            .label { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; display: block; }
            .value { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
            .footer-sig { margin-top: 80px; display: flex; justify-content: space-between; padding: 0 10px; }
            .sig-box { text-align: center; }
            .sig-line { border-top: 1px solid #0f172a; width: 220px; margin-bottom: 8px; }
            .sig-title { font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <div class="header">
              <div>
                <div class="company-name">TRANSCORE LOGISTICS PVT LTD</div>
                <div class="subtitle">STATUTORY REGISTRATION & KYC CREDENTIALS</div>
              </div>
              <div style="text-align: right; font-size: 0.75rem; color: #64748b; font-weight: 600;">
                <div>LIC: TRANSPORT-KYC-2026</div>
                <div>support@transcore.in</div>
              </div>
            </div>
            <div class="title-banner">${title}</div>
            <div class="grid">
              ${Object.entries(data).map(([lbl, val]) => `
                <div class="field-box">
                  <span class="label">${lbl}</span>
                  <span class="value">${val}</span>
                </div>
              `).join('')}
            </div>
            <div class="footer-sig">
              <div class="sig-box">
                <div class="sig-line" style="margin-top: 40px;"></div>
                <span class="sig-title">Declarant / Authorized Signatory</span>
              </div>
              <div class="sig-box">
                <div class="sig-line" style="margin-top: 40px;"></div>
                <span class="sig-title">System Verified Stamp</span>
              </div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadTdsPDF = () => {
    handleDownloadPDF('TDS Declaration Certificate', {
      'Declarant Name': tdsName,
      'GSTIN Registration': tdsGst,
      'PAN Card Number': tdsPan,
      'Declaration Location': tdsPlace,
      'Active Fleet Size': `${tdsTrucks} Vehicles`,
      'Financial Year (FY)': tdsFy,
      'Declarant Capacity': tdsDeclaringBy
    });
  };

  const downloadBankPDF = () => {
    handleDownloadPDF('Official Bank Coordinates', {
      'Beneficiary Holder': bankHolder,
      'Financial Institution': bankName,
      'Account Coordinates': bankAccNo,
      'IFSC Code': bankIfsc,
      'Corporate PAN Card': bankPanNo,
      'Name Registered on PAN': bankPanName
    });
  };

  return (
    <div style={styles.container}>
      
      {/* Breadcrumbs - Outlined Home icon inside the breadcrumb rows */}
      <div style={styles.breadcrumbs}>
        <span style={styles.breadcrumbItem}>
          <Home size={14} style={{ marginRight: '4px' }} /> Home
        </span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>My Documents</span>
      </div>

      {/* Page Title Card */}
      <div style={styles.pageHeaderCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.shieldIconBg}>
            <Shield size={24} style={{ color: '#00b050' }} />
          </div>
          <div>
            <h2 style={styles.pageTitle}>My Documents</h2>
            <p style={styles.pageSubtitle}>Secure statutory KYC document repository and official tax coordinators locker.</p>
          </div>
        </div>
      </div>

      {/* Row 1: Document Upload drawers - Styled borders matching Screenshot 4 */}
      <div style={styles.uploadSectionCard}>
        <div style={styles.uploadDrawersList}>
          
          {/* Drawer 1: PAN CARD */}
          <div style={styles.uploadRow}>
            <div style={styles.rowLabel}>
              <span style={styles.docTitle}>PAN CARD</span>
            </div>
            
            <div style={styles.rowControls}>
              <div style={styles.fileField}>
                <span style={styles.sideLabel}>FRONT</span>
                <div style={styles.fileInputWrapper}>
                  <input 
                    type="file" 
                    id="panFront"
                    onChange={(e) => handleFileChange('panFront', e.target.files[0])}
                    style={styles.fileInput}
                  />
                  <label htmlFor="panFront" style={styles.fileBtn}>
                    Choose File
                  </label>
                  <span style={styles.fileName}>{stagedFiles.panFront || 'No file chosen'}</span>
                </div>
              </div>
            </div>

            <button style={styles.uploadBtn} onClick={() => handleUpload('PAN Card')}>
              UPLOAD
            </button>
          </div>

          {/* Drawer 2: BUSINESS CARD */}
          <div style={styles.uploadRow}>
            <div style={styles.rowLabel}>
              <span style={styles.docTitle}>BUSINESS CARD</span>
            </div>

            <div style={styles.rowControlsDual}>
              <div style={styles.fileField}>
                <span style={styles.sideLabel}>FRONT</span>
                <div style={styles.fileInputWrapper}>
                  <input 
                    type="file" 
                    id="businessFront"
                    onChange={(e) => handleFileChange('businessFront', e.target.files[0])}
                    style={styles.fileInput}
                  />
                  <label htmlFor="businessFront" style={styles.fileBtn}>
                    Choose File
                  </label>
                  <span style={styles.fileName}>{stagedFiles.businessFront || 'No file chosen'}</span>
                </div>
              </div>
              
              <div style={{ ...styles.fileField, marginLeft: '24px' }}>
                <span style={styles.sideLabel}>BACK</span>
                <div style={styles.fileInputWrapper}>
                  <input 
                    type="file" 
                    id="businessBack"
                    onChange={(e) => handleFileChange('businessBack', e.target.files[0])}
                    style={styles.fileInput}
                  />
                  <label htmlFor="businessBack" style={styles.fileBtn}>
                    Choose File
                  </label>
                  <span style={styles.fileName}>{stagedFiles.businessBack || 'No file chosen'}</span>
                </div>
              </div>
            </div>

            <button style={styles.uploadBtn} onClick={() => handleUpload('Business Card')}>
              UPLOAD
            </button>
          </div>

          {/* Drawer 3: GST CERTIFICATE */}
          <div style={styles.uploadRow}>
            <div style={styles.rowLabel}>
              <span style={styles.docTitle}>GST CERTIFICATE</span>
            </div>

            <div style={styles.rowControlsDual}>
              <div style={styles.fileField}>
                <span style={styles.sideLabel}>FRONT</span>
                <div style={styles.fileInputWrapper}>
                  <input 
                    type="file" 
                    id="gstFront"
                    onChange={(e) => handleFileChange('gstFront', e.target.files[0])}
                    style={styles.fileInput}
                  />
                  <label htmlFor="gstFront" style={styles.fileBtn}>
                    Choose File
                  </label>
                  <span style={styles.fileName}>{stagedFiles.gstFront || 'No file chosen'}</span>
                </div>
              </div>
              
              <div style={{ ...styles.fileField, marginLeft: '24px' }}>
                <span style={styles.sideLabel}>BACK</span>
                <div style={styles.fileInputWrapper}>
                  <input 
                    type="file" 
                    id="gstBack"
                    onChange={(e) => handleFileChange('gstBack', e.target.files[0])}
                    style={styles.fileInput}
                  />
                  <label htmlFor="gstBack" style={styles.fileBtn}>
                    Choose File
                  </label>
                  <span style={styles.fileName}>{stagedFiles.gstBack || 'No file chosen'}</span>
                </div>
              </div>
            </div>

            <button style={styles.uploadBtn} onClick={() => handleUpload('GST Certificate')}>
              UPLOAD
            </button>
          </div>

        </div>
      </div>

      {/* Row 2: TDS DECLARATION Form */}
      <div style={styles.formSectionCard}>
        <h3 style={styles.sectionTitle}>TDS DECLARATION</h3>
        <div style={styles.formGridDouble}>
          <div className="form-group">
            <label style={styles.formLabel}>Company / Person Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input 
              type="text" className="form-control"
              value={tdsName} onChange={(e) => setTdsName(e.target.value)}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>GST No. <span style={{ color: '#ef4444' }}>*</span></label>
            <input 
              type="text" className="form-control"
              value={tdsGst} onChange={(e) => setTdsGst(e.target.value)}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>PAN No. <span style={{ color: '#ef4444' }}>*</span></label>
            <input 
              type="text" className="form-control"
              value={tdsPan} onChange={(e) => setTdsPan(e.target.value.toUpperCase())}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>Place <span style={{ color: '#ef4444' }}>*</span></label>
            <input 
              type="text" className="form-control"
              value={tdsPlace} onChange={(e) => setTdsPlace(e.target.value)}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>No. of Truck <span style={{ color: '#ef4444' }}>*</span></label>
            <input 
              type="number" className="form-control"
              value={tdsTrucks} onChange={(e) => setTdsTrucks(e.target.value)}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>Financial Year <span style={{ color: '#ef4444' }}>*</span></label>
            <select className="form-control" value={tdsFy} onChange={(e) => setTdsFy(e.target.value)} style={styles.formSelectBox}>
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>Who Make Declaration <span style={{ color: '#ef4444' }}>*</span></label>
            <select className="form-control" value={tdsDeclaringBy} onChange={(e) => setTdsDeclaringBy(e.target.value)} style={styles.formSelectBox}>
              <option value="Proprietor">Proprietor</option>
              <option value="Partner">Partner</option>
              <option value="Director">Director</option>
              <option value="Authorized Signatory">Authorized Signatory</option>
            </select>
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>PAN Card</label>
            <div style={styles.fileInputWrapper}>
              <input 
                type="file" 
                id="tdsPanFile"
                onChange={(e) => handleFileChange('tdsPan', e.target.files[0])}
                style={styles.fileInput}
              />
              <label htmlFor="tdsPanFile" style={styles.fileBtn}>
                Choose File
              </label>
              <span style={styles.fileName}>{stagedFiles.tdsPan || 'No file chosen'}</span>
            </div>
          </div>
        </div>

        <div style={styles.centeredBtnRow}>
          <button style={styles.greenActionBtn} onClick={() => handleUpload('TDS Declaration Form')}>
            Upload
          </button>
          <button style={styles.blueActionBtn} onClick={downloadTdsPDF}>
            Download PDF
          </button>
        </div>
      </div>

      {/* Row 3: BANK DETAILS Form */}
      <div style={styles.formSectionCard}>
        <h3 style={styles.sectionTitle}>BANK DETAILS</h3>
        <div style={styles.formGridDouble}>
          <div className="form-group">
            <label style={styles.formLabel}>Account Holder Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input 
              type="text" className="form-control"
              value={bankHolder} onChange={(e) => setBankHolder(e.target.value)}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>Bank Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input 
              type="text" className="form-control"
              value={bankName} onChange={(e) => setBankName(e.target.value)}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>Bank Account No.</label>
            <input 
              type="text" className="form-control"
              value={bankAccNo} onChange={(e) => setBankAccNo(e.target.value)}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>IFSC</label>
            <input 
              type="text" className="form-control"
              value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>PAN Card No.</label>
            <input 
              type="text" className="form-control"
              value={bankPanNo} onChange={(e) => setBankPanNo(e.target.value.toUpperCase())}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>Name on PAN Card</label>
            <input 
              type="text" className="form-control"
              value={bankPanName} onChange={(e) => setBankPanName(e.target.value)}
              style={styles.formInputBox}
            />
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>Passbook / Cheque</label>
            <div style={styles.fileInputWrapper}>
              <input 
                type="file" 
                id="bankPassbookFile"
                onChange={(e) => handleFileChange('bankPassbook', e.target.files[0])}
                style={styles.fileInput}
              />
              <label htmlFor="bankPassbookFile" style={styles.fileBtn}>
                Choose File
              </label>
              <span style={styles.fileName}>{stagedFiles.bankPassbook || 'No file chosen'}</span>
            </div>
          </div>
          <div className="form-group">
            <label style={styles.formLabel}>QR Code</label>
            <div style={styles.fileInputWrapper}>
              <input 
                type="file" 
                id="bankQrFile"
                onChange={(e) => handleFileChange('bankQr', e.target.files[0])}
                style={styles.fileInput}
              />
              <label htmlFor="bankQrFile" style={styles.fileBtn}>
                Choose File
              </label>
              <span style={styles.fileName}>{stagedFiles.bankQr || 'No file chosen'}</span>
            </div>
          </div>
        </div>

        <div style={styles.centeredBtnRow}>
          <button style={styles.greenActionBtn} onClick={() => handleUpload('Bank Coordinates Profile')}>
            Upload
          </button>
          <button style={styles.blueActionBtn} onClick={downloadBankPDF}>
            Download PDF
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
    gap: '24px'
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
    marginBottom: '-8px'
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
  pageHeaderCard: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
  },
  shieldIconBg: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pageTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  pageSubtitle: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '2px'
  },
  uploadSectionCard: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
  },
  uploadDrawersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  uploadRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    border: '1px solid #cbd5e1', // Slate borders matching screenshots
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    flexWrap: 'wrap',
    gap: '16px',
    transition: 'all 0.15s ease'
  },
  rowLabel: {
    width: '180px',
    flexShrink: 0
  },
  docTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#ef4444', // Red labels matching screenshots
    letterSpacing: '0.02em'
  },
  rowControls: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  rowControlsDual: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  fileField: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  sideLabel: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#ef4444', // Red side labels (FRONT/BACK)
    width: '50px'
  },
  fileInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'relative'
  },
  fileInput: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0,
    width: '100px',
    height: '32px',
    cursor: 'pointer'
  },
  fileBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 14px',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  fileName: {
    fontSize: '0.75rem',
    color: '#64748b',
    maxWidth: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: '500'
  },
  uploadBtn: {
    backgroundColor: '#00b050', // Premium emerald green action buttons matching screenshots
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    width: '100px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 176, 80, 0.15)',
    transition: 'all 0.15s ease'
  },
  formSectionCard: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#ef4444', // Red title matching screenshots
    letterSpacing: '0.05em',
    marginBottom: '20px',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '8px',
    textAlign: 'center'
  },
  formGridDouble: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px 30px'
  },
  formLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '6px',
    display: 'block'
  },
  formInputBox: {
    padding: '8px 12px',
    border: '1px solid #cbd5e1', // Slate borders matching inputs
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#ffffff',
    outline: 'none',
    width: '100%'
  },
  formSelectBox: {
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
  centeredBtnRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '28px',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px'
  },
  greenActionBtn: {
    backgroundColor: '#00b050', // Emerald green
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '700',
    padding: '10px 28px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 176, 80, 0.15)',
    transition: 'all 0.15s ease'
  },
  blueActionBtn: {
    backgroundColor: '#0066cc', // Royal blue
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '700',
    padding: '10px 28px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 102, 204, 0.15)',
    transition: 'all 0.15s ease'
  }
};
