import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Palette, HelpCircle, AlertCircle, RefreshCw, Trash2, Home } from 'lucide-react';

export default function Settings({
  logoImg, setLogoImg,
  stampImg, setStampImg,
  headingColor, setHeadingColor,
  listDocBy, setListDocBy,
  showBiltyBank, setShowBiltyBank,
  showLoadBank, setShowLoadBank,
  showInvoiceBank, setShowInvoiceBank,
  selectedBiltyFormat, setSelectedBiltyFormat,
  selectedLoadingFormat, setSelectedLoadingFormat,
  loadingBgColor, setLoadingBgColor,
  voucherBgColor, setVoucherBgColor,
  biltyMinDigits, setBiltyMinDigits,
  loadingMinDigits, setLoadingMinDigits,
  invoiceMinDigits, setInvoiceMinDigits,
  chalanMinDigits, setChalanMinDigits,
  notifyInterval, setNotifyInterval,
  invoiceHeading, setInvoiceHeading,
  biltyTemplates = [],
  onSaveSettings
}) {
  const [logoStaged, setLogoStaged] = useState(!!logoImg);
  const [stampName, setStampName] = useState('');

  // Password / Security form states
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImg(event.target.result);
        setLogoStaged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStampUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStampName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setStampImg(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = () => {
    setLogoStaged(false);
    setLogoImg(null);
  };

  const handleSaveSettings = async () => {
    if (onSaveSettings) {
      const formatToCode = {
        1: 'classic_lr',
        2: 'triple_split',
        3: 'relational',
        4: 'invoice_style',
        5: 'minimal'
      };
      const code = formatToCode[selectedBiltyFormat] || 'classic_lr';
      const template = biltyTemplates.find(t => t.template_code === code);
      const selected_template_id = template ? template._id : undefined;

      await onSaveSettings({
        selected_template_id,
        logo_img: logoImg || '',
        stamp_img: stampImg || '',
        heading_color: headingColor,
        show_bilty_bank: showBiltyBank,
        show_load_bank: showLoadBank,
        show_invoice_bank: showInvoiceBank,
        selected_loading_format: selectedLoadingFormat,
        loading_bg_color: loadingBgColor,
        voucher_bg_color: voucherBgColor,
        bilty_min_digits: biltyMinDigits,
        loading_min_digits: loadingMinDigits,
        invoice_min_digits: invoiceMinDigits,
        chalan_min_digits: chalanMinDigits,
        notify_interval: notifyInterval,
        invoice_heading: invoiceHeading
      });
    }
    alert('🚀 System settings saved to database successfully! Print layouts refreshed.');
  };

  // Preset swatches list matching Screenshot 3
  const backgroundSwatches = [
    { label: 'Grey', value: '#cbd5e1' },
    { label: 'Green', value: '#d1fae5' },
    { label: 'Pink', value: '#fce7f3' },
    { label: 'Yellow', value: '#fef9c3' },
    { label: 'White', value: '#ffffff' }
  ];

  return (
    <div style={styles.container}>
      
      {/* Breadcrumbs - Outlined Home icon inside the breadcrumb rows */}
      <div style={styles.breadcrumbs}>
        <span style={styles.breadcrumbItem}>
          <Home size={14} style={{ marginRight: '4px' }} /> Home
        </span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>Settings</span>
      </div>

      <h2 style={styles.pageTitle}>Settings</h2>

      <div style={styles.card}>
        
        {/* Row 1: Logo & Stamp loaders alongside Color & Document Ordering */}
        <div style={styles.brandingRow}>
          
          {/* Stamp Circular slot */}
          <div style={styles.brandingBox}>
            <div style={styles.circularWrapper}>
              {stampImg ? (
                <img src={stampImg} alt="Stamp preview" style={styles.brandingImg} />
              ) : (
                <div style={styles.placeholderLabel}>Choose File</div>
              )}
              <input 
                type="file" 
                id="stampSelector" 
                onChange={handleStampUpload}
                style={styles.hiddenInput} 
              />
              <label htmlFor="stampSelector" style={styles.circularOverlay}></label>
            </div>
            <span style={styles.brandingTitle}>Stamp</span>
          </div>

          {/* Logo Circular slot with Red Delete button */}
          <div style={styles.brandingBox}>
            <div style={styles.circularWrapper}>
              {logoImg ? (
                <img src={logoImg} alt="Logo preview" style={styles.brandingImg} />
              ) : (
                <div style={styles.placeholderLabel}>Choose File</div>
              )}
              <input 
                type="file" 
                id="logoSelector" 
                onChange={handleLogoUpload}
                style={styles.hiddenInput} 
              />
              <label htmlFor="logoSelector" style={styles.circularOverlay}></label>
            </div>
            <span style={styles.brandingTitle}>Logo</span>
            {logoImg && (
              <button onClick={handleDeleteLogo} style={styles.deleteLogoBtn}>
                Delete Logo
              </button>
            )}
          </div>

          {/* Document Heading colorpicker & List document by ordering dropdown */}
          <div style={styles.controlsColumn}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label style={styles.sectionLabel}>Document Heading Color:</label>
              <div style={styles.colorPickerWrapper}>
                <span style={styles.colorLabel}>Select Color : </span>
                <input 
                  type="color" 
                  value={headingColor}
                  onChange={(e) => setHeadingColor(e.target.value)}
                  style={styles.colorBox}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={styles.sectionLabel}>List Document By :</label>
              <select 
                className="form-control"
                value={listDocBy}
                onChange={(e) => setListDocBy(e.target.value)}
                style={styles.selectOrderingControl}
              >
                <option value="Document Date">Document Date</option>
                <option value="Entry Date">Entry Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: General settings inputs (Show/hide bank, passkeys, notification intervals) */}
        <div style={styles.grid}>
          
          {/* Show/Hide bank checkboxes */}
          <div className="form-group">
            <label style={styles.sectionLabel}>Show/Hide Bank Details in Document :</label>
            <div style={styles.checkboxGroup}>
              <label style={styles.checkLabel}>
                <input 
                  type="checkbox" 
                  checked={showBiltyBank}
                  onChange={(e) => setShowBiltyBank(e.target.checked)}
                  style={styles.chk}
                />
                Bilty
              </label>
              <label style={styles.checkLabel}>
                <input 
                  type="checkbox" 
                  checked={showLoadBank}
                  onChange={(e) => setShowLoadBank(e.target.checked)}
                  style={styles.chk}
                />
                Load Advice
              </label>
              <label style={styles.checkLabel}>
                <input 
                  type="checkbox" 
                  checked={showInvoiceBank}
                  onChange={(e) => setShowInvoiceBank(e.target.checked)}
                  style={styles.chk}
                />
                Invoice
              </label>
            </div>
          </div>

          {/* New Passkey with show password */}
          <div className="form-group">
            <label style={styles.sectionLabel}>New Password :</label>
            <input 
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.inputBox}
            />
            <label style={styles.showPassLabel}>
              <input 
                type="checkbox" 
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                style={styles.chkSmall}
              />
              Show Password
            </label>
          </div>

          {/* Driver Location notify interval */}
          <div className="form-group">
            <label style={styles.sectionLabel}>Driver Location Notification Interval :</label>
            <select 
              className="form-control"
              value={notifyInterval}
              onChange={(e) => setNotifyInterval(e.target.value)}
              style={styles.formSelect}
            >
              <option value="15 MIN">15 MIN</option>
              <option value="30 MIN">30 MIN</option>
              <option value="1 HOUR">1 HOUR</option>
              <option value="OFF">OFF</option>
            </select>
          </div>

          {/* Invoice heading selection */}
          <div className="form-group">
            <label style={styles.sectionLabel}>Invoice Heading :</label>
            <select 
              className="form-control"
              value={invoiceHeading}
              onChange={(e) => setInvoiceHeading(e.target.value)}
              style={styles.formSelect}
            >
              <option value="Default Template">TAX INVOICE</option>
              <option value="Freight Invoice">FREIGHT BILL</option>
              <option value="Custom Heading">Custom Heading</option>
            </select>
          </div>
        </div>

        {/* Row 3: Select Bilty Format - 5 visual options (Screenshot 1 & 2) */}
        <div style={styles.templatesSection}>
          <h3 style={styles.sectionTitle}>Select Bilty Format :</h3>
          
          <div style={styles.formatGrid}>
            {/* Format 1 */}
            <div 
              style={{
                ...styles.formatCard,
                ...(selectedBiltyFormat === 1 ? styles.formatCardActive : {})
              }}
              onClick={() => setSelectedBiltyFormat(1)}
            >
              <div style={styles.formatPreview}>
                <img src="/bilty_format_1.jpg" alt="Format 1 Preview" style={styles.formatPreviewImage} />
              </div>
              <div style={styles.formatSelectRow}>
                <input 
                  type="radio" 
                  name="biltyFormat" 
                  checked={selectedBiltyFormat === 1}
                  onChange={() => setSelectedBiltyFormat(1)}
                  style={styles.radioControl}
                />
                <span style={styles.formatLabel}>Standard Classic LR</span>
              </div>
            </div>

            {/* Format 2 */}
            <div 
              style={{
                ...styles.formatCard,
                ...(selectedBiltyFormat === 2 ? styles.formatCardActive : {})
              }}
              onClick={() => setSelectedBiltyFormat(2)}
            >
              <div style={styles.formatPreview}>
                <img src="/bilty_format_2.jpg" alt="Format 2 Preview" style={styles.formatPreviewImage} />
              </div>
              <div style={styles.formatSelectRow}>
                <input 
                  type="radio" 
                  name="biltyFormat" 
                  checked={selectedBiltyFormat === 2}
                  onChange={() => setSelectedBiltyFormat(2)}
                  style={styles.radioControl}
                />
                <span style={styles.formatLabel}>Triple-Split Dispatch Summary</span>
              </div>
            </div>

            {/* Format 3 */}
            <div 
              style={{
                ...styles.formatCard,
                ...(selectedBiltyFormat === 3 ? styles.formatCardActive : {})
              }}
              onClick={() => setSelectedBiltyFormat(3)}
            >
              <div style={styles.formatPreview}>
                <img src="/bilty_format_3.jpg" alt="Format 3 Preview" style={styles.formatPreviewImage} />
              </div>
              <div style={styles.formatSelectRow}>
                <input 
                  type="radio" 
                  name="biltyFormat" 
                  checked={selectedBiltyFormat === 3}
                  onChange={() => setSelectedBiltyFormat(3)}
                  style={styles.radioControl}
                />
                <span style={styles.formatLabel}>Relational Corporate Format</span>
              </div>
            </div>

            {/* Format 4 */}
            <div 
              style={{
                ...styles.formatCard,
                ...(selectedBiltyFormat === 4 ? styles.formatCardActive : {})
              }}
              onClick={() => setSelectedBiltyFormat(4)}
            >
              <div style={styles.formatPreview}>
                <img src="/bilty_format_4.jpg" alt="Format 4 Preview" style={styles.formatPreviewImage} />
              </div>
              <div style={styles.formatSelectRow}>
                <input 
                  type="radio" 
                  name="biltyFormat" 
                  checked={selectedBiltyFormat === 4}
                  onChange={() => setSelectedBiltyFormat(4)}
                  style={styles.radioControl}
                />
                <span style={styles.formatLabel}>Modern Grid Invoice-style</span>
              </div>
            </div>

            {/* Format 5 */}
            <div 
              style={{
                ...styles.formatCard,
                ...(selectedBiltyFormat === 5 ? styles.formatCardActive : {})
              }}
              onClick={() => setSelectedBiltyFormat(5)}
            >
              <div style={styles.formatPreview}>
                <img src="/bilty_format_5.jpg" alt="Format 5 Preview" style={styles.formatPreviewImage} />
              </div>
              <div style={styles.formatSelectRow}>
                <input 
                  type="radio" 
                  name="biltyFormat" 
                  checked={selectedBiltyFormat === 5}
                  onChange={() => setSelectedBiltyFormat(5)}
                  style={styles.radioControl}
                />
                <span style={styles.formatLabel}>Compact Minimal Bilty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Select Loading Slip Format - 2 visual options (Screenshot 2 & 3) */}
        <div style={{ ...styles.templatesSection, marginTop: '32px' }}>
          <h3 style={styles.sectionTitle}>Select Loading Slip Format :</h3>
          
          <div style={styles.formatGridDual}>
            {/* Loading Format 1 */}
            <div 
              style={{
                ...styles.formatCard,
                ...(selectedLoadingFormat === 1 ? styles.formatCardActive : {})
              }}
              onClick={() => setSelectedLoadingFormat(1)}
            >
              <div style={styles.formatPreview}>
                <svg viewBox="0 0 160 220" style={styles.formatSvg}>
                  <rect x="5" y="5" width="150" height="210" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
                  <text x="80" y="24" fill="#ef4444" font-size="8" text-anchor="middle" font-weight="bold">LOAD ADVICE / LOADING SLIP</text>
                  <text x="80" y="34" fill="#1e293b" font-size="7" text-anchor="middle" font-weight="bold">SHREE PAVAN ROADLINES</text>
                  <line x1="15" y1="42" x2="145" y2="42" stroke="#e2e8f0" stroke-width="1"/>
                  <rect x="15" y="48" width="130" height="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
                  <line x1="15" y1="68" x2="145" y2="68" stroke="#cbd5e1" stroke-width="1"/>
                  <circle cx="120" cy="180" r="14" fill="#ef4444" fill-opacity="0.05" stroke="#ef4444" stroke-width="1" stroke-dasharray="2 2"/>
                </svg>
              </div>
              <div style={styles.formatSelectRow}>
                <input 
                  type="radio" 
                  name="loadingFormat" 
                  checked={selectedLoadingFormat === 1}
                  onChange={() => setSelectedLoadingFormat(1)}
                  style={styles.radioControl}
                />
                <span style={styles.formatLabel}>Pavan Standard Slip</span>
              </div>
            </div>

            {/* Loading Format 2 */}
            <div 
              style={{
                ...styles.formatCard,
                ...(selectedLoadingFormat === 2 ? styles.formatCardActive : {})
              }}
              onClick={() => setSelectedLoadingFormat(2)}
            >
              <div style={styles.formatPreview}>
                <svg viewBox="0 0 160 220" style={styles.formatSvg}>
                  <rect x="5" y="5" width="150" height="210" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
                  <text x="80" y="24" fill="#0066cc" font-size="8" text-anchor="middle" font-weight="bold">LOADING SLIP</text>
                  <text x="80" y="34" fill="#1e293b" font-size="7" text-anchor="middle" font-weight="bold">ROADWE VENTURES PVT. LTD.</text>
                  <line x1="15" y1="42" x2="145" y2="42" stroke="#e2e8f0" stroke-width="1"/>
                  <rect x="15" y="48" width="60" height="30" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5"/>
                  <rect x="85" y="48" width="60" height="30" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5"/>
                  <rect x="105" y="165" width="40" height="25" fill="#f0fdf4" stroke="#16a34a" stroke-width="1"/>
                  <text x="125" y="180" fill="#16a34a" font-size="5" text-anchor="middle" font-weight="bold">APPROVED</text>
                </svg>
              </div>
              <div style={styles.formatSelectRow}>
                <input 
                  type="radio" 
                  name="loadingFormat" 
                  checked={selectedLoadingFormat === 2}
                  onChange={() => setSelectedLoadingFormat(2)}
                  style={styles.radioControl}
                />
                <span style={styles.formatLabel}>Roadwe Corporate Slip</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Select Loading Slip Background Color (Screenshot 3) */}
        <div style={{ ...styles.swatchesContainer, marginTop: '32px' }}>
          <div style={styles.swatchRow}>
            <span style={styles.swatchTitle}>Select Loading Slip Background Color :</span>
            <div style={styles.swatchesWrapper}>
              {backgroundSwatches.map((item) => (
                <label key={item.value} style={styles.swatchItem}>
                  <input 
                    type="radio" 
                    name="loadingBgRadio" 
                    checked={loadingBgColor === item.value}
                    onChange={() => setLoadingBgColor(item.value)}
                    style={styles.radioInputHidden}
                  />
                  <div style={{
                    ...styles.swatchCircle,
                    backgroundColor: item.value,
                    border: loadingBgColor === item.value ? '2px solid #0066cc' : '1px solid #cbd5e1',
                    transform: loadingBgColor === item.value ? 'scale(1.15)' : 'scale(1)'
                  }}>
                    {loadingBgColor === item.value && <div style={styles.swatchSelectedDot} />}
                  </div>
                  <span style={styles.swatchNameLabel}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Row 6: Select Voucher Background Color (Screenshot 3) */}
        <div style={{ ...styles.swatchesContainer, marginTop: '16px' }}>
          <div style={styles.swatchRow}>
            <span style={styles.swatchTitle}>Select Voucher Background Color :</span>
            <div style={styles.swatchesWrapper}>
              {backgroundSwatches.map((item) => (
                <label key={item.value} style={styles.swatchItem}>
                  <input 
                    type="radio" 
                    name="voucherBgRadio" 
                    checked={voucherBgColor === item.value}
                    onChange={() => setVoucherBgColor(item.value)}
                    style={styles.radioInputHidden}
                  />
                  <div style={{
                    ...styles.swatchCircle,
                    backgroundColor: item.value,
                    border: voucherBgColor === item.value ? '2px solid #0066cc' : '1px solid #cbd5e1',
                    transform: voucherBgColor === item.value ? 'scale(1.15)' : 'scale(1)'
                  }}>
                    {voucherBgColor === item.value && <div style={styles.swatchSelectedDot} />}
                  </div>
                  <span style={styles.swatchNameLabel}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Row 7: Document Minimum Digits configured in a 4-column row (Screenshot 3) */}
        <div style={styles.minDigitsSection}>
          <div style={styles.minDigitsGrid}>
            
            <div className="form-group">
              <label style={styles.minDigitsLabel}>Minimum Digits in Bilty No. :</label>
              <select 
                className="form-control" 
                value={biltyMinDigits}
                onChange={(e) => setBiltyMinDigits(e.target.value)}
                style={styles.selectDigitsControl}
              >
                <option value="Select Minimum Digits">Select Minimum Digits</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            <div className="form-group">
              <label style={styles.minDigitsLabel}>Minimum Digits in Loading Slip No. :</label>
              <select 
                className="form-control" 
                value={loadingMinDigits}
                onChange={(e) => setLoadingMinDigits(e.target.value)}
                style={styles.selectDigitsControl}
              >
                <option value="Select Minimum Digits">Select Minimum Digits</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            <div className="form-group">
              <label style={styles.minDigitsLabel}>Minimum Digits in Invoice No. :</label>
              <select 
                className="form-control" 
                value={invoiceMinDigits}
                onChange={(e) => setInvoiceMinDigits(e.target.value)}
                style={styles.selectDigitsControl}
              >
                <option value="Select Minimum Digits">Select Minimum Digits</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            <div className="form-group">
              <label style={styles.minDigitsLabel}>Minimum Digits in Chalan No. :</label>
              <select 
                className="form-control" 
                value={chalanMinDigits}
                onChange={(e) => setChalanMinDigits(e.target.value)}
                style={styles.selectDigitsControl}
              >
                <option value="Select Minimum Digits">Select Minimum Digits</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

          </div>
        </div>

        {/* Update Setting green centered button */}
        <div style={styles.updateButtonContainer}>
          <button onClick={handleSaveSettings} style={styles.updateSettingBtn}>
            Update Setting
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
  pageTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#0f172a'
  },
  card: {
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
  },
  brandingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '24px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  brandingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    position: 'relative'
  },
  circularWrapper: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '2px dashed #cbd5e1', // Dashed circular uploaders matching Screenshot 1
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  brandingImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '8px'
  },
  placeholderLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#94a3b8'
  },
  hiddenInput: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  },
  circularOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer'
  },
  brandingTitle: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  deleteLogoBtn: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '4px 10px',
    cursor: 'pointer',
    marginTop: '4px',
    boxShadow: '0 1px 3px rgba(239, 68, 68, 0.2)'
  },
  controlsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1
  },
  sectionLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '6px',
    display: 'block'
  },
  colorPickerWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  colorLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155'
  },
  colorBox: {
    border: '1px solid #cbd5e1',
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#000000',
    padding: 0
  },
  selectOrderingControl: {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#ffffff',
    width: '220px',
    outline: 'none',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // 4 column layout matching Screenshot 1
    gap: '20px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '24px',
    marginBottom: '24px'
  },
  inputBox: {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#ffffff',
    outline: 'none'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '4px'
  },
  checkLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
    userSelect: 'none'
  },
  chk: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  chkSmall: {
    width: '13px',
    height: '13px',
    cursor: 'pointer'
  },
  showPassLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748b',
    marginTop: '6px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  formSelect: {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#ffffff',
    outline: 'none',
    cursor: 'pointer'
  },
  templatesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  formatGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)', // 5 Bilty formats matching Screenshot 1 & 2
    gap: '16px'
  },
  formatGridDual: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 Loading formats
    gap: '24px',
    maxWidth: '480px'
  },
  formatCard: {
    background: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
  },
  formatCardActive: {
    borderColor: '#0066cc',
    background: '#eff6ff',
    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.06)'
  },
  formatPreview: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formatSvg: {
    width: '120px',
    height: '165px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
  },
  formatPreviewImage: {
    width: '120px',
    height: '165px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderRadius: '6px',
    objectFit: 'contain',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease'
  },
  formatSelectRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100%',
    justifyContent: 'center'
  },
  radioControl: {
    cursor: 'pointer',
    width: '14px',
    height: '14px'
  },
  formatLabel: {
    fontSize: '0.725rem',
    fontWeight: '700',
    color: '#334155'
  },
  swatchesContainer: {
    background: '#eef2ff', // Light lavender card frame matching Screenshot 3
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '12px 20px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
  },
  swatchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  swatchTitle: {
    fontSize: '0.825rem',
    fontWeight: '800',
    color: '#1e293b'
  },
  swatchesWrapper: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  swatchItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  radioInputHidden: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0
  },
  swatchCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.15s ease',
    position: 'relative'
  },
  swatchSelectedDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#0066cc'
  },
  swatchNameLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569'
  },
  minDigitsSection: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0'
  },
  minDigitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns grid matching Screenshot 3
    gap: '20px'
  },
  minDigitsLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '6px',
    display: 'block'
  },
  selectDigitsControl: {
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
  updateButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '36px'
  },
  updateSettingBtn: {
    backgroundColor: '#00b050', // Premium bright green Update Settings button matching screenshots
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '700',
    padding: '12px 60px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 176, 80, 0.2)',
    transition: 'all 0.15s ease',
    outline: 'none'
  }
};
