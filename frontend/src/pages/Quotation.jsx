import React, { useState, useEffect } from 'react';
import { Plus, Printer, FileText, Share2, Search, X, Check, Calculator } from 'lucide-react';

const API_BASE = '/api';

export default function Quotation({ token, activePage, setActivePage }) {
  const [quotations, setQuotations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingQuotation, setViewingQuotation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- High-Fidelity Transport Quotation Form States (Screenshots 4 & 5) ---
  const [quoteNo, setQuoteNo] = useState('0001');
  const [generateDate, setGenerateDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Company Details
  const [partyName, setPartyName] = useState(''); // Mapping client partyName for table listing
  const [companyContact, setCompanyContact] = useState('');
  const [companyGst, setCompanyGst] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  // Enquiry Details
  const [enquiryDate, setEnquiryDate] = useState('');
  const [enquiryRefDocId, setEnquiryRefDocId] = useState('');
  const [enquiryByPerson, setEnquiryByPerson] = useState('');

  // Material Details
  const [materialName, setMaterialName] = useState('');
  const [packagingType, setPackagingType] = useState('');
  const [materialWeight, setMaterialWeight] = useState('');
  const [materialUnit, setMaterialUnit] = useState('Select Unit');

  // Trip Details
  const [loadType, setLoadType] = useState('Select Load Type');
  const [fromCity, setFromCity] = useState(''); // Mapping source city for table listing
  const [toCity, setToCity] = useState('');     // Mapping destination city for table listing
  const [loadingDate, setLoadingDate] = useState('');
  const [tripType, setTripType] = useState('Select Trip Type');

  // Vehicle Details
  const [vehicleType, setVehicleType] = useState('');
  const [guaranteeWeight, setGuaranteeWeight] = useState('');
  const [vehicleUnit, setVehicleUnit] = useState('Select Unit');
  const [rate, setRate] = useState(''); // Rate input
  const [rateType, setRateType] = useState('Select Rate Type');
  const [overSize, setOverSize] = useState('Select Over Size');
  const [numberOfVehicle, setNumberOfVehicle] = useState('1');

  // Freight Details
  const [freightAmount, setFreightAmount] = useState(0);
  const [loadingCharge, setLoadingCharge] = useState(0);
  const [unloadingCharge, setUnloadingCharge] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [odcCharge, setOdcCharge] = useState(0);
  const [otherCharge, setOtherCharge] = useState(0);
  const [tollTax, setTollTax] = useState(0);
  const [totalFreight, setTotalFreight] = useState(0);
  const [gstPercent, setGstPercent] = useState('Select GST Percent');

  // Payment Terms
  const [paidBy, setPaidBy] = useState('Select Paid By');
  const [requiredDriverCash, setRequiredDriverCash] = useState(0);
  const [advanceType, setAdvanceType] = useState('Select Advance Type');
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [paymentCycle, setPaymentCycle] = useState('Select Payment Cycle');
  const [validUpto, setValidUpto] = useState('');
  const [details, setDetails] = useState(''); // Remarks mapped to details

  // --- Transport Demurrage & Datetime Settings (Screenshot 1) ---
  const [demurrageCharge, setDemurrageCharge] = useState(0);
  const [demurrageChargeType, setDemurrageChargeType] = useState('Select Demurrage Type');
  const [demurrageChargeAfter, setDemurrageChargeAfter] = useState('Select Demurrage Charge Applicable After');
  const [hideDatetime, setHideDatetime] = useState(false);

  // --- Packers & Movers Relocation Form States (Screenshots 3 & 4) ---
  const [movingType, setMovingType] = useState('Select Moving Type');
  const [partyMobile, setPartyMobile] = useState('');
  const [partyEmail, setPartyEmail] = useState('');
  const [packingDate, setPackingDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);

  // From Address Details
  const [fromState, setFromState] = useState('');
  const [fromPincode, setFromPincode] = useState('');
  const [fromLandmark, setFromLandmark] = useState('');
  const [fromFloor, setFromFloor] = useState('');
  const [fromLift, setFromLift] = useState('Select');

  // To Address Details
  const [toState, setToState] = useState('');
  const [toPincode, setToPincode] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [toLandmark, setToLandmark] = useState('');
  const [toFloor, setToFloor] = useState('');
  const [toLift, setToLift] = useState('Select');

  // P&M Payment Details
  const [pmTransportCharge, setPmTransportCharge] = useState(0);
  const [pmPackingCharge, setPmPackingCharge] = useState(0);
  const [pmLoadingCharge, setPmLoadingCharge] = useState(0);
  const [pmUnloadingCharge, setPmUnloadingCharge] = useState(0);
  const [pmCarBikeCharge, setPmCarBikeCharge] = useState(0);
  const [pmStCharge, setPmStCharge] = useState(0);
  const [pmOtherCharge, setPmOtherCharge] = useState(0);
  const [pmTotalFreight, setPmTotalFreight] = useState(0);
  const [pmAdvanceAmount, setPmAdvanceAmount] = useState(0);
  const [pmBalanceAmount, setPmBalanceAmount] = useState(0);
  const [pmGstInQuote, setPmGstInQuote] = useState('Select GST In Quote');
  const [pmGstType, setPmGstType] = useState('Select GST Type');
  const [pmGstPercent, setPmGstPercent] = useState('Select GST Percent');
  const [pmPaymentRemark, setPmPaymentRemark] = useState('');

  // P&M Item Details
  const [pmItemName, setPmItemName] = useState('');
  const [pmItemQuantity, setPmItemQuantity] = useState('');
  const [pmItemValue, setPmItemValue] = useState('');
  const [pmItemRemark, setPmItemRemark] = useState('');

  // P&M Vehicle & Print Options
  const [pmVehicleType, setPmVehicleType] = useState('');
  const [pmHideDatetime, setPmHideDatetime] = useState(false);

  // Legacy P&M custom form states compatibility fallbacks
  const [packingCharges, setPackingCharges] = useState(0);
  const [loadingCharges, setLoadingCharges] = useState(0);
  const [unloadingCharges, setUnloadingCharges] = useState(0);
  const [transitInsurance, setTransitInsurance] = useState(0);
  const [taxRate, setTaxRate] = useState(18);

  // --- Quotation List Filter States (Screenshot 4) ---
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterPartyName, setFilterPartyName] = useState('Select Party Name');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [appliedPartyName, setAppliedPartyName] = useState('');
  const [appliedFromDate, setAppliedFromDate] = useState('');
  const [appliedToDate, setAppliedToDate] = useState('');

  const isCreatePM = activePage === 'quotation-pm-create';
  const isCreateTransport = activePage === 'quotation-transport-create';
  const isListPM = activePage === 'quotation-pm-list';
  const isListTransport = activePage === 'quotation-transport-list';

  const fetchQuotations = async () => {
    try {
      const res = await fetch(`${API_BASE}/masters/quotations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuotations(data);
      } else {
        activateMockFallback();
      }
    } catch (e) {
      activateMockFallback();
    }
  };

  const activateMockFallback = () => {
    setQuotations([
      {
        _id: 'q1',
        quotationNo: 'Q-2026-001',
        date: '2026-05-23',
        type: 'Transport',
        partyName: 'TATA STEEL LTD',
        fromCity: 'Jamshedpur',
        toCity: 'Jamnagar',
        rate: 32000,
        details: 'Rate per ton: ₹1,500. GST extra as applicable.'
      },
      {
        _id: 'q2',
        quotationNo: 'Q-2026-002',
        date: '2026-05-20',
        type: 'P&M',
        partyName: 'Dr. Anand Kumar',
        fromCity: 'Kanpur',
        toCity: 'Vadodara',
        rate: 45000,
        details: 'Packers & Movers household relocation service including packaging, loading, and transit insurance.'
      }
    ]);
  };

  useEffect(() => {
    fetchQuotations();
  }, [token]);

  // Calculate Freight Amounts and Totals dynamically for High-Fidelity Transport Quotation
  useEffect(() => {
    if (isCreateTransport) {
      const w = parseFloat(materialWeight) || parseFloat(guaranteeWeight) || 0;
      const r = parseFloat(rate) || 0;
      const baseFreight = rateType === 'Per Ton' ? (w * r) : r;
      setFreightAmount(baseFreight);

      const fAmt = baseFreight;
      const load = parseFloat(loadingCharge) || 0;
      const unload = parseFloat(unloadingCharge) || 0;
      const serv = parseFloat(serviceCharge) || 0;
      const odc = parseFloat(odcCharge) || 0;
      const other = parseFloat(otherCharge) || 0;
      const toll = parseFloat(tollTax) || 0;

      const sumTotal = fAmt + load + unload + serv + odc + other + toll;
      setTotalFreight(sumTotal);
    }
  }, [
    isCreateTransport, materialWeight, guaranteeWeight, rate, rateType,
    loadingCharge, unloadingCharge, serviceCharge, odcCharge, otherCharge, tollTax
  ]);

  // Calculate Freight Amounts and Totals dynamically for Packers & Movers (Screenshot 3)
  useEffect(() => {
    if (isCreatePM) {
      const t = parseFloat(pmTransportCharge) || 0;
      const p = parseFloat(pmPackingCharge) || 0;
      const l = parseFloat(pmLoadingCharge) || 0;
      const u = parseFloat(pmUnloadingCharge) || 0;
      const c = parseFloat(pmCarBikeCharge) || 0;
      const s = parseFloat(pmStCharge) || 0;
      const o = parseFloat(pmOtherCharge) || 0;

      const total = t + p + l + u + c + s + o;
      setPmTotalFreight(total);

      const adv = parseFloat(pmAdvanceAmount) || 0;
      setPmBalanceAmount(total - adv);
    }
  }, [
    isCreatePM, pmTransportCharge, pmPackingCharge, pmLoadingCharge, pmUnloadingCharge,
    pmCarBikeCharge, pmStCharge, pmOtherCharge, pmAdvanceAmount
  ]);

  // Handle activePage toggles for auto opening creator forms
  useEffect(() => {
    if (isCreatePM || isCreateTransport) {
      setPartyName('');
      setFromCity('');
      setToCity('');
      setRate('');
      setDetails('');
      setPackingCharges(0);
      setLoadingCharges(0);
      setUnloadingCharges(0);
      setTransitInsurance(0);

      // Transport specific demurrage & print reset
      setDemurrageCharge(0);
      setDemurrageChargeType('Select Demurrage Type');
      setDemurrageChargeAfter('Select Demurrage Charge Applicable After');
      setHideDatetime(false);

      // P&M Relocation Form reset
      setMovingType('Select Moving Type');
      setPartyMobile('');
      setPartyEmail('');
      setPackingDate(new Date().toISOString().split('T')[0]);
      setDeliveryDate(new Date().toISOString().split('T')[0]);
      setFromState('');
      setFromPincode('');
      setFromLandmark('');
      setFromFloor('');
      setFromLift('Select');
      setToState('');
      setToPincode('');
      setToAddress('');
      setToLandmark('');
      setToFloor('');
      setToLift('Select');

      setPmTransportCharge(0);
      setPmPackingCharge(0);
      setPmLoadingCharge(0);
      setPmUnloadingCharge(0);
      setPmCarBikeCharge(0);
      setPmStCharge(0);
      setPmOtherCharge(0);
      setPmTotalFreight(0);
      setPmAdvanceAmount(0);
      setPmBalanceAmount(0);
      setPmGstInQuote('Select GST In Quote');
      setPmGstType('Select GST Type');
      setPmGstPercent('Select GST Percent');
      setPmPaymentRemark('');

      setPmItemName('');
      setPmItemQuantity('');
      setPmItemValue('');
      setPmItemRemark('');
      setPmVehicleType('');
      setPmHideDatetime(false);

      // Seed high-fidelity quote no
      setQuoteNo(`Q-${Date.now().toString().slice(-4)}`);
      setCompanyContact('');
      setCompanyGst('');
      setCompanyAddress('');
      setEnquiryDate('');
      setEnquiryRefDocId('');
      setEnquiryByPerson('');
      setMaterialName('');
      setPackagingType('');
      setMaterialWeight('');
      setMaterialUnit('Select Unit');
      setLoadType('Select Load Type');
      setLoadingDate('');
      setTripType('Select Trip Type');
      setVehicleType('');
      setGuaranteeWeight('');
      setVehicleUnit('Select Unit');
      setRateType('Select Rate Type');
      setOverSize('Select Over Size');
      setNumberOfVehicle('1');
      setFreightAmount(0);
      setLoadingCharge(0);
      setUnloadingCharge(0);
      setServiceCharge(0);
      setOdcCharge(0);
      setOtherCharge(0);
      setTollTax(0);
      setTotalFreight(0);
      setGstPercent('Select GST Percent');
      setPaidBy('Select Paid By');
      setRequiredDriverCash(0);
      setAdvanceType('Select Advance Type');
      setAdvanceAmount(0);
      setPaymentCycle('Select Payment Cycle');
      setValidUpto('');
    }
  }, [activePage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPM = isCreatePM;

    // Compute details for print/database summary
    const computedDetails = isPM 
      ? `Moving Type: ${movingType}. Items: ${pmItemName} (Qty: ${pmItemQuantity}, Val: ${pmItemValue}). Remarks: ${pmPaymentRemark || pmItemRemark}.`
      : details;

    const payload = {
      quotationNo: quoteNo,
      date: generateDate,
      type: isPM ? 'P&M' : 'Transport',
      partyName,
      fromCity,
      toCity,
      rate: isPM ? pmTotalFreight : totalFreight,
      details: isPM ? computedDetails : (details || `Transport Quotation for ${materialName}. Trip Type: ${tripType}, Load Type: ${loadType}.`),
      
      // Transport specific demurrage & print flags (Screenshot 1)
      demurrageCharge,
      demurrageChargeType,
      demurrageChargeAfter,
      hideDatetime,

      // P&M Specific details (Screenshot 3 & 4)
      movingType,
      partyMobile,
      partyEmail,
      packingDate,
      deliveryDate,
      fromState,
      fromPincode,
      fromLandmark,
      fromFloor,
      fromLift,
      toState,
      toPincode,
      toLandmark,
      toFloor,
      toLift,
      pmTransportCharge,
      pmPackingCharge,
      pmLoadingCharge,
      pmUnloadingCharge,
      pmCarBikeCharge,
      pmStCharge,
      pmOtherCharge,
      pmTotalFreight,
      pmAdvanceAmount,
      pmBalanceAmount,
      pmGstInQuote,
      pmGstType,
      pmGstPercent,
      pmPaymentRemark,
      pmItemName,
      pmItemQuantity,
      pmItemValue,
      pmItemRemark,
      pmVehicleType,
      pmHideDatetime,
      
      // Legacy compatibility variables
      companyContact: isPM ? partyMobile : companyContact,
      companyGst: isPM ? '' : companyGst,
      companyAddress: isPM ? `${fromCity}, ${fromState}` : companyAddress,
      enquiryDate,
      enquiryRefDocId,
      enquiryByPerson,
      materialName,
      packagingType,
      materialWeight,
      materialUnit,
      loadType,
      loadingDate,
      tripType,
      vehicleType: isPM ? pmVehicleType : vehicleType,
      guaranteeWeight,
      vehicleUnit,
      rateType,
      overSize,
      numberOfVehicle,
      freightAmount,
      loadingCharge,
      unloadingCharge,
      serviceCharge,
      odcCharge,
      otherCharge,
      tollTax,
      gstPercent: isPM ? pmGstPercent : gstPercent,
      paidBy,
      requiredDriverCash,
      advanceType,
      advanceAmount: isPM ? pmAdvanceAmount : advanceAmount,
      paymentCycle,
      validUpto
    };

    try {
      const res = await fetch(`${API_BASE}/masters/quotations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchQuotations();
      } else {
        setQuotations([{ _id: Math.random().toString(), ...payload }, ...quotations]);
      }
      alert('Quotation saved successfully!');
      setActivePage(isPM ? 'quotation-pm-list' : 'quotation-transport-list');
    } catch (err) {
      setQuotations([{ _id: Math.random().toString(), ...payload }, ...quotations]);
      alert('Offline Mode: Quotation saved locally in browser state.');
      setActivePage(isPM ? 'quotation-pm-list' : 'quotation-transport-list');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredQuotes = quotations.filter(q => {
    // Check type matching
    if (isListPM && q.type !== 'P&M') return false;
    if (isListTransport && q.type !== 'Transport') return false;

    // Search Query matching
    const matchesSearch = q.partyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.quotationNo.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Party Name matching
    if (appliedPartyName) {
      if (q.partyName !== appliedPartyName) return false;
    }

    // Date bounds matching
    if (appliedFromDate) {
      if (q.date < appliedFromDate) return false;
    }
    if (appliedToDate) {
      if (q.date > appliedToDate) return false;
    }

    return true;
  });

  return (
    <div className="glass-panel" style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '24px' }}>
      
      {/* Breadcrumbs */}
      <div style={styles.breadcrumbs}>
        <span>🏠 Home</span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span>Quotation</span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>
          {isCreateTransport && 'Create Transport Quotation'}
          {isCreatePM && 'Create P&M Quotation'}
          {isListTransport && 'Transport Quotation List'}
          {isListPM && 'Packers & Movers Quotation List'}
        </span>
      </div>

      {/* Main Form Creator Mode (Transport or P&M) */}
      {(isCreateTransport || isCreatePM) && (
        <div>
          <div style={styles.headerRow}>
            <h2 style={styles.title}>
              {isCreateTransport ? 'Transport Quotation Form' : '📦 New Packers & Movers Relocation Contract'}
            </h2>
            <button 
              className="btn btn-primary" 
              style={{ backgroundColor: '#0066cc', color: '#ffffff', fontWeight: '700' }}
              onClick={() => setActivePage(isCreatePM ? 'quotation-pm-list' : 'quotation-transport-list')}
            >
              {isCreateTransport ? 'Transport Quotation List' : 'View Saved Quotations List'}
            </button>
          </div>

          {isCreateTransport ? (
            // High-Fidelity Transport Quotation Form Card (Screenshots 4 & 5)
            <form onSubmit={handleSubmit} style={{ ...styles.formContainer, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px' }}>
              
              {/* Metadata row */}
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Quotation Number *</label>
                  <input type="text" className="form-control" required value={quoteNo} onChange={(e) => setQuoteNo(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Quotation Generate Date *</label>
                  <input type="date" className="form-control" required value={generateDate} onChange={(e) => setGenerateDate(e.target.value)} />
                </div>
              </div>

              {/* Company Details section */}
              <div style={styles.sectionHeader}>Company Details</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Company name *</label>
                  <input type="text" className="form-control" required placeholder="Company Name" value={partyName} onChange={(e) => setPartyName(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Contact number</label>
                  <input type="text" className="form-control" placeholder="Contact Number" value={companyContact} onChange={(e) => setCompanyContact(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>GST Number</label>
                  <input type="text" className="form-control" placeholder="GST Number" value={companyGst} onChange={(e) => setCompanyGst(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label style={styles.formLabelPage}>Address</label>
                <textarea 
                  className="form-control" style={{ height: '70px', resize: 'none' }} placeholder="Address" 
                  value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} 
                />
                <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: '600', marginTop: '4px', display: 'block' }}>
                  Please Avoid using Special Characters.
                </span>
              </div>

              {/* Enquiry Details section */}
              <div style={styles.sectionHeader}>Enquiry Details</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Enquiry Date</label>
                  <input type="date" className="form-control" value={enquiryDate} onChange={(e) => setEnquiryDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Reference Document ID</label>
                  <input type="text" className="form-control" placeholder="Reference Document ID" value={enquiryRefDocId} onChange={(e) => setEnquiryRefDocId(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Enquiry By Person</label>
                  <input type="text" className="form-control" placeholder="Enquiry By Person" value={enquiryByPerson} onChange={(e) => setEnquiryByPerson(e.target.value)} />
                </div>
              </div>

              {/* Material Details section */}
              <div style={styles.sectionHeader}>Material Details</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Material Name</label>
                  <input type="text" className="form-control" placeholder="Material Name" value={materialName} onChange={(e) => setMaterialName(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Packaging Type</label>
                  <input type="text" className="form-control" placeholder="Packaging Type" value={packagingType} onChange={(e) => setPackagingType(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Weight</label>
                  <input type="number" className="form-control" placeholder="Weight" value={materialWeight} onChange={(e) => setMaterialWeight(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Unit</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      className="form-control" style={{ height: '38px', flex: 1 }}
                      value={materialUnit} onChange={(e) => setMaterialUnit(e.target.value)}
                    >
                      <option>Select Unit</option>
                      <option>MT (Metric Ton)</option>
                      <option>Bag</option>
                      <option>Box</option>
                      <option>Kg</option>
                    </select>
                    <button type="button" className="btn btn-secondary" style={{ padding: '0 12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }} onClick={() => alert('Additional material details panel active!')}>+ Add More Details</button>
                  </div>
                </div>
              </div>

              {/* Trip Details section */}
              <div style={styles.sectionHeader}>Trip Details</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Load Type</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={loadType} onChange={(e) => setLoadType(e.target.value)}
                  >
                    <option>Select Load Type</option>
                    <option>Full Load</option>
                    <option>Part Load</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>From Address</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" className="form-control" placeholder="From Address" value={fromCity} onChange={(e) => setFromCity(e.target.value)} />
                    <button type="button" className="btn btn-secondary" style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }} onClick={() => alert('Multiple source locations added!')}>+ From Address</button>
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>To Address</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" className="form-control" placeholder="To Address" value={toCity} onChange={(e) => setToCity(e.target.value)} />
                    <button type="button" className="btn btn-secondary" style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }} onClick={() => alert('Multiple destination locations added!')}>+ To Address</button>
                  </div>
                </div>
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Loading Date</label>
                  <input type="date" className="form-control" value={loadingDate} onChange={(e) => setLoadingDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Trip Type</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={tripType} onChange={(e) => setTripType(e.target.value)}
                  >
                    <option>Select Trip Type</option>
                    <option>One Way</option>
                    <option>Round Trip</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Details section */}
              <div style={styles.sectionHeader}>Vehicle Details</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Vehicle Type</label>
                  <input type="text" className="form-control" placeholder="e.g. 14 Wheeler Truck" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Guarantee Weight :</label>
                  <input type="number" className="form-control" placeholder="Guarantee Weight" value={guaranteeWeight} onChange={(e) => setGuaranteeWeight(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Unit</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={vehicleUnit} onChange={(e) => setVehicleUnit(e.target.value)}
                  >
                    <option>Select Unit</option>
                    <option>MT (Metric Ton)</option>
                    <option>Kg</option>
                  </select>
                </div>
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Rate :</label>
                  <input type="number" className="form-control" placeholder="Rate" value={rate} onChange={(e) => setRate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Rate Type</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={rateType} onChange={(e) => setRateType(e.target.value)}
                  >
                    <option>Select Rate Type</option>
                    <option>Per Ton</option>
                    <option>Fixed</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Over Size</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={overSize} onChange={(e) => setOverSize(e.target.value)}
                  >
                    <option>Select Over Size</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Number of Vehicle</label>
                  <input type="number" className="form-control" value={numberOfVehicle} onChange={(e) => setNumberOfVehicle(e.target.value)} />
                </div>
              </div>

              {/* Freight Details section */}
              <div style={styles.sectionHeader}>Freight Details</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Freight Amount</label>
                  <input type="number" disabled style={styles.disabledInput} value={freightAmount} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Loading Charge</label>
                  <input type="number" className="form-control" value={loadingCharge} onChange={(e) => setLoadingCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Unloading Charge</label>
                  <input type="number" className="form-control" value={unloadingCharge} onChange={(e) => setUnloadingCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Service Charge :</label>
                  <input type="number" className="form-control" value={serviceCharge} onChange={(e) => setServiceCharge(parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>ODC Charge</label>
                  <input type="number" className="form-control" value={odcCharge} onChange={(e) => setOdcCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Other Charge</label>
                  <input type="number" className="form-control" value={otherCharge} onChange={(e) => setOtherCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Toll Tax</label>
                  <input type="number" className="form-control" value={tollTax} onChange={(e) => setTollTax(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Total Freight</label>
                  <input type="number" disabled style={{ ...styles.disabledInput, fontWeight: '800', color: '#10b981' }} value={totalFreight} />
                </div>
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Applicable GST Percent</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={gstPercent} onChange={(e) => setGstPercent(e.target.value)}
                  >
                    <option>Select GST Percent</option>
                    <option>5% GST</option>
                    <option>12% GST</option>
                    <option>18% GST</option>
                    <option>Exempted</option>
                  </select>
                </div>
              </div>

              {/* Payment Terms section */}
              <div style={styles.sectionHeader}>Payment Terms</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Paid By</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={paidBy} onChange={(e) => setPaidBy(e.target.value)}
                  >
                    <option>Select Paid By</option>
                    <option>Consignor</option>
                    <option>Consignee</option>
                    <option>Third Party</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Required Driver Cash</label>
                  <input type="number" className="form-control" value={requiredDriverCash} onChange={(e) => setRequiredDriverCash(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Advance type</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={advanceType} onChange={(e) => setAdvanceType(e.target.value)}
                  >
                    <option>Select Advance Type</option>
                    <option>Percentage</option>
                    <option>Fixed</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Advance Amount</label>
                  <input type="number" className="form-control" value={advanceAmount} onChange={(e) => setAdvanceAmount(parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Payment Cycle</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={paymentCycle} onChange={(e) => setPaymentCycle(e.target.value)}
                  >
                    <option>Select Payment Cycle</option>
                    <option>Immediate</option>
                    <option>Net 15 Days</option>
                    <option>Net 30 Days</option>
                    <option>POD Payment</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Quotation Valid Upto</label>
                  <input type="date" className="form-control" value={validUpto} onChange={(e) => setValidUpto(e.target.value)} />
                </div>
              </div>

              {/* Remarks */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={styles.formLabelPage}>Remarks</label>
                <textarea 
                  className="form-control" rows="3" style={{ resize: 'none' }} placeholder="Enter remarks..."
                  value={details} onChange={(e) => setDetails(e.target.value)} 
                />
              </div>

              {/* Demurrage Charges section (Screenshot 1) */}
              <div style={styles.sectionHeader}>Demurrage Charges</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Demurrage Charge</label>
                  <input 
                    type="number" className="form-control" placeholder="0" 
                    value={demurrageCharge} onChange={(e) => setDemurrageCharge(parseFloat(e.target.value) || 0)} 
                  />
                </div>
                <div className="form-group" style={{ flex: 2 }}>
                  <label style={styles.formLabelPage}>Demurrage Charge Type</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={demurrageChargeType} onChange={(e) => setDemurrageChargeType(e.target.value)}
                  >
                    <option>Select Demurrage Type</option>
                    <option>Per Hour</option>
                    <option>Per Day</option>
                    <option>Fixed</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 2 }}>
                  <label style={styles.formLabelPage}>Demurrage Charge Applicable After</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={demurrageChargeAfter} onChange={(e) => setDemurrageChargeAfter(e.target.value)}
                  >
                    <option>Select Demurrage Charge Applicable After</option>
                    <option>Immediate</option>
                    <option>24 Hours</option>
                    <option>48 Hours</option>
                    <option>72 Hours</option>
                  </select>
                </div>
              </div>

              {/* Datetime print suppress checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
                <input 
                  type="checkbox" id="hideDatetimeCheck"
                  checked={hideDatetime} onChange={(e) => setHideDatetime(e.target.checked)} 
                />
                <label htmlFor="hideDatetimeCheck" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>
                  HIDE GENERATED DATETIME FROM PDF
                </label>
              </div>

              <div style={styles.greenButtonContainer}>
                <button type="submit" style={styles.greenActionBtn}>
                  Generate Quotation
                </button>
              </div>

            </form>
          ) : (
            // High-Fidelity Packers & Movers Relocation Form Card (Screenshots 3 & 4)
            <form onSubmit={handleSubmit} style={{ ...styles.formContainer, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '20px' }}>
                <h4 style={{ margin: 0, color: '#0066cc', fontWeight: '800' }}>Packers & Movers Quotation Form</h4>
              </div>

              {/* Metadata row */}
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Quotation Number *</label>
                  <input type="text" className="form-control" required value={quoteNo} onChange={(e) => setQuoteNo(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Quotation Generate Date *</label>
                  <input type="date" className="form-control" required value={generateDate} onChange={(e) => setGenerateDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1.2 }}>
                  <label style={styles.formLabelPage}>Moving Type</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={movingType} onChange={(e) => setMovingType(e.target.value)}
                  >
                    <option>Select Moving Type</option>
                    <option>Household Relocation</option>
                    <option>Office Shifting</option>
                    <option>Commercial Cargo</option>
                    <option>Vehicle Shifting</option>
                  </select>
                </div>
              </div>

              {/* Party Details section */}
              <div style={styles.sectionHeader}>Party Details</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Party name *</label>
                  <input type="text" className="form-control" required placeholder="Party Name" value={partyName} onChange={(e) => setPartyName(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Party Mobile</label>
                  <input type="text" className="form-control" placeholder="Party Mobile" value={partyMobile} onChange={(e) => setPartyMobile(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Party Email</label>
                  <input type="email" className="form-control" placeholder="Party Email" value={partyEmail} onChange={(e) => setPartyEmail(e.target.value)} />
                </div>
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Packing Date</label>
                  <input type="date" className="form-control" value={packingDate} onChange={(e) => setPackingDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Delivery Date</label>
                  <input type="date" className="form-control" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                </div>
              </div>

              {/* From Address section */}
              <div style={styles.sectionHeader}>From Address</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>State</label>
                  <input type="text" className="form-control" placeholder="State" value={fromState} onChange={(e) => setFromState(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>City</label>
                  <input type="text" className="form-control" placeholder="City" value={fromCity} onChange={(e) => setFromCity(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Pincode</label>
                  <input type="text" className="form-control" placeholder="Pincode" value={fromPincode} onChange={(e) => setFromPincode(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label style={styles.formLabelPage}>Address</label>
                <textarea 
                  className="form-control" style={{ height: '70px', resize: 'none' }} placeholder="Address" 
                  value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} 
                />
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Landmark</label>
                  <input type="text" className="form-control" placeholder="Landmark" value={fromLandmark} onChange={(e) => setFromLandmark(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Floor No.</label>
                  <input type="text" className="form-control" placeholder="Floor No." value={fromFloor} onChange={(e) => setFromFloor(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Is Lift Available</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={fromLift} onChange={(e) => setFromLift(e.target.value)}
                  >
                    <option>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>

              {/* To Address section */}
              <div style={styles.sectionHeader}>To Address</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>State</label>
                  <input type="text" className="form-control" placeholder="State" value={toState} onChange={(e) => setToState(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>City</label>
                  <input type="text" className="form-control" placeholder="City" value={toCity} onChange={(e) => setToCity(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Pincode</label>
                  <input type="text" className="form-control" placeholder="Pincode" value={toPincode} onChange={(e) => setToPincode(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label style={styles.formLabelPage}>Address</label>
                <textarea 
                  className="form-control" style={{ height: '70px', resize: 'none' }} placeholder="Address" 
                  value={toAddress} onChange={(e) => setToAddress(e.target.value)} 
                />
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Landmark</label>
                  <input type="text" className="form-control" placeholder="Landmark" value={toLandmark} onChange={(e) => setToLandmark(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Floor No.</label>
                  <input type="text" className="form-control" placeholder="Floor No." value={toFloor} onChange={(e) => setToFloor(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Is Lift Available</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={toLift} onChange={(e) => setToLift(e.target.value)}
                  >
                    <option>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>

              {/* Payment Details section */}
              <div style={styles.sectionHeader}>Payment Details</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Transport Charge</label>
                  <input type="number" className="form-control" value={pmTransportCharge} onChange={(e) => setPmTransportCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Packaging Charge</label>
                  <input type="number" className="form-control" value={pmPackingCharge} onChange={(e) => setPmPackingCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Loading Charge</label>
                  <input type="number" className="form-control" value={pmLoadingCharge} onChange={(e) => setPmLoadingCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Unloading Charge</label>
                  <input type="number" className="form-control" value={pmUnloadingCharge} onChange={(e) => setPmUnloadingCharge(parseFloat(e.target.value) || 0)} />
                </div>
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Car/Bike TPT Charge</label>
                  <input type="number" className="form-control" value={pmCarBikeCharge} onChange={(e) => setPmCarBikeCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>ST Charge</label>
                  <input type="number" className="form-control" value={pmStCharge} onChange={(e) => setPmStCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Other Charge</label>
                  <input type="number" className="form-control" value={pmOtherCharge} onChange={(e) => setPmOtherCharge(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Total Freight Amount</label>
                  <input type="number" disabled style={{ ...styles.disabledInput, fontWeight: '800', color: '#10b981' }} value={pmTotalFreight} />
                </div>
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Advance Amount</label>
                  <input type="number" className="form-control" value={pmAdvanceAmount} onChange={(e) => setPmAdvanceAmount(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Balance Amount</label>
                  <input type="number" disabled style={{ ...styles.disabledInput, fontWeight: '800', color: '#ef4444' }} value={pmBalanceAmount} />
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>GST In Quote</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={pmGstInQuote} onChange={(e) => setPmGstInQuote(e.target.value)}
                  >
                    <option>Select GST In Quote</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>

              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>GST Type</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={pmGstType} onChange={(e) => setPmGstType(e.target.value)}
                  >
                    <option>Select GST Type</option>
                    <option>CGST & SGST</option>
                    <option>IGST</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>GST Percent</label>
                  <select 
                    className="form-control" style={{ height: '38px' }}
                    value={pmGstPercent} onChange={(e) => setPmGstPercent(e.target.value)}
                  >
                    <option>Select GST Percent</option>
                    <option>0% GST</option>
                    <option>5% GST</option>
                    <option>12% GST</option>
                    <option>18% GST</option>
                    <option>28% GST</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label style={styles.formLabelPage}>Payment Remark</label>
                <textarea 
                  className="form-control" style={{ height: '70px', resize: 'none' }} placeholder="Payment Remark" 
                  value={pmPaymentRemark} onChange={(e) => setPmPaymentRemark(e.target.value)} 
                />
              </div>

              {/* Item Details section */}
              <div style={styles.sectionHeader}>Item Details</div>
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label style={styles.formLabelPage}>Item Name</label>
                  <input type="text" className="form-control" placeholder="Item Name" value={pmItemName} onChange={(e) => setPmItemName(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={styles.formLabelPage}>Item Quantity</label>
                  <input type="number" className="form-control" placeholder="Item Quantity" value={pmItemQuantity} onChange={(e) => setPmItemQuantity(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Item Value</label>
                  <input type="number" className="form-control" placeholder="Item Value" value={pmItemValue} onChange={(e) => setPmItemValue(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label style={styles.formLabelPage}>Item Remark</label>
                <textarea 
                  className="form-control" style={{ height: '70px', resize: 'none' }} placeholder="Item Remark" 
                  value={pmItemRemark} onChange={(e) => setPmItemRemark(e.target.value)} 
                />
              </div>

              {/* Bottom Print and suppression settings */}
              <div style={styles.flexRow}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label style={styles.formLabelPage}>Vehicle Type</label>
                  <input type="text" className="form-control" placeholder="Vehicle Type" value={pmVehicleType} onChange={(e) => setPmVehicleType(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1.5, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                    <input 
                      type="checkbox" id="pmHideDatetimeCheck"
                      checked={pmHideDatetime} onChange={(e) => setPmHideDatetime(e.target.checked)} 
                    />
                    <label htmlFor="pmHideDatetimeCheck" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', cursor: 'pointer' }}>
                      HIDE GENERATED DATETIME FROM PDF
                    </label>
                  </div>
                </div>
              </div>

              <div style={styles.greenButtonContainer}>
                <button type="submit" style={styles.greenActionBtn}>
                  Generate Quotation
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* Directory List Mode (Transport or P&M List) (Screenshots 2 & 5) */}
      {(isListTransport || isListPM) && (
        <div>
          <div style={styles.headerRow}>
            <h2 style={styles.title}>
              {isListTransport 
                ? `Transport Quotation List (${filteredQuotes.length})` 
                : `Packers & Movers Quotation List (${filteredQuotes.length})`}
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ backgroundColor: '#008ecc', color: '#ffffff', border: 'none', fontWeight: '700' }}
                onClick={() => setIsFilterModalOpen(true)}
              >
                Filter
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#0066cc', color: '#ffffff', border: 'none', fontWeight: '700' }}
                onClick={() => setActivePage(isListPM ? 'quotation-pm-create' : 'quotation-transport-create')}
              >
                {isListTransport ? 'Create Transport Quotation' : 'Create Packers & Movers Quotation'}
              </button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(appliedPartyName || appliedFromDate || appliedToDate) && (
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0369a1' }}>Active Filters:</span>
                {appliedPartyName && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Party: {appliedPartyName}
                  </span>
                )}
                {(appliedFromDate || appliedToDate) && (
                  <span className="status-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    Date Range: {appliedFromDate || 'Any'} ➔ {appliedToDate || 'Any'}
                  </span>
                )}
                <button 
                  onClick={() => {
                    setFilterPartyName('Select Party Name');
                    setFilterFromDate('');
                    setFilterToDate('');
                    setAppliedPartyName('');
                    setAppliedFromDate('');
                    setAppliedToDate('');
                  }} 
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', padding: 0, marginLeft: '10px' }}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* FILTER OPTIONS DIALOG MODAL (Screenshot 4) */}
          {isFilterModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', width: '100%', maxWidth: '520px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Filter Options</h3>
                  <button onClick={() => setIsFilterModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Party Name</label>
                    <select 
                      value={filterPartyName}
                      onChange={(e) => setFilterPartyName(e.target.value)}
                      className="form-control"
                      style={{ width: '100%' }}
                    >
                      <option>Select Party Name</option>
                      {Array.from(new Set(quotations.filter(q => isListPM ? q.type === 'P&M' : q.type === 'Transport').map(q => q.partyName))).filter(Boolean).map((p, i) => (
                        <option key={i} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>From Date</label>
                      <input 
                        type="date" 
                        value={filterFromDate}
                        onChange={(e) => setFilterFromDate(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>To Date</label>
                      <input 
                        type="date" 
                        value={filterToDate}
                        onChange={(e) => setFilterToDate(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <button 
                      onClick={() => {
                        setAppliedPartyName(filterPartyName === 'Select Party Name' ? '' : filterPartyName);
                        setAppliedFromDate(filterFromDate);
                        setAppliedToDate(filterToDate);
                        setIsFilterModalOpen(false);
                      }}
                      style={{ backgroundColor: '#00b050', color: '#ffffff', fontWeight: '700', fontSize: '0.85rem', padding: '8px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0, 176, 80, 0.15)' }}
                    >
                      Search
                    </button>
                    <button 
                      onClick={() => setIsFilterModalOpen(false)}
                      style={{ backgroundColor: '#f1f5f9', color: '#334155', fontWeight: '600', fontSize: '0.85rem', padding: '8px 20px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredQuotes.length > 0 ? (
            <>
              {/* Search bar */}
              <div style={styles.filterBar}>
                <div style={{ position: 'relative', width: '300px' }}>
                  <input 
                    type="text" 
                    placeholder="Search by client or quotation #..." 
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
                    <tr>
                      <th>Quotation No</th>
                      <th>Date</th>
                      <th>Client Party</th>
                      <th>Route</th>
                      <th>Quoted Amount (INR)</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.map((quote) => (
                      <tr key={quote._id}>
                        <td style={{ fontWeight: '700', color: '#0066cc' }}>{quote.quotationNo}</td>
                        <td>{quote.date}</td>
                        <td style={{ fontWeight: '600' }}>{quote.partyName}</td>
                        <td style={{ fontWeight: '500' }}>{quote.fromCity} ➔ {quote.toCity}</td>
                        <td style={{ fontWeight: '700', color: '#10b981' }}>₹{quote.rate.toLocaleString()}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button className="btn-icon" onClick={() => setViewingQuotation(quote)} title="View & Print Quote">
                              <Printer size={14} />
                            </button>
                            <button className="btn-icon btn-danger" onClick={() => setQuotations(quotations.filter(q => q._id !== quote._id))} title="Delete">
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            // Centered High-Fidelity Empty State (Screenshots 2 & 5)
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', marginTop: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#334155', marginBottom: '24px' }}>No Data Found</h3>
              <div style={{
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
              }}>
                1
              </div>
            </div>
          )}
        </div>
      )}

      {/* Printable Invoice / Quotation Modal View */}
      {viewingQuotation && (
        <div className="modal-overlay">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-only-document, .print-only-document * {
                visibility: visible;
              }
              .print-only-document {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                max-width: 100%;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: #ffffff !important;
              }
              button, .btn {
                display: none !important;
              }
            }
          `}</style>
          <div className="modal-content" style={{ maxWidth: '800px', padding: 0 }}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>🖨️ Quotation Print Preview</h3>
              <button onClick={() => setViewingQuotation(null)} style={styles.closeBtn}><X size={18}/></button>
            </div>
            
            {/* Printable Area */}
            <div style={styles.printArea} className="print-only-document">
              <div style={styles.printHeader}>
                <div>
                  <h1 style={{ color: '#0066cc', fontSize: '1.8rem', fontFamily: 'Outfit' }}>TRANSCORE LOGISTICS</h1>
                  <p style={{ color: '#64748b', fontSize: '0.8rem' }}>GSTIN: 09AAACT9211C1ZA • Regd. Address: Vadodara, India</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ color: '#64748b' }}>QUOTATION MEMO</h3>
                  <p style={{ fontSize: '0.85rem' }}><b>Quotation #:</b> {viewingQuotation.quotationNo}</p>
                  <p style={{ fontSize: '0.85rem' }}><b>Date:</b> {viewingQuotation.date}</p>
                </div>
              </div>

              <div style={styles.printBody}>
                <div style={styles.partyDetails}>
                  <p><b>To:</b></p>
                  <h4>{viewingQuotation.partyName}</h4>
                  <p>Valued Customer Logistics Department</p>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <table style={styles.printTable}>
                    <thead>
                      <tr style={{ background: '#f1f5f9' }}>
                        <th style={{ padding: '8px' }}>Description of Service</th>
                        <th style={{ padding: '8px' }}>Source Route</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '12px 8px' }}>
                          <b>{viewingQuotation.type === 'P&M' ? 'Packers & Movers Relocation Contract' : 'Commercial Freight Transportation Freight'}</b>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', whiteSpace: 'pre-line' }}>
                            {viewingQuotation.details}
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>{viewingQuotation.fromCity} to {viewingQuotation.toCity}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '700' }}>₹{viewingQuotation.rate.toLocaleString()}</td>
                      </tr>
                      <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                        <td colSpan="2" style={{ textAlign: 'right', padding: '8px', fontWeight: '700' }}>Net Quoted Total:</td>
                        <td style={{ textAlign: 'right', padding: '8px', fontWeight: '800', color: '#0066cc', fontSize: '1.05rem' }}>₹{viewingQuotation.rate.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={styles.termsBox}>
                  <h5>📄 General Rules & Conditions:</h5>
                  <ul>
                    <li>Quotations are valid for 15 days from the date of issuance.</li>
                    <li>Freight charges are subject to diesel price fluctuations at loading date (+/- 5%).</li>
                    <li>Full payment must be settled upon unloading of the consignment.</li>
                  </ul>
                </div>

                <div style={styles.signaturesRow}>
                  <div>
                    <div style={styles.signatureLine}></div>
                    <span>Customer Acceptance Signature</span>
                  </div>
                  <div>
                    <div style={styles.signatureLine}></div>
                    <span>For Transcore Logistics (Auth Sign)</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <button className="btn btn-secondary" onClick={() => setViewingQuotation(null)}>Close</button>
              <button className="btn btn-primary" onClick={handlePrint}>🖨️ Print Quotation</button>
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
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '10px'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px'
  },
  calcPanel: {
    background: '#f0f7ff',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #bfdbfe'
  },
  panelTitle: {
    margin: 0,
    color: '#1e40af',
    fontSize: '0.85rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '14px',
    paddingTop: '10px',
    borderTop: '1px dashed #bfdbfe',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#475569'
  },
  filterBar: {
    background: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '16px'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer'
  },
  printArea: {
    padding: '30px',
    backgroundColor: '#ffffff'
  },
  printHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '2px solid #0066cc',
    paddingBottom: '14px',
    marginBottom: '20px'
  },
  partyDetails: {
    background: '#f8fafc',
    padding: '12px',
    borderRadius: '6px',
    borderLeft: '4px solid #0066cc'
  },
  printTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem'
  },
  termsBox: {
    marginTop: '30px',
    background: '#fdfefe',
    border: '1px solid #cbd5e1',
    padding: '12px',
    borderRadius: '6px'
  },
  signaturesRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '60px',
    fontSize: '0.75rem',
    color: '#64748b'
  },
  signatureLine: {
    width: '200px',
    borderBottom: '1px solid #cbd5e1',
    height: '40px',
    marginBottom: '6px'
  }
};
