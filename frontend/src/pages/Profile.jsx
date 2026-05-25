import React, { useState } from 'react';
import { Shield, Home, Trash2, Plus, X, Upload } from 'lucide-react';

export default function Profile({ logoImg, setLogoImg }) {
  // 1. Prefilled settings states - matching Screenshot 1 & 2
  const [transporterName, setTransporterName] = useState('TRANSCORE LOGISTICS');
  const [aboutName, setAboutName] = useState('LOGISTICS & SERVICE PROVIDER');
  const [riskType, setRiskType] = useState("AT OWNER'S RISK"); // "AT OWNER'S RISK" or "AT CARRIER'S RISK"
  const [userType, setUserType] = useState('Fleet Owner/Transport Contractor/Commission Agent');

  const [registrationNo, setRegistrationNo] = useState('GJ-24-0129196');
  const [gstNo, setGstNo] = useState('24CTSPG1070M1ZF');

  // Daily Service location tags input
  const [serviceTags, setServiceTags] = useState(['All Over India']);
  const [newTagInput, setNewTagInput] = useState('');

  const [city, setCity] = useState('Vadodara');
  const [state, setState] = useState('Gujarat');
  const [address, setAddress] = useState('REGD. OFF. PLOT NO.16 SIKOTARDHAM SOC');
  const [contact1, setContact1] = useState('9864874523');
  const [contact2, setContact2] = useState('');
  const [contact3, setContact3] = useState('');
  const [email, setEmail] = useState('admin@transcorelogistics.in');
  const [officeBranch, setOfficeBranch] = useState('F-403 Village Dashrath FertilizerNagar Vadod');
  const [website, setWebsite] = useState('Www.transcorelogistics.in');

  const [bankAccNumber, setBankAccNumber] = useState('50200108804813');
  const [bankName, setBankName] = useState('HDFC BANK');
  const [ifscCode, setIfscCode] = useState('HDFC0008785');

  const [panNumber, setPanNumber] = useState('CTSPG1070M');
  const [panCardName, setPanCardName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('TRANSCORE LOGISTICS');

  // Signature states
  const [signatureType, setSignatureType] = useState('FILE UPLOAD'); // 'SIGNATURE PAD' or 'FILE UPLOAD'
  const [stagedSigFile, setStagedSigFile] = useState(null);

  // Logo handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImg(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = () => {
    setLogoImg(null);
  };

  // Add Service Tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (newTagInput.trim() && !serviceTags.includes(newTagInput.trim())) {
        setServiceTags([...serviceTags, newTagInput.trim()]);
        setNewTagInput('');
      }
    }
  };

  // Delete Service Tag
  const handleRemoveTag = (tagToDelete) => {
    setServiceTags(serviceTags.filter(tag => tag !== tagToDelete));
  };

  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    alert('🎉 Profile settings updated successfully on MERN servers!');
  };

  return (
    <div style={styles.container}>
      
      {/* Breadcrumbs - Outlined Home icon inside the breadcrumb rows */}
      <div style={styles.breadcrumbs}>
        <span style={styles.breadcrumbItem}>
          <Home size={14} style={{ marginRight: '4px' }} /> Home
        </span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>Edit Profile</span>
      </div>

      <h2 style={styles.pageTitle}>Edit Profile</h2>

      <div style={styles.card}>
        <form onSubmit={handleUpdateProfileSubmit} style={styles.form}>
          
          {/* Top Row: Transporter Details + Logo slot */}
          <div style={styles.topBrandingFlex}>
            
            {/* Form Name Inputs */}
            <div style={styles.textInputsColumn}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={styles.formLabel}>Transporter Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" className="form-control" 
                  value={transporterName} onChange={(e) => setTransporterName(e.target.value)}
                  required
                  style={styles.formInput}
                />
              </div>

              <div className="form-group">
                <label style={styles.formLabel}>About Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" className="form-control" 
                  value={aboutName} onChange={(e) => setAboutName(e.target.value)}
                  required
                  style={styles.formInput}
                />
              </div>
            </div>

            {/* Logo Circular slot */}
            <div style={styles.logoBrandingBox}>
              <div style={styles.circularLogoWrapper}>
                {logoImg ? (
                  <img src={logoImg} alt="Logo preview" style={styles.logoImgStyles} />
                ) : (
                  <div style={styles.placeholderLogoText}>Choose File</div>
                )}
                <input 
                  type="file" 
                  id="profileLogoSelector" 
                  onChange={handleLogoUpload}
                  style={styles.hiddenInput} 
                />
                <label htmlFor="profileLogoSelector" style={styles.overlayLabel}></label>
              </div>
              <span style={styles.logoCaption}>Logo</span>
              {logoImg && (
                <button type="button" onClick={handleDeleteLogo} style={styles.deleteLogoBtn}>
                  Delete Logo
                </button>
              )}
            </div>

          </div>

          {/* Form Choices row: Risk Type and User Type */}
          <div style={styles.choicesRow}>
            {/* Risk Type Radio Buttons */}
            <div className="form-group">
              <label style={styles.formLabel}>Risk Type <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="riskTypeRadio" 
                    value="AT OWNER'S RISK" 
                    checked={riskType === "AT OWNER'S RISK"}
                    onChange={() => setRiskType("AT OWNER'S RISK")}
                    style={styles.radioInput}
                  />
                  AT OWNER'S RISK
                </label>
                <label style={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="riskTypeRadio" 
                    value="AT CARRIER'S RISK" 
                    checked={riskType === "AT CARRIER'S RISK"}
                    onChange={() => setRiskType("AT CARRIER'S RISK")}
                    style={styles.radioInput}
                  />
                  AT CARRIER'S RISK
                </label>
              </div>
            </div>

            {/* User Type Radio Buttons */}
            <div className="form-group">
              <label style={styles.formLabel}>User Type <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="userTypeRadio" 
                    value="Fleet Owner/Transport Contractor/Commission Agent" 
                    checked={userType === 'Fleet Owner/Transport Contractor/Commission Agent'}
                    onChange={() => setUserType('Fleet Owner/Transport Contractor/Commission Agent')}
                    style={styles.radioInput}
                  />
                  Fleet Owner/Transport Contractor/Commission Agent
                </label>
                <label style={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="userTypeRadio" 
                    value="Transport Contractor/Commission Agent/Broker" 
                    checked={userType === 'Transport Contractor/Commission Agent/Broker'}
                    onChange={() => setUserType('Transport Contractor/Commission Agent/Broker')}
                    style={styles.radioInput}
                  />
                  Transport Contractor/Commission Agent/Broker
                </label>
              </div>
            </div>
          </div>

          {/* Form Grid Row 3: Registrations & Daily Service tag pill selectors */}
          <div style={styles.threeColumnGrid}>
            <div className="form-group">
              <label style={styles.formLabel}>Registration Number</label>
              <input 
                type="text" className="form-control" 
                value={registrationNo} onChange={(e) => setRegistrationNo(e.target.value)}
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>GST Number</label>
              <input 
                type="text" className="form-control" 
                value={gstNo} onChange={(e) => setGstNo(e.target.value)}
                style={styles.formInput}
              />
            </div>

            {/* Tags Pills Input */}
            <div className="form-group">
              <label style={styles.formLabel}>Daily Service <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={styles.tagsContainer}>
                {serviceTags.map(tag => (
                  <span key={tag} style={styles.tagPill}>
                    {tag}
                    <X size={10} style={{ marginLeft: '4px', cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)} />
                  </span>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '6px' }}>
                  <input 
                    type="text" 
                    placeholder="Press enter to add location..." 
                    value={newTagInput} 
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    style={styles.tagInputText}
                  />
                  <button type="button" onClick={handleAddTag} style={styles.tagAddBtn}>
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Grid Row 4: Location selectors */}
          <div style={styles.fourColumnGrid}>
            <div className="form-group">
              <label style={styles.formLabel}>City <span style={{ color: '#ef4444' }}>*</span></label>
              <input 
                type="text" className="form-control" 
                value={city} onChange={(e) => setCity(e.target.value)}
                required
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>State <span style={{ color: '#ef4444' }}>*</span></label>
              <input 
                type="text" className="form-control" 
                value={state} onChange={(e) => setState(e.target.value)}
                required
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>Address <span style={{ color: '#ef4444' }}>*</span></label>
              <input 
                type="text" className="form-control" 
                value={address} onChange={(e) => setAddress(e.target.value)}
                required
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>Contact No. 1 <span style={{ color: '#ef4444' }}>*</span></label>
              <input 
                type="text" className="form-control" 
                value={contact1} onChange={(e) => setContact1(e.target.value)}
                required
                style={styles.formInput}
              />
            </div>
          </div>

          {/* Form Grid Row 5: Additional contacts + branch */}
          <div style={styles.fourColumnGrid}>
            <div className="form-group">
              <label style={styles.formLabel}>Contact No. 2</label>
              <input 
                type="text" className="form-control" 
                placeholder="Contact No. 2"
                value={contact2} onChange={(e) => setContact2(e.target.value)}
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>Contact No. 3</label>
              <input 
                type="text" className="form-control" 
                placeholder="Contact No. 3"
                value={contact3} onChange={(e) => setContact3(e.target.value)}
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>Email <span style={{ color: '#ef4444' }}>*</span></label>
              <input 
                type="email" className="form-control" 
                value={email} onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>Office Branch</label>
              <input 
                type="text" className="form-control" 
                value={officeBranch} onChange={(e) => setOfficeBranch(e.target.value)}
                style={styles.formInput}
              />
            </div>
          </div>

          {/* Form Grid Row 6: Online Coordinates + Bank Accounts */}
          <div style={styles.fourColumnGrid}>
            <div className="form-group">
              <label style={styles.formLabel}>Website</label>
              <input 
                type="text" className="form-control" 
                value={website} onChange={(e) => setWebsite(e.target.value)}
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>Bank Account Number</label>
              <input 
                type="text" className="form-control" 
                value={bankAccNumber} onChange={(e) => setBankAccNumber(e.target.value)}
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>Bank Name</label>
              <input 
                type="text" className="form-control" 
                value={bankName} onChange={(e) => setBankName(e.target.value)}
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>IFSC Code</label>
              <input 
                type="text" className="form-control" 
                value={ifscCode} onChange={(e) => setIfscCode(e.target.value)}
                style={styles.formInput}
              />
            </div>
          </div>

          {/* Form Grid Row 7: TAX and Holder identifications */}
          <div style={styles.threeColumnGrid}>
            <div className="form-group">
              <label style={styles.formLabel}>Pan Number</label>
              <input 
                type="text" className="form-control" 
                value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>Pan Card Name</label>
              <input 
                type="text" className="form-control" 
                placeholder="Pan Card Name"
                value={panCardName} onChange={(e) => setPanCardName(e.target.value)}
                style={styles.formInput}
              />
            </div>

            <div className="form-group">
              <label style={styles.formLabel}>Account Holder Name</label>
              <input 
                type="text" className="form-control" 
                value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)}
                style={styles.formInput}
              />
            </div>
          </div>

          {/* Row 8: Update Signature Toggles */}
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label style={styles.formLabel}>Update Signature Using <span style={{ color: '#ef4444' }}>*</span></label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="sigTypeRadio" 
                  value="SIGNATURE PAD" 
                  checked={signatureType === 'SIGNATURE PAD'}
                  onChange={() => setSignatureType('SIGNATURE PAD')}
                  style={styles.radioInput}
                />
                SIGNATURE PAD
              </label>
              <label style={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="sigTypeRadio" 
                  value="FILE UPLOAD" 
                  checked={signatureType === 'FILE UPLOAD'}
                  onChange={() => setSignatureType('FILE UPLOAD')}
                  style={styles.radioInput}
                />
                FILE UPLOAD
              </label>
            </div>
          </div>

          {/* Row 9: E-signature files slot & rubber stamp vector preview (Screenshot 2) */}
          <div style={styles.signatureDisplayFlex}>
            
            {/* Signature File Uploader */}
            {signatureType === 'FILE UPLOAD' ? (
              <div className="form-group" style={{ flex: 1, maxWidth: '400px' }}>
                <label style={styles.formLabel}>Signature File <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={styles.fileInputWrapper}>
                  <input 
                    type="file" 
                    id="profileSigFile"
                    onChange={(e) => setStagedSigFile(e.target.files[0]?.name || null)}
                    style={styles.hiddenInput}
                  />
                  <label htmlFor="profileSigFile" style={styles.fileBtn}>
                    <Upload size={14} style={{ marginRight: '6px' }} /> Choose File
                  </label>
                  <span style={styles.fileName}>{stagedSigFile || 'No file chosen'}</span>
                </div>
              </div>
            ) : (
              <div className="form-group" style={{ flex: 1, maxWidth: '400px' }}>
                <label style={styles.formLabel}>Interactive Signature Canvas <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={styles.signaturePadBox}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Signature Pad Active (Mouse / Stylus draws here)</span>
                </div>
              </div>
            )}

            {/* Previous E-Signature circular vector rubber stamp */}
            <div style={styles.rubberStampBox}>
              <span style={styles.formLabel}>Previous E-Signature:</span>
              <div style={styles.stampOuterFrame}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" style={styles.stampSvgStyle}>
                  <ellipse cx="100" cy="60" rx="90" ry="50" fill="none" stroke="#1d3557" stroke-width="2.5" stroke-dasharray="6 3"/>
                  <ellipse cx="100" cy="60" rx="84" ry="44" fill="none" stroke="#1d3557" stroke-width="1.25"/>
                  <text x="100" y="32" font-family="'Outfit', sans-serif" font-weight="900" font-size="10.5" fill="#1d3557" text-anchor="middle" letter-spacing="0.03em">TRANSCORE LOGISTICS</text>
                  <text x="100" y="98" font-family="'Outfit', sans-serif" font-weight="900" font-size="9.5" fill="#1d3557" text-anchor="middle" letter-spacing="0.06em">VADODARA</text>
                  <path d="M45,65 Q80,25 100,55 T155,50 Q165,75 135,80" fill="none" stroke="#1d3557" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <text x="35" y="64" font-family="sans-serif" font-size="10" fill="#1d3557" text-anchor="middle">★</text>
                  <text x="165" y="64" font-family="sans-serif" font-size="10" fill="#1d3557" text-anchor="middle">★</text>
                </svg>
              </div>
            </div>

          </div>

          {/* Update Profile button centered at the bottom */}
          <div style={styles.updateButtonContainer}>
            <button type="submit" style={styles.updateProfileBtn}>
              Update Profile
            </button>
          </div>

        </form>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  topBrandingFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '30px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '20px'
  },
  textInputsColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '280px'
  },
  formLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '6px',
    display: 'block'
  },
  formInput: {
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
  logoBrandingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    position: 'relative'
  },
  circularLogoWrapper: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '1px solid #cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  logoImgStyles: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '10px'
  },
  placeholderLogoText: {
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
    cursor: 'pointer',
    zIndex: 5
  },
  overlayLabel: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    zIndex: 2
  },
  logoCaption: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase'
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
    marginTop: '2px',
    boxShadow: '0 1px 3px rgba(239, 68, 68, 0.2)'
  },
  choicesRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '20px'
  },
  radioGroup: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    marginTop: '6px'
  },
  radioLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
    userSelect: 'none'
  },
  radioInput: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  threeColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
  },
  fourColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '8px 12px',
    minHeight: '40px',
    backgroundColor: '#ffffff',
    alignItems: 'center'
  },
  tagPill: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    color: '#0066cc',
    border: '1px solid #bfdbfe',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    fontWeight: '700'
  },
  tagInputText: {
    border: 'none',
    outline: 'none',
    fontSize: '0.75rem',
    color: '#334155',
    flex: 1,
    minWidth: '120px'
  },
  tagAddBtn: {
    background: '#0066cc',
    color: '#ffffff',
    border: 'none',
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0
  },
  signatureDisplayFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '30px',
    marginTop: '10px',
    flexWrap: 'wrap'
  },
  fileInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'relative',
    marginTop: '6px'
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
    maxWidth: '220px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: '500'
  },
  signaturePadBox: {
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    marginTop: '6px'
  },
  rubberStampBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  stampOuterFrame: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
  },
  stampSvgStyle: {
    width: '180px',
    height: '110px'
  },
  updateButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px'
  },
  updateProfileBtn: {
    backgroundColor: '#00b050', // Premium bright green action button matching screenshots
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
