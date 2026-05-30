import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Home, Download, Printer } from 'lucide-react';

// --- Seeded Datasets ---
const initialSeededParties = [
  { _id: 'p1', name: 'Bios Cropcare Pvt. Ltd.', gstin: '24AAFCB3913K1ZT', phone: '', email: '', address: 'Plot No. D/2/CH-128, GIDC EstateDahej, Ta-VagraDist.-Bharuch-392130 Gujarat', city: 'Bharuch', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'p2', name: 'ACUFINE LIFESCIENCES PRIVATE LIMITED', gstin: '03AATCA8677P1ZN', phone: '', email: '', address: 'A/C Daga Crop Care Pvt Ltd-Ahmedabad 2013/2014,Khata No.130/137,131/138,132/139,133/140,Jaspalon Ludhiana -141421', city: 'Ludhiana', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'p3', name: 'SYNGENTA INDIA PVT LTD, BHARUCH', gstin: '24AAECS9424P1ZT', phone: '', email: '', address: 'PLOT NO 140/1,GIDC ESTATE ANKLESHWAR-393002', city: 'Ankleshwar', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'p4', name: 'SWARUP CHEMICALS (P) LTD', gstin: '24AADCS8959E1Z3', phone: '', email: '', address: 'D-16 RADH KRISHNA ESTATE NH-8 ASLALI GAON NEAR RANDAL WARE HOUSE AHMEDABAD-382427', city: 'Ahmedabad', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'p5', name: 'SWARUP CHEMICALS PVT LTD- SANDILA', gstin: '09AADCS8959E1ZV', phone: '', email: '', address: 'PLOT NO B-15 TO B-22 UPSIDC INDUSTRIAL AREA SANDILA HARDOI UP 241127', city: 'Sandila', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'p6', name: 'HERANBA INDUSTRIES LTD SARIGAM', gstin: '24AAACH3787Q1Z0', phone: '', email: '', address: 'PLOT NO 2817/1,CHEMICAL ZONE GIDC SARIGAM VALSAD GUJARAT-396155', city: 'Sarigam', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'p7', name: 'NEW PACK AGRO CHEM,BHARUCH', gstin: '24AALFN0778K1ZW', phone: '', email: '', address: 'PLOT NO 238/1/A,GIDC PANOLI TALUKA,ANKLESHWAR BHARUCH 394115', city: 'Panoli', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'p8', name: 'BIOSTADT INDIA LIMITED', gstin: '27AACCB1830G1Z3', phone: '', email: '', address: 'PLOT NO B-33 & B-76,MIDC INDUSTRIAL AREA WALUJ AURANGABAD 431136', city: 'Aurangabad', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'p9', name: 'INDIA PESTICIDES LIMITED', gstin: '09AAACI3591D1ZO', phone: '', email: 'info@indiapesticideslimited.com', address: 'Land No-615,Village-Mati,Pargana,Deva Mati Barabanki-225003', city: 'Barabanki', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'p10', name: 'INDIA PESTICIDES LTD', gstin: '09AAACI3591D1ZO', phone: '', email: '', address: 'PLOT NO.D-2 TO D-4&K-2 TO K-12,L-1,UPSIDC Industrial area Sandila-241127,Hardoi,UTTAR PRADESH', city: 'Sandila', createdBy: 'TRANSCORE LOGISTICS' }
];

const extraCompanies = [
  "Rallis India Ltd", "Coromandel International", "Dhanuka Agritech", "PI Industries", "Sharda Cropchem",
  "Excel Crop Care", "Insecticides India", "Bharat Rasayan", "Meghmani Organics", "Aries Agro",
  "Punjab Chemicals", "Kriti Industries", "Aimco Pesticides", "Hikal Limited", "NACL Industries",
  "Astec LifeSciences", "Basf India Ltd", "Bayer CropScience", "Sumitomo Chemical", "Monsanto India",
  "Gharda Chemicals", "Cheminova India", "Godrej Agrovet", "Crystal Crop Protection", "Krishi Rasayan",
  "Willowood Chemicals", "Indofil Industries", "FMC India Pvt Ltd", "Corteva Agriscience", "Syngenta India",
  "Adama India", "IPL Biologicals", "Jaishree Rasayan"
];

const seededParties = [
  ...initialSeededParties,
  ...extraCompanies.map((name, index) => ({
    _id: `p_${index + 11}`,
    name: name.toUpperCase() + " PRIVATE LIMITED",
    gstin: `24AAAC${1000 + index}B1Z${(index % 9) + 1}`,
    phone: '',
    email: '',
    address: `Industrial Development Zone, Block C-${index + 10}, Gujarat, India`,
    city: 'Ahmedabad',
    createdBy: 'TRANSCORE LOGISTICS'
  }))
];

// --- 90 Seeded Suppliers matching Screenshot 5 ---
const initialSeededSuppliers = [
  { _id: 's1', name: 'CHANDRA KISHOR SHUKLA', phone: '9555103019', gstin: 'AZXPS9588B', city: 'Kanpur', state: 'UP', address: '44 YOHI GREEN SWARNA JAYANTI VIHAR KOYALA NAGAR KANPUR NAGAR 208004', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's2', name: 'SANDEEP KUMAR', phone: '9129918353', gstin: 'KKRPK2121M', city: 'Kanpur', state: 'UP', address: 'SANDEEP KUMAR', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's3', name: 'SHYAM JI MISHRA', phone: '8174076214', gstin: '', city: 'Kanpur', state: 'UP', address: '10/5 DADA NA GAR LABOUR COLONYGOVIND NAGAR KANPUR NAGARUP208006', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's4', name: 'DELHI GUJRAT FLEET CARRIER PVT LTD', phone: '6360843409', gstin: '', city: 'Delhi', state: 'Delhi', address: 'DELHI GUJRAT FLEET CARRIER PVT LTD', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's5', name: 'LKO KANPUR GOODS CARRIERS', phone: '8924830532', gstin: '', city: 'Lucknow', state: 'UP', address: '19 gurudwara road lucknow up 226004', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's6', name: 'RIZWAN SIDDIQUI', phone: '8957113583', gstin: 'AYFPS2685A', city: 'Kanpur', state: 'UP', address: 'DD396230', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's7', name: 'RAJU', phone: '7318172261', gstin: 'CFNPR8308L', city: 'Bahrajch', state: 'UP', address: 'BULAHA HARIHARPUR BAHRAJCH UP271870', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's8', name: 'DIPAKKUMAR PRAJAPATI', phone: '8303932821', gstin: 'BQJPP8558E', city: 'Palanpur', state: 'GJ', address: '51 KHODIYAR TEMPLE KANTHERIYA HANUMAN PALANPUR BANASKANTHA GJ 385001', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's9', name: 'RAKESH PANDEY', phone: '8382877989', gstin: '', city: 'Ahmedabad', state: 'GJ', address: 'AHMEDABAD', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's10', name: 'ABDULA NAUSHAD', phone: '8299223004', gstin: 'AXXPN1181D', city: 'Farrukhabad', state: 'UP', address: 'GRAM ISAPUR JARARI FARRUKHABAD UTTARPRADESH 209739', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 's11', name: 'HARENDRA KUMAR', phone: '9975425375', gstin: 'AHKPC0268P', city: 'Kanpur', state: 'UP', address: '', createdBy: 'TRANSCORE LOGISTICS' }
];

const extraSupplierNames = [
  "Ramesh Cargo Movers", "Krishna Lorry Depot", "Girish Fuel & Logistics", "Bajrang Transport Corp",
  "Lucknow Kanpur Roadlines", "Savitri Logistics", "Kanpur Freight Carrier", "Surat Golden Transport",
  "Shiv Roadlines", "Jolly Goods Carrier", "Super Fast Logistics", "Balaji Transport Solutions",
  "Gujarat Goods Depot", "Vikas Roadways", "Apex Transport Services", "Express Logistics India",
  "Gita Lorry Supplier", "Hind Movers Kanpur", "Avadh Highway Transport", "Maruti Lorry Depot"
];

const seededSuppliers = [
  ...initialSeededSuppliers,
  ...Array.from({ length: 79 }, (_, idx) => {
    const baseName = extraSupplierNames[idx % extraSupplierNames.length];
    const suffix = Math.floor(idx / extraSupplierNames.length) + 1;
    const finalName = `${baseName} Vol ${suffix}`.toUpperCase();
    return {
      _id: `s_${idx + 12}`,
      name: finalName,
      phone: `99887${10000 + idx}`,
      gstin: `AAKPS${2000 + idx}M`,
      city: 'Kanpur',
      state: 'UP',
      address: `Industrial Road Sector-${idx + 1}, Kanpur Nagar, UP`,
      createdBy: 'TRANSCORE LOGISTICS'
    };
  })
];

// --- 87 Seeded Market Trucks matching Screenshot 3 ---
const initialSeededMarketTrucks = [
  { _id: 'vm1', supplierName: 'SANDEEP KUMAR', supplierMobile: '9129918353', supplierPan: 'KKRPK2121M', vehicleNumber: 'UP-78-HN-3039', engineNumber: '', chassisNumber: '', driverName: 'SANDEEP KUMAR', driverMobile: '9129918353', dlNumber: 'UP7820230027811', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm2', supplierName: 'SHYAM JI MISHRA', supplierMobile: '8174076214', supplierPan: '', vehicleNumber: 'UP-78-MN-9533', engineNumber: '', chassisNumber: '', driverName: 'RAJESH KUMAR', driverMobile: '8174076214', dlNumber: 'UP7120010001929', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm3', supplierName: 'JAY PEE INDIA', supplierMobile: '8081222243', supplierPan: 'AHHPS2707G', vehicleNumber: 'GJ-15-AX-2970', engineNumber: '', chassisNumber: '', driverName: 'OM PRAKASH', driverMobile: '7501938180', dlNumber: 'UP3319910000128', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm4', supplierName: 'DELHI GUJRAT FLEET CARRIER PVT LTD', supplierMobile: '6360843409', supplierPan: '', vehicleNumber: 'NL-01-N-6643', engineNumber: '', chassisNumber: '', driverName: 'MUNFED S/O USMAN', driverMobile: '6360843409', dlNumber: 'RJ1420120161901', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm5', supplierName: 'LKO KANPUR GOODS CARRIERS', supplierMobile: '8924830532', supplierPan: '', vehicleNumber: 'UP-32-HN-0729', engineNumber: '', chassisNumber: '', driverName: 'SAMEER AHMAD KHAN', driverMobile: '8924830532', dlNumber: 'UP70 20090001535', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm6', supplierName: 'LUCKNOW KANPUR ROADLINES', supplierMobile: '8423295286', supplierPan: '', vehicleNumber: 'UP-78-GT-3327', engineNumber: '', chassisNumber: '', driverName: 'PRADEEP KUMAR', driverMobile: '8009692965', dlNumber: 'UP9220070004848', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm7', supplierName: 'JAY PEE INDIA', supplierMobile: '8081222243', supplierPan: 'AHHPS2707G', vehicleNumber: 'GJ-15-AT-2085', engineNumber: '', chassisNumber: '', driverName: 'SATPAL SINGH', driverMobile: '9554577163', dlNumber: 'UP7819840071829', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm8', supplierName: 'RIZWAN SIDDIQUI', supplierMobile: '8957113583', supplierPan: 'AYFPS2685A', vehicleNumber: 'DD-01-N-9862', engineNumber: '', chassisNumber: '', driverName: 'ANSHU', driverMobile: '8957113583', dlNumber: 'UP7620230003679', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm9', supplierName: 'RAJU', supplierMobile: '7318172261', supplierPan: 'CFNPR8308L', vehicleNumber: 'UP-40-BT-3011', engineNumber: '', chassisNumber: '', driverName: 'SHANI KUMAR', driverMobile: '7318172261', dlNumber: 'MH0120100026091', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm10', supplierName: 'DIPAKKUMAR PRAJAPATI', supplierMobile: '8303932821', supplierPan: 'BQJPP8558E', vehicleNumber: 'GJ-08-AU-6309', engineNumber: '', chassisNumber: '', driverName: 'RAM NARESH', driverMobile: '8303932821', dlNumber: 'UP7820080079313', createdBy: 'TRANSCORE LOGISTICS' },
  { _id: 'vm11', supplierName: 'RAKESH PANDEY', supplierMobile: '8382877989', supplierPan: '', vehicleNumber: 'GJ-27-TD-1901', engineNumber: '', chassisNumber: '', driverName: 'LAXMIKANT CHAUBEY', driverMobile: '8382877989', dlNumber: 'UP6220150010693', createdBy: 'TRANSCORE LOGISTICS' }
];

const seededMarketTrucks = [
  ...initialSeededMarketTrucks,
  ...Array.from({ length: 76 }, (_, idx) => ({
    _id: `vm_${idx + 12}`,
    supplierName: idx % 2 === 0 ? 'KANPUR FREIGHT CARRIER' : 'GUJARAT GOODS DEPOT',
    supplierMobile: `98731${10000 + idx}`,
    supplierPan: `APMKS${4000 + idx}K`,
    vehicleNumber: `MH-46-AR-${1000 + idx}`,
    engineNumber: `ENG${500000 + idx}`,
    chassisNumber: `CHA800000${idx}`,
    driverName: `Driver Service ${idx + 12}`,
    driverMobile: `95551${20000 + idx}`,
    dlNumber: `UP782025000${100 + idx}`,
    createdBy: 'TRANSCORE LOGISTICS'
  }))
];

export default function Masters({ 
  activePage, setActivePage,
  customers, vehicles, drivers,
  onCreateMaster, onUpdateMaster, onDeleteMaster
}) {
  const tabIds = {
    'master-party': 'parties',
    'master-truck': 'trucks',
    'master-supplier': 'suppliers',
    'master-employee': 'employees',
    'master-item': 'items',
    'master-charge': 'charges',
    'master-terms': 'terms'
  };

  const currentTab = tabIds[activePage] || 'parties';

  // --- States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Local data holders preseeded to exact counts
  const [partiesList, setPartiesList] = useState(seededParties);
  const [marketTrucks, setMarketTrucks] = useState(seededMarketTrucks);
  const [ownTrucks, setOwnTrucks] = useState([]); // Empty own trucks by default per screenshot
  const [suppliersList, setSuppliersList] = useState(seededSuppliers);
  const [employeesList, setEmployeesList] = useState([]); // Empty by default per Screenshot 2
  const [itemsList, setItemsList] = useState([]);         // Empty by default per Screenshot 4
  
  const [truckTab, setTruckTab] = useState('own'); // 'own' or 'market'

  // Dedicated full page views
  const [showPartyFormPage, setShowPartyFormPage] = useState(false);
  const [showTruckFormPage, setShowTruckFormPage] = useState(false);
  const [showSupplierFormPage, setShowSupplierFormPage] = useState(false);
  const [showEmployeeFormPage, setShowEmployeeFormPage] = useState(false);
  const [showItemFormPage, setShowItemFormPage] = useState(false);
  const [showChargeFormPage, setShowChargeFormPage] = useState(false);
  const [showTermsFormPage, setShowTermsFormPage] = useState(false);
  
  // Custom vehicle number parts for quad-split input form
  const [vNumPart1, setVNumPart1] = useState('');
  const [vNumPart2, setVNumPart2] = useState('');
  const [vNumPart3, setVNumPart3] = useState('');
  const [vNumPart4, setVNumPart4] = useState('');
  
  const [vehicleType, setVehicleType] = useState('own'); // 'own' or 'market'

  const [charges, setCharges] = useState(() => {
    const saved = localStorage.getItem('masters_charges');
    if (saved) return JSON.parse(saved);
    return [
      { _id: 'ch1', name: 'Load/Unload Charge', status: 'Enable' },
      { _id: 'ch2', name: 'Door To Door Charge', status: 'Enable' },
      { _id: 'ch3', name: 'Bilty Charges', status: 'Enable' },
      { _id: 'ch4', name: 'Service Charge', status: 'Enable' }
    ];
  });

  const [terms, setTerms] = useState(() => {
    const saved = localStorage.getItem('masters_terms');
    if (saved) return JSON.parse(saved);
    return [
      { _id: 't1', text: "Consignor/Consignee Should have insured their goods. In case of any accident, natural damage or deterioration either the compensation shall be paid by the Party or Insurance Company Should Settle the Amount.", showInPdf: true },
      { _id: 't2', text: "In case any dispute or difference arises between the parties with regard to the terms and conditions of this agreement or relating to the interpretation thereof and which could not be solved with mutual understanding then both parties require to approach the local jurisdiction selected by transporter to resolve the same with legal procedure.", showInPdf: true },
      { _id: 't3', text: "The consignment shall be detained, re-routed, re-booked without the consignee's written and explicit permission. Will be delivered at the destination.", showInPdf: true },
      { _id: 't4', text: "The consignor is responsible for all consequences of any incorrect or false declaration.", showInPdf: true },
      { _id: 't5', text: "Any Statement made in this lorry receipt or at any time in a circumstance regarding this receipt, the Transport Operator shall observe its obligation to the Consignee bank mentioned and will be responsible for safe and due delivery, and for any loss or damage to the goods or consignment, that arises as a result of negligence, default, failure to take reasonable precautions, maladies or criminal or fraudulent actions of the Transport Operator or any of his Managers, Agents, Employees, Partners, Directors, Business Associates, Branches etc.", showInPdf: true },
      { _id: 't6', text: "The Consignee Bank accepting Lorry Receipt under clause 1 above will not be liable for payment of any charges arising out of any lien of the transport Operator against the consignor or the buyer. the Transport Operator shall deliver the goods unconditionally to the Bank on Payment of the normal freight and storage charges only in connection with the consignment in question, without claiming any lien on the goods in respect of any monies due by the consignor or the consignee to the Transport Operator on any other account whatsoever.", showInPdf: true },
      { _id: 't7', text: "In either of the case mentioned above, the bank or the relevant authority shall be entitled to the proceeds and the Transport Operator is to render full accounts immediately after sale deducting freight and demurrage.", showInPdf: true },
      { _id: 't8', text: "Goods lying undelivered can be disposed off by the Transport Operator after 30 days of arrival after delivery to the consignor, bank, and the holder interested with a 15-day notice of such disposal of goods.", showInPdf: true },
      { _id: 't9', text: "Perishable goods lying undelivered after 48 hours of arrival can be disposed of by the Transport Operator's discretion without prior notice of thereof.", showInPdf: true },
      { _id: 't10', text: "The consignor is the primary payer of all transport and incidental charges, if any, payable to the Transport Operator at their agreed location.", showInPdf: true },
      { _id: 't11', text: "The right to entrust goods to any other lorry or service for transport of goods shall be with the Transport Operator. If the goods are entrusted by the transport operator to another entity, the other entity shall be considered the transport operator's agent, and the transport operator, notwithstanding the delivery of goods, the operator will be responsible for the safety of the goods and for their delivery at the destination by the hands of the other carrier referred to as the Transport Operator's agent.", showInPdf: true },
      { _id: 't12', text: "The Transport Operator undertakes to deliver the goods in the same order and condition as received. The lorry receipt being surrendered to the bank, to its order, or to its assigns, has accepted it for lending and to the collection or discounting of bills of its customers or for collection or to its agents. Only the bank and the holder of the receipt entitled to the delivery as aforesaid shall have the right of recourse against the operator for any and all claims arising thereon.", showInPdf: true },
      { _id: 't13', text: "The Transport Operator hereby agrees to hold itself liable directly to the bank concerned, as if the Bank was a party, of the contract contained with right of recourse against the Operator, the full value goods handed over for carriage, storage and Delivery, should a Bank accept this lorry Receipt as a consignee / endorsee or in any other capacity for the purpose of providing advances and / or collection or discounting of bills of its customer, before or after the Transport Operator has been entrusted the goods.", showInPdf: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('masters_charges', JSON.stringify(charges));
  }, [charges]);

  useEffect(() => {
    localStorage.setItem('masters_terms', JSON.stringify(terms));
  }, [terms]);

  const handleToggleTnCPdf = (id) => {
    setTerms(terms.map(t => t._id === id ? { ...t, showInPdf: !t.showInPdf } : t));
  };

  // Sync external props if populated
  useEffect(() => {
    if (customers && customers.length > 2) {
      setPartiesList(customers);
    }
  }, [customers]);

  // --- CRUD triggers ---
  const handleOpenAdd = () => {
    setEditingItem(null);
    let initialForm = {};
    
    if (currentTab === 'parties') {
      initialForm = { name: '', phone: '', email: '', gstin: '', address: '', city: '' };
      setFormData(initialForm);
      setShowPartyFormPage(true);
      return;
    }

    if (currentTab === 'trucks') {
      setVNumPart1('');
      setVNumPart2('');
      setVNumPart3('');
      setVNumPart4('');
      setVehicleType('own');
      setFormData({
        vehicleNumber: '', model: '', ownerName: '', ownerPhone: '', insuranceExpiry: '', rcNumber: '',
        driverName: '', driverMobile: '', dlNumber: '', engineNumber: '', chassisNumber: '',
        supplierName: '', supplierMobile: '', supplierPan: '', supplierAddress: ''
      });
      setShowTruckFormPage(true);
      return;
    }

    if (currentTab === 'suppliers') {
      initialForm = { name: '', phone: '', gstin: '', city: '', state: '', address: '' };
      setFormData(initialForm);
      setShowSupplierFormPage(true);
      return;
    }

    if (currentTab === 'employees') {
      initialForm = { 
        name: '', mobile: '', designation: '', salary: '', aadhar: '', license: '', 
        bankName: '', bankHolder: '', bankAccount: '', bankIfsc: '', status: 'Enable', isDriver: false 
      };
      setFormData(initialForm);
      setShowEmployeeFormPage(true);
      return;
    }

    if (currentTab === 'items') {
      initialForm = { name: '', hsnCode: '', status: 'Enable' };
      setFormData(initialForm);
      setShowItemFormPage(true);
      return;
    }

    if (currentTab === 'charges') {
      initialForm = { name: '', status: 'Enable' };
      setFormData(initialForm);
      setShowChargeFormPage(true);
      return;
    }

    if (currentTab === 'terms') {
      initialForm = { text: '', showInPdf: true };
      setFormData(initialForm);
      setShowTermsFormPage(true);
      return;
    }

    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    
    if (currentTab === 'parties') {
      setShowPartyFormPage(true);
    } else if (currentTab === 'trucks') {
      const parts = (item.vehicleNumber || '').split('-');
      setVNumPart1(parts[0] || '');
      setVNumPart2(parts[1] || '');
      setVNumPart3(parts[2] || '');
      setVNumPart4(parts[3] || '');
      setVehicleType(truckTab);
      setShowTruckFormPage(true);
    } else if (currentTab === 'suppliers') {
      setShowSupplierFormPage(true);
    } else if (currentTab === 'employees') {
      setShowEmployeeFormPage(true);
    } else if (currentTab === 'items') {
      setShowItemFormPage(true);
    } else if (currentTab === 'charges') {
      setShowChargeFormPage(true);
    } else if (currentTab === 'terms') {
      setShowTermsFormPage(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTab === 'parties') {
      if (editingItem) {
        const updated = partiesList.map(x => x._id === editingItem._id ? { ...x, ...formData } : x);
        setPartiesList(updated);
        onUpdateMaster('customers', editingItem._id, formData);
      } else {
        const newItem = {
          _id: `p_new_${Date.now()}`,
          ...formData,
          createdBy: 'TRANSCORE LOGISTICS'
        };
        setPartiesList([newItem, ...partiesList]);
        onCreateMaster('customers', formData);
      }
      setShowPartyFormPage(false);
    } else if (currentTab === 'trucks') {
      const joinedVNum = `${vNumPart1.toUpperCase()}-${vNumPart2.toUpperCase()}-${vNumPart3.toUpperCase()}-${vNumPart4.toUpperCase()}`;
      const payload = {
        ...formData,
        vehicleNumber: joinedVNum,
        createdBy: 'TRANSCORE LOGISTICS'
      };

      if (vehicleType === 'own') {
        const newItem = {
          _id: editingItem ? editingItem._id : `v_own_${Date.now()}`,
          ...payload
        };
        if (editingItem) {
          setOwnTrucks(ownTrucks.map(x => x._id === editingItem._id ? newItem : x));
        } else {
          setOwnTrucks([newItem, ...ownTrucks]);
        }
      } else {
        const newItem = {
          _id: editingItem ? editingItem._id : `v_m_new_${Date.now()}`,
          ...payload
        };
        if (editingItem) {
          setMarketTrucks(marketTrucks.map(x => x._id === editingItem._id ? newItem : x));
        } else {
          setMarketTrucks([newItem, ...marketTrucks]);
        }
        
        if (payload.supplierName) {
          const autoSupplier = {
            _id: `s_auto_${Date.now()}`,
            name: payload.supplierName.toUpperCase(),
            phone: payload.supplierMobile || '',
            gstin: payload.supplierPan || '',
            address: payload.supplierAddress || payload.supplierName,
            city: 'Kanpur',
            state: 'UP',
            createdBy: 'TRANSCORE LOGISTICS'
          };
          setSuppliersList([autoSupplier, ...suppliersList]);
        }
      }
      onCreateMaster('vehicles', payload);
      setShowTruckFormPage(false);
    } else if (currentTab === 'suppliers') {
      const payload = {
        ...formData,
        name: formData.name.toUpperCase(),
        createdBy: 'TRANSCORE LOGISTICS'
      };
      if (editingItem) {
        setSuppliersList(suppliersList.map(x => x._id === editingItem._id ? { ...x, ...payload } : x));
      } else {
        const newItem = { _id: `s_new_${Date.now()}`, ...payload };
        setSuppliersList([newItem, ...suppliersList]);
      }
      setShowSupplierFormPage(false);
    } else if (currentTab === 'employees') {
      const payload = {
        ...formData,
        createdBy: 'TRANSCORE LOGISTICS'
      };
      if (editingItem) {
        setEmployeesList(employeesList.map(x => x._id === editingItem._id ? { ...x, ...payload } : x));
      } else {
        const newItem = { _id: `e_new_${Date.now()}`, ...payload };
        setEmployeesList([newItem, ...employeesList]);
      }
      setShowEmployeeFormPage(false);
    } else if (currentTab === 'items') {
      const payload = {
        ...formData,
        createdBy: 'TRANSCORE LOGISTICS'
      };
      if (editingItem) {
        setItemsList(itemsList.map(x => x._id === editingItem._id ? { ...x, ...payload } : x));
      } else {
        const newItem = { _id: `i_new_${Date.now()}`, ...payload };
        setItemsList([newItem, ...itemsList]);
      }
      setShowItemFormPage(false);
    } else if (currentTab === 'charges') {
      const payload = {
        ...formData,
        createdBy: 'TRANSCORE LOGISTICS'
      };
      if (editingItem) {
        setCharges(charges.map(x => x._id === editingItem._id ? { ...x, ...payload } : x));
      } else {
        const newItem = { _id: `ch_new_${Date.now()}`, ...payload };
        setCharges([newItem, ...charges]);
      }
      setShowChargeFormPage(false);
    } else if (currentTab === 'terms') {
      const payload = {
        ...formData,
        createdBy: 'TRANSCORE LOGISTICS'
      };
      if (editingItem) {
        setTerms(terms.map(x => x._id === editingItem._id ? { ...x, ...payload } : x));
      } else {
        const newItem = { _id: `t_new_${Date.now()}`, ...payload };
        setTerms([newItem, ...terms]);
      }
      setShowTermsFormPage(false);
    } else {
      // Local list CRUD simulator for remaining simple modules
      const mapFn = (arr) => arr.map(x => x._id === editingItem._id ? { ...x, ...formData } : x);
      if (editingItem) {
        if (currentTab === 'charges') setCharges(mapFn(charges));
        if (currentTab === 'terms') setTerms(mapFn(terms));
      } else {
        const newItem = { 
          _id: Math.random().toString(), 
          ...formData,
          createdBy: 'TRANSCORE LOGISTICS'
        };
        if (currentTab === 'charges') setCharges([...charges, newItem]);
        if (currentTab === 'terms') setTerms([...terms, newItem]);
      }
      setModalOpen(false);
    }
  };

  const handleDeleteItem = (id) => {
    if (currentTab === 'parties') {
      setPartiesList(partiesList.filter(x => x._id !== id));
      onDeleteMaster('customers', id);
    } else if (currentTab === 'trucks') {
      if (truckTab === 'own') {
        setOwnTrucks(ownTrucks.filter(x => x._id !== id));
      } else {
        setMarketTrucks(marketTrucks.filter(x => x._id !== id));
      }
      onDeleteMaster('vehicles', id);
    } else if (currentTab === 'suppliers') {
      setSuppliersList(suppliersList.filter(x => x._id !== id));
    } else if (currentTab === 'employees') {
      setEmployeesList(employeesList.filter(x => x._id !== id));
    } else if (currentTab === 'items') {
      setItemsList(itemsList.filter(x => x._id !== id));
    } else {
      if (currentTab === 'charges') setCharges(charges.filter(x => x._id !== id));
      if (currentTab === 'terms') setTerms(terms.filter(x => x._id !== id));
    }
  };

  // --- Filtering ---
  const getFilteredItems = () => {
    const q = searchQuery.toLowerCase();
    if (currentTab === 'parties') return partiesList.filter(x => x.name.toLowerCase().includes(q) || x.city.toLowerCase().includes(q));
    if (currentTab === 'trucks') {
      const activeList = truckTab === 'own' ? ownTrucks : marketTrucks;
      return activeList.filter(x => x.vehicleNumber.toLowerCase().includes(q) || (x.driverName || '').toLowerCase().includes(q) || (x.supplierName || '').toLowerCase().includes(q));
    }
    if (currentTab === 'suppliers') return suppliersList.filter(x => x.name.toLowerCase().includes(q) || (x.city || '').toLowerCase().includes(q));
    if (currentTab === 'employees') return employeesList.filter(x => x.name.toLowerCase().includes(q) || (x.designation || '').toLowerCase().includes(q));
    if (currentTab === 'items') return itemsList.filter(x => x.name.toLowerCase().includes(q) || (x.hsnCode || '').toLowerCase().includes(q));
    if (currentTab === 'charges') return charges.filter(x => x.name.toLowerCase().includes(q));
    if (currentTab === 'terms') return terms.filter(x => (x.text || '').toLowerCase().includes(q));
    return [];
  };

  const filteredItems = getFilteredItems();

  const tabsList = [
    { id: 'master-party', label: 'Party List' },
    { id: 'master-truck', label: 'Truck List' },
    { id: 'master-supplier', label: 'Supplier List' },
    { id: 'master-employee', label: 'Employee List' },
    { id: 'master-item', label: 'Item List' },
    { id: 'master-charge', label: 'Charge List' },
    { id: 'master-terms', label: 'Terms & Condition List' }
  ];

  // Excel & Print action mocks
  const handleExportExcel = () => {
    alert(`📊 Exporting current master directory collection to Excel spreadsheet!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToTabList = () => {
    setShowPartyFormPage(false);
    setShowTruckFormPage(false);
    setShowSupplierFormPage(false);
    setShowEmployeeFormPage(false);
    setShowItemFormPage(false);
    setShowChargeFormPage(false);
    setShowTermsFormPage(false);
    setEditingItem(null);
  };

  // --- Rendering Breadcrumbs ---
  const renderBreadcrumbs = () => {
    const activeLabel = tabsList.find(x => x.id === activePage)?.label || 'Party List';
    const handleGoHome = () => {
      handleBackToTabList();
      if (setActivePage) setActivePage('dashboard');
    };
    const handleGoMasters = () => {
      handleBackToTabList();
    };

    if (currentTab === 'parties' && showPartyFormPage) {
      return (
        <div style={styles.breadcrumbs}>
          <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={handleGoHome} />
          <span style={{ cursor: 'pointer' }} onClick={handleGoHome}>Home</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={handleGoMasters}>Masters</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={styles.breadcrumbActive}>{editingItem ? 'Edit Party' : 'Add New Party'}</span>
        </div>
      );
    }
    if (currentTab === 'trucks' && showTruckFormPage) {
      return (
        <div style={styles.breadcrumbs}>
          <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={handleGoHome} />
          <span style={{ cursor: 'pointer' }} onClick={handleGoHome}>Home</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={handleGoMasters}>Masters</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={styles.breadcrumbActive}>{editingItem ? 'Edit Truck' : 'Add New Truck'}</span>
        </div>
      );
    }
    if (currentTab === 'suppliers' && showSupplierFormPage) {
      return (
        <div style={styles.breadcrumbs}>
          <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={handleGoHome} />
          <span style={{ cursor: 'pointer' }} onClick={handleGoHome}>Home</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={handleGoMasters}>Masters</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={styles.breadcrumbActive}>{editingItem ? 'Edit Supplier' : 'Add New Supplier'}</span>
        </div>
      );
    }
    if (currentTab === 'employees' && showEmployeeFormPage) {
      return (
        <div style={styles.breadcrumbs}>
          <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={handleGoHome} />
          <span style={{ cursor: 'pointer' }} onClick={handleGoHome}>Home</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={handleGoMasters}>Masters</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={styles.breadcrumbActive}>{editingItem ? 'Edit Employee' : 'Add New Employee'}</span>
        </div>
      );
    }
    if (currentTab === 'items' && showItemFormPage) {
      return (
        <div style={styles.breadcrumbs}>
          <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={handleGoHome} />
          <span style={{ cursor: 'pointer' }} onClick={handleGoHome}>Home</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={handleGoMasters}>Masters</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={styles.breadcrumbActive}>{editingItem ? 'Edit Item' : 'Add New Item'}</span>
        </div>
      );
    }
    if (currentTab === 'charges' && showChargeFormPage) {
      return (
        <div style={styles.breadcrumbs}>
          <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={handleGoHome} />
          <span style={{ cursor: 'pointer' }} onClick={handleGoHome}>Home</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={handleGoMasters}>Masters</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={styles.breadcrumbActive}>{editingItem ? 'Edit Charge' : 'Add New Charge'}</span>
        </div>
      );
    }
    if (currentTab === 'terms' && showTermsFormPage) {
      return (
        <div style={styles.breadcrumbs}>
          <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={handleGoHome} />
          <span style={{ cursor: 'pointer' }} onClick={handleGoHome}>Home</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={handleGoMasters}>Masters</span>
          <span style={styles.breadcrumbSeparator}>&gt;</span>
          <span style={styles.breadcrumbActive}>{editingItem ? 'Edit Terms & Condition' : 'Add New TnC'}</span>
        </div>
      );
    }
    return (
      <div style={styles.breadcrumbs}>
        <Home size={14} style={{ marginRight: '4px', cursor: 'pointer' }} onClick={handleGoHome} />
        <span style={{ cursor: 'pointer' }} onClick={handleGoHome}>Home</span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={{ cursor: 'pointer' }} onClick={handleGoMasters}>Masters</span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>{activeLabel}</span>
      </div>
    );
  };

  // --- RENDERING PARTY FORM PAGE (Screenshot 24) ---
  if (currentTab === 'parties' && showPartyFormPage) {
    return (
      <div style={styles.container}>
        {renderBreadcrumbs()}

        <div style={styles.header}>
          <h2 style={styles.title}>Party Form</h2>
          <button 
            style={styles.backToListBtn} 
            onClick={() => {
              setShowPartyFormPage(false);
              setEditingItem(null);
            }}
          >
            Party List
          </button>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGridPage}>
              <div style={styles.formGroupPage}>
                <label style={styles.formLabelPage}>Party Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Company Name"
                  style={styles.formInputPage}
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Contact Number</label>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    style={styles.formInputPage}
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="GSTIN"
                    style={styles.formInputPage}
                    value={formData.gstin || ''}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.formGroupPage}>
                <label style={styles.formLabelPage}>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  style={styles.formInputPage}
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div style={styles.formGroupPage}>
                <label style={styles.formLabelPage}>Address *</label>
                <textarea
                  required
                  placeholder="Address"
                  style={styles.formTextareaPage}
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value, city: e.target.value.split(' ')[0] || 'Dahej' })}
                />
              </div>
            </div>

            <div style={styles.greenButtonContainer}>
              <button type="submit" style={styles.greenActionBtn}>
                {editingItem ? 'Update Party Details' : 'Add Party Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERING TRUCK FORM PAGE (Screenshot 2 & 4) ---
  if (currentTab === 'trucks' && showTruckFormPage) {
    return (
      <div style={styles.container}>
        {renderBreadcrumbs()}

        <div style={styles.header}>
          <h2 style={styles.title}>Truck Form</h2>
          <button 
            style={styles.backToListBtn} 
            onClick={() => {
              setShowTruckFormPage(false);
              setEditingItem(null);
            }}
          >
            Truck List
          </button>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGridPage}>
              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Vehicle Type :</label>
                  <div style={styles.radioTogglesRow}>
                    <label style={styles.radioToggleItem}>
                      <input 
                        type="radio" 
                        name="vType" 
                        checked={vehicleType === 'own'}
                        onChange={() => setVehicleType('own')}
                        style={styles.radioInputStyle}
                      />
                      <span>Own Truck</span>
                    </label>
                    <label style={{ ...styles.radioToggleItem, marginLeft: '24px' }}>
                      <input 
                        type="radio" 
                        name="vType" 
                        checked={vehicleType === 'market'}
                        onChange={() => setVehicleType('market')}
                        style={styles.radioInputStyle}
                      />
                      <span>Market Truck</span>
                    </label>
                  </div>
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Vehicle Number *</label>
                  <div style={styles.quadInputRow}>
                    <input 
                      type="text" 
                      maxLength="2" 
                      placeholder="XX"
                      style={styles.quadInputBox}
                      value={vNumPart1}
                      onChange={(e) => setVNumPart1(e.target.value.toUpperCase())}
                      required
                    />
                    <input 
                      type="text" 
                      maxLength="2" 
                      placeholder="XX"
                      style={styles.quadInputBox}
                      value={vNumPart2}
                      onChange={(e) => setVNumPart2(e.target.value.toUpperCase())}
                      required
                    />
                    <input 
                      type="text" 
                      maxLength="2" 
                      placeholder="XX"
                      style={styles.quadInputBox}
                      value={vNumPart3}
                      onChange={(e) => setVNumPart3(e.target.value.toUpperCase())}
                      required
                    />
                    <input 
                      type="text" 
                      maxLength="4" 
                      placeholder="XXXX"
                      style={{ ...styles.quadInputBox, flex: 2 }}
                      value={vNumPart4}
                      onChange={(e) => setVNumPart4(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>
              </div>

              {vehicleType === 'market' && (
                <>
                  <div style={styles.formGridRowPage}>
                    <div style={{ ...styles.formGroupPage, flex: 1 }}>
                      <label style={styles.formLabelPage}>Engine Number</label>
                      <input
                        type="text"
                        placeholder="Engine Number"
                        style={styles.formInputPage}
                        value={formData.engineNumber || ''}
                        onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                      />
                    </div>
                    <div style={{ ...styles.formGroupPage, flex: 1 }}>
                      <label style={styles.formLabelPage}>Chassis Number</label>
                      <input
                        type="text"
                        placeholder="Chassis Number"
                        style={styles.formInputPage}
                        value={formData.chassisNumber || ''}
                        onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={styles.formGridRowPage}>
                    <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                      <label style={styles.formLabelPage}>Supplier Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Supplier Name"
                        style={styles.formInputPage}
                        value={formData.supplierName || ''}
                        onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                      />
                    </div>
                    <div style={{ ...styles.formGroupPage, flex: 1 }}>
                      <label style={styles.formLabelPage}>Supplier Mobile Number</label>
                      <input
                        type="text"
                        placeholder="Supplier Mobile Number"
                        style={styles.formInputPage}
                        value={formData.supplierMobile || ''}
                        onChange={(e) => setFormData({ ...formData, supplierMobile: e.target.value })}
                      />
                    </div>
                    <div style={{ ...styles.formGroupPage, flex: 1 }}>
                      <label style={styles.formLabelPage}>Supplier PAN Number</label>
                      <input
                        type="text"
                        placeholder="Supplier PAN Number"
                        style={styles.formInputPage}
                        value={formData.supplierPan || ''}
                        onChange={(e) => setFormData({ ...formData, supplierPan: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={styles.formGroupPage}>
                    <label style={styles.formLabelPage}>Supplier Address</label>
                    <textarea
                      placeholder="Supplier Address"
                      style={styles.formTextareaPage}
                      value={formData.supplierAddress || ''}
                      onChange={(e) => setFormData({ ...formData, supplierAddress: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Driver Name</label>
                  <input
                    type="text"
                    placeholder="Driver Name"
                    style={styles.formInputPage}
                    value={formData.driverName || ''}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Driver Mobile Number</label>
                  <input
                    type="text"
                    placeholder="Driver Mobile Number"
                    style={styles.formInputPage}
                    value={formData.driverMobile || ''}
                    onChange={(e) => setFormData({ ...formData, driverMobile: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Driver DL Number</label>
                  <input
                    type="text"
                    placeholder="Driver DL Number"
                    style={styles.formInputPage}
                    value={formData.dlNumber || ''}
                    onChange={(e) => setFormData({ ...formData, dlNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div style={styles.greenButtonContainer}>
              <button type="submit" style={styles.greenActionBtn}>
                {editingItem ? 'Update Vehicle Details' : 'Add Vehicle Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERING SUPPLIER FORM PAGE (Screenshot 1) ---
  if (currentTab === 'suppliers' && showSupplierFormPage) {
    return (
      <div style={styles.container}>
        {renderBreadcrumbs()}

        <div style={styles.header}>
          <h2 style={styles.title}>Supplier Form</h2>
          <button 
            style={styles.backToListBtn} 
            onClick={() => {
              setShowSupplierFormPage(false);
              setEditingItem(null);
            }}
          >
            Supplier List
          </button>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGridPage}>
              <div style={styles.formGroupPage}>
                <label style={styles.formLabelPage}>Supplier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Supplier Name"
                  style={styles.formInputPage}
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Contact Number</label>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    style={styles.formInputPage}
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Supplier PAN Number</label>
                  <input
                    type="text"
                    placeholder="Supplier PAN Number"
                    style={styles.formInputPage}
                    value={formData.gstin || ''}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.formGroupPage}>
                <label style={styles.formLabelPage}>Supplier Address</label>
                <textarea
                  required
                  placeholder="Address"
                  style={styles.formTextareaPage}
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div style={styles.greenButtonContainer}>
              <button type="submit" style={styles.greenActionBtn}>
                {editingItem ? 'Update Supplier Details' : 'Add Supplier Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERING EMPLOYEE FORM PAGE (Screenshot 3) ---
  if (currentTab === 'employees' && showEmployeeFormPage) {
    return (
      <div style={styles.container}>
        {renderBreadcrumbs()}

        <div style={styles.header}>
          <h2 style={styles.title}>Employee Form</h2>
          <button 
            style={styles.backToListBtn} 
            onClick={() => {
              setShowEmployeeFormPage(false);
              setEditingItem(null);
            }}
          >
            Employee List
          </button>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGridPage}>
              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Employee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Employee Name"
                    style={styles.formInputPage}
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mobile Number"
                    style={styles.formInputPage}
                    value={formData.mobile || ''}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="Designation"
                    style={styles.formInputPage}
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
              </div>

              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Monthly Salary *</label>
                  <input
                    type="number"
                    required
                    placeholder="Monthly Salary"
                    style={styles.formInputPage}
                    value={formData.salary || ''}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                  <label style={styles.formLabelPage}>Aadhar No.</label>
                  <input
                    type="text"
                    placeholder="Enter Aadhar No."
                    style={styles.formInputPage}
                    value={formData.aadhar || ''}
                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                  <label style={styles.formLabelPage}>Driving Licence (DL) No.</label>
                  <input
                    type="text"
                    placeholder="Enter DL No."
                    style={styles.formInputPage}
                    value={formData.license || ''}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  />
                </div>
              </div>

              {/* Bank KYC sub fields consolidated into 4 columns */}
              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Bank Name</label>
                  <input
                    type="text"
                    placeholder="Enter Bank Name"
                    style={styles.formInputPage}
                    value={formData.bankName || ''}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Enter Account Holder Name"
                    style={styles.formInputPage}
                    value={formData.bankHolder || ''}
                    onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Account No.</label>
                  <input
                    type="text"
                    placeholder="Enter Account No."
                    style={styles.formInputPage}
                    value={formData.bankAccount || ''}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  />
                </div>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>IFSC</label>
                  <input
                    type="text"
                    placeholder="Enter IFSC"
                    style={styles.formInputPage}
                    value={formData.bankIfsc || ''}
                    onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                  />
                </div>
              </div>

              {/* Status and IsDriver toggle */}
              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Status</label>
                  <select
                    className="form-control"
                    value={formData.status || 'Enable'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ height: '38px' }}
                  >
                    <option value="Enable">Enable</option>
                    <option value="Disable">Disable</option>
                  </select>
                </div>
                <div style={{ ...styles.formGroupPage, flex: 1, justifyContent: 'center' }}>
                  <label style={styles.checkboxWrapperLabel}>
                    <input 
                      type="checkbox"
                      checked={formData.isDriver || false}
                      onChange={(e) => setFormData({ ...formData, isDriver: e.target.checked })}
                      style={styles.checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Is Driver</span>
                  </label>
                </div>
              </div>
            </div>

            <div style={styles.greenButtonContainer}>
              <button type="submit" style={styles.greenActionBtn}>
                {editingItem ? 'Update Employee Details' : 'Add Employee Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERING ITEM FORM PAGE (Screenshot 5) ---
  if (currentTab === 'items' && showItemFormPage) {
    return (
      <div style={styles.container}>
        {renderBreadcrumbs()}

        <div style={styles.header}>
          <h2 style={styles.title}>Item Form</h2>
          <button 
            style={styles.backToListBtn} 
            onClick={() => {
              setShowItemFormPage(false);
              setEditingItem(null);
            }}
          >
            Item List
          </button>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGridPage}>
              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Item Name"
                    style={styles.formInputPage}
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1.2 }}>
                  <label style={styles.formLabelPage}>HSN Code</label>
                  <input
                    type="text"
                    placeholder="Enter HSN Code"
                    style={styles.formInputPage}
                    value={formData.hsnCode || ''}
                    onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Status</label>
                  <select
                    className="form-control"
                    value={formData.status || 'Enable'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ height: '38px' }}
                  >
                    <option value="Enable">Enable</option>
                    <option value="Disable">Disable</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.greenButtonContainer}>
              <button type="submit" style={styles.greenActionBtn}>
                {editingItem ? 'Update Item Details' : 'Add Item Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERING CHARGE FORM PAGE (Screenshot 2) ---
  if (currentTab === 'charges' && showChargeFormPage) {
    return (
      <div style={styles.container}>
        {renderBreadcrumbs()}

        <div style={styles.header}>
          <h2 style={styles.title}>Charge Form</h2>
          <button 
            style={styles.backToListBtn} 
            onClick={() => {
              setShowChargeFormPage(false);
              setEditingItem(null);
            }}
          >
            Charge List
          </button>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGridPage}>
              <div style={styles.formGridRowPage}>
                <div style={{ ...styles.formGroupPage, flex: 1.5 }}>
                  <label style={styles.formLabelPage}>Charge Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Charge Name"
                    style={styles.formInputPage}
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ ...styles.formGroupPage, flex: 1 }}>
                  <label style={styles.formLabelPage}>Status</label>
                  <select
                    className="form-control"
                    value={formData.status || 'Enable'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ height: '38px' }}
                  >
                    <option value="Enable">Enable</option>
                    <option value="Disable">Disable</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.greenButtonContainer}>
              <button type="submit" style={styles.greenActionBtn}>
                {editingItem ? 'Update Charge Details' : 'Add Charge Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERING TERMS & CONDITION FORM PAGE (Screenshot 5) ---
  if (currentTab === 'terms' && showTermsFormPage) {
    return (
      <div style={styles.container}>
        {renderBreadcrumbs()}

        <div style={styles.header}>
          <h2 style={styles.title}>Terms & Condition Form</h2>
          <button 
            style={styles.backToListBtn} 
            onClick={() => {
              setShowTermsFormPage(false);
              setEditingItem(null);
            }}
          >
            Terms & Condition List
          </button>
        </div>

        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGridPage}>
              <div style={styles.formGroupPage}>
                <label style={styles.formLabelPage}>Description *</label>
                <textarea
                  required
                  placeholder="Enter Description"
                  style={{ ...styles.formTextareaPage, height: '120px' }}
                  value={formData.text || ''}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                />
              </div>
            </div>

            <div style={styles.greenButtonContainer}>
              <button type="submit" style={styles.greenActionBtn}>
                {editingItem ? 'Update TnC Details' : 'Add TnC Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- STANDARD DIRECTORY VIEWS ---
  return (
    <div style={styles.container}>
      {/* Dynamic Style Injection for high-fidelity direct browser printing of Masters directories */}
      <style>{`
        @media print {
          /* Hide dashboard sidebar and header UI completely */
          aside, header, nav, .sidebar, .sidebar-container, .top-header, .header-navbar, button, .btn, [style*="sidebar"], [style*="Sidebar"], .addButton, .addBtn, [style*="addBtn"] {
            display: none !important;
          }
          
          /* Ensure the body and container are completely expanded */
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
          }
          
          /* Hide breadcrumbs, tab selection bars, sub-tabs, and controlsRow */
          div[style*="breadcrumbs"], div[style*="tabsRow"], div[style*="controlsRow"], div[style*="subTabsRow"] {
            display: none !important;
          }
          
          /* Style the main card to print fully */
          div[style*="mainCard"], div[style*="card"] {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Make table perfect A4 width */
          table, .custom-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #cbd5e1 !important;
            padding: 8px !important;
            font-size: 0.75rem !important;
          }
          tr {
            page-break-inside: avoid !important;
          }
          
          /* Hide action columns in print */
          th:last-child, td:last-child {
            display: none !important;
          }
        }
      `}</style>
      {renderBreadcrumbs()}

      {/* Main card panel */}
      <div style={styles.mainCard}>
        {/* Title row */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {currentTab === 'parties' && `Party List ( ${partiesList.length} )`}
            {currentTab === 'trucks' && `Truck List ( ${ownTrucks.length + marketTrucks.length} )`}
            {currentTab === 'suppliers' && `Supplier List ( ${suppliersList.length} )`}
            {currentTab === 'employees' && `Employee List ( ${employeesList.length} )`}
            {currentTab === 'items' && `Item List ( ${itemsList.length} )`}
            {currentTab === 'charges' && `Charge List ( ${charges.length} )`}
            {currentTab === 'terms' && `Terms & Condition List (For Bilty PDF) ( ${terms.length} )`}
          </h2>
          <button style={styles.addBtn} onClick={handleOpenAdd}>
            <Plus size={16} />
            {currentTab === 'parties' ? 'Add New Party' : currentTab === 'trucks' ? 'Add New Truck' : currentTab === 'suppliers' ? 'Add New Supplier' : currentTab === 'employees' ? 'Add New Employee' : currentTab === 'items' ? 'Add New Item' : currentTab === 'charges' ? 'Add New Charge' : currentTab === 'terms' ? 'Add New Terms & Condition' : `Add New ${tabsList.find(x => x.id === activePage)?.label.replace(' List', '')}`}
          </button>
        </div>

        {/* Tab row navigation */}
        <div style={styles.tabsRow}>
          {tabsList.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tabBtn,
                ...(activePage === tab.id ? styles.tabBtnActive : {})
              }}
              onClick={() => {
                setActivePage(tab.id);
                setSearchQuery('');
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sub-tabs pills only for Truck list (Screenshot 25) */}
        {currentTab === 'trucks' && (
          <div style={styles.subTabsRow}>
            <button 
              style={{
                ...styles.subTabBtn,
                ...(truckTab === 'own' ? styles.subTabBtnActive : {})
              }}
              onClick={() => setTruckTab('own')}
            >
              Own Truck
            </button>
            <button 
              style={{
                ...styles.subTabBtn,
                ...(truckTab === 'market' ? styles.subTabBtnActive : {})
              }}
              onClick={() => setTruckTab('market')}
            >
              Market Truck
            </button>
          </div>
        )}

        {/* Action controls row (Excel, Print, Search) */}
        <div style={styles.controlsRow}>
          <div style={styles.excelPrintGroup}>
            <button style={styles.excelBtn} onClick={handleExportExcel}>
              <Download size={14} style={{ marginRight: '6px' }} />
              Excel
            </button>
            <button style={styles.printBtn} onClick={handlePrint}>
              <Printer size={14} style={{ marginRight: '6px' }} />
              Print
            </button>
          </div>

          <div style={styles.searchGroup}>
            <span style={styles.searchLabel}>Search:</span>
            <input 
              type="text" 
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table view */}
        <div className="table-container">
          {currentTab === 'parties' && (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>SNo.</th>
                  <th>Party Name</th>
                  <th>GST No.</th>
                  <th>Mobile No.</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Created By</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((c, idx) => (
                  <tr key={c._id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: '700', color: '#1e293b' }}>{c.name}</td>
                    <td style={{ fontWeight: '600' }}>{c.gstin || ''}</td>
                    <td>{c.phone || ''}</td>
                    <td>{c.email || ''}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.address}</td>
                    <td style={{ fontWeight: '600', color: '#475569' }}>{c.createdBy || 'TRANSCORE LOGISTICS'}</td>
                    <td>
                      <div style={styles.actionBtnGroup}>
                        <button style={styles.actionEditBtn} onClick={() => handleOpenEdit(c)}>
                          <Edit2 size={12} />
                        </button>
                        <button style={styles.actionDeleteBtn} onClick={() => handleDeleteItem(c._id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === 'trucks' && (
            <table className="custom-table">
              <thead>
                {truckTab === 'own' ? (
                  <tr>
                    <th style={{ width: '60px' }}>SNo.</th>
                    <th>Vehicle Number</th>
                    <th>Driver Name</th>
                    <th>Driver Mobile</th>
                    <th>DL Number</th>
                    <th>Created By</th>
                    <th style={{ width: '100px' }}>Action</th>
                  </tr>
                ) : (
                  <tr>
                    <th style={{ width: '50px' }}>SNo.</th>
                    <th>Supplier Name</th>
                    <th>Supplier Mobile Number</th>
                    <th>Supplier PAN Number</th>
                    <th>Vehicle Number</th>
                    <th>Engine Number</th>
                    <th>Chassis Number</th>
                    <th>Driver Name</th>
                    <th>Driver Mobile</th>
                    <th>DL Number</th>
                    <th>Created By</th>
                    <th style={{ width: '90px' }}>Action</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={truckTab === 'own' ? "7" : "12"} style={styles.emptyStateRow}>
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((v, idx) => (
                    <tr key={v._id}>
                      <td>{idx + 1}</td>
                      {truckTab === 'market' && (
                        <>
                          <td style={{ fontWeight: '700' }}>{v.supplierName || 'N/A'}</td>
                          <td>{v.supplierMobile || 'N/A'}</td>
                          <td><code>{v.supplierPan || 'N/A'}</code></td>
                        </>
                      )}
                      <td style={{ fontWeight: '700', color: '#0066cc' }}>{v.vehicleNumber}</td>
                      {truckTab === 'market' && (
                        <>
                          <td>{v.engineNumber || ''}</td>
                          <td>{v.chassisNumber || ''}</td>
                        </>
                      )}
                      <td>{v.driverName || 'N/A'}</td>
                      <td>{v.driverMobile || 'N/A'}</td>
                      <td><code>{v.dlNumber || 'N/A'}</code></td>
                      <td style={{ fontWeight: '600' }}>{v.createdBy || 'TRANSCORE LOGISTICS'}</td>
                      <td>
                        <div style={styles.actionBtnGroup}>
                          <button style={styles.actionEditBtn} onClick={() => handleOpenEdit(v)}>
                            <Edit2 size={12} />
                          </button>
                          <button style={styles.actionDeleteBtn} onClick={() => handleDeleteItem(v._id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {currentTab === 'suppliers' && (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>SNo.</th>
                  <th>Supplier Name</th>
                  <th>Mobile No.</th>
                  <th>PAN No.</th>
                  <th>Address</th>
                  <th>Created By</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((s, idx) => (
                  <tr key={s._id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: '700' }}>{s.name}</td>
                    <td>{s.phone}</td>
                    <td><code>{s.gstin || ''}</code></td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.address}</td>
                    <td style={{ fontWeight: '600' }}>{s.createdBy || 'TRANSCORE LOGISTICS'}</td>
                    <td>
                      <div style={styles.actionBtnGroup}>
                        <button style={styles.actionEditBtn} onClick={() => handleOpenEdit(s)}><Edit2 size={12} /></button>
                        <button style={styles.actionDeleteBtn} onClick={() => handleDeleteItem(s._id)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {currentTab === 'employees' && (
            <table className="custom-table">
              <thead>
                {/* Columns matched exactly to Screenshot 2 */}
                <tr>
                  <th style={{ width: '60px' }}>Sno.</th>
                  <th>Employee Name</th>
                  <th>Mobile No.</th>
                  <th>Designation</th>
                  <th>Is Driver</th>
                  <th>Monthly Salary</th>
                  <th>Status</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={styles.emptyStateRow}>
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((emp, idx) => (
                    <tr key={emp._id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: '700' }}>{emp.name}</td>
                      <td>{emp.mobile}</td>
                      <td style={{ fontWeight: '600', color: '#475569' }}>{emp.designation || 'N/A'}</td>
                      <td>
                        <span style={{ 
                          ...styles.typeBadge, 
                          backgroundColor: emp.isDriver ? '#d1fae5' : '#f1f5f9', 
                          color: emp.isDriver ? '#065f46' : '#475569' 
                        }}>
                          {emp.isDriver ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700' }}>₹{emp.salary}</td>
                      <td>
                        <span style={{ 
                          ...styles.typeBadge, 
                          backgroundColor: emp.status === 'Enable' ? '#d1fae5' : '#fee2e2', 
                          color: emp.status === 'Enable' ? '#065f46' : '#c5221f' 
                        }}>
                          {emp.status || 'Enable'}
                        </span>
                      </td>
                      <td>
                        <div style={styles.actionBtnGroup}>
                          <button style={styles.actionEditBtn} onClick={() => handleOpenEdit(emp)}><Edit2 size={12} /></button>
                          <button style={styles.actionDeleteBtn} onClick={() => handleDeleteItem(emp._id)}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {currentTab === 'items' && (
            <table className="custom-table">
              <thead>
                {/* Columns matched exactly to Screenshot 4 */}
                <tr>
                  <th style={{ width: '60px' }}>S.No.</th>
                  <th>Item Name</th>
                  <th>HSN Code</th>
                  <th>Status</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyStateRow}>
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => (
                    <tr key={item._id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: '700' }}>{item.name}</td>
                      <td><code>{item.hsnCode || 'N/A'}</code></td>
                      <td>
                        <span style={{ 
                          ...styles.typeBadge, 
                          backgroundColor: item.status === 'Enable' ? '#d1fae5' : '#fee2e2', 
                          color: item.status === 'Enable' ? '#065f46' : '#c5221f' 
                        }}>
                          {item.status || 'Enable'}
                        </span>
                      </td>
                      <td>
                        <div style={styles.actionBtnGroup}>
                          <button style={styles.actionEditBtn} onClick={() => handleOpenEdit(item)}><Edit2 size={12} /></button>
                          <button style={styles.actionDeleteBtn} onClick={() => handleDeleteItem(item._id)}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {currentTab === 'charges' && (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>S.No.</th>
                  <th>Charge Name</th>
                  <th>Status</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={styles.emptyStateRow}>
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((ch, idx) => (
                    <tr key={ch._id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: '700' }}>{ch.name}</td>
                      <td style={{ 
                        fontWeight: 'bold', 
                        color: ch.status === 'Enable' ? '#00b050' : '#ef4444' 
                      }}>
                        {ch.status || 'Enable'}
                      </td>
                      <td>
                        <div style={styles.actionBtnGroup}>
                          <button style={styles.actionEditBtn} onClick={() => handleOpenEdit(ch)}><Edit2 size={12} /></button>
                          <button style={styles.actionDeleteBtn} onClick={() => handleDeleteItem(ch._id)}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {currentTab === 'terms' && (
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>S.No.</th>
                  <th>Description</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Show/Hide in PDF</th>
                  <th style={{ width: '100px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={styles.emptyStateRow}>
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((term, idx) => (
                    <tr key={term._id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: '1.5' }}>{term.text}</td>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox"
                          checked={term.showInPdf !== false}
                          onChange={() => handleToggleTnCPdf(term._id)}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                      </td>
                      <td>
                        <div style={styles.actionBtnGroup}>
                          <button style={styles.actionEditBtn} onClick={() => handleOpenEdit(term)}><Edit2 size={12} /></button>
                          <button style={styles.actionDeleteBtn} onClick={() => handleDeleteItem(term._id)}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CRUD Overlays Popup Modals for remaining simple tabs (Charges & Terms) */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '24px' }}>
            <h3 style={styles.modalTitle}>
              {editingItem ? 'Edit' : 'Create'} {tabsList.find(x => x.id === activePage)?.label.replace(' List', '')}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {currentTab === 'charges' && (
                  <>
                    <div className="form-group">
                      <label>Charge Particular Name *</label>
                      <input
                        type="text" required className="form-control"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Standard Charge Value (₹) *</label>
                      <input
                        type="number" required className="form-control"
                        value={formData.amount || 0}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Charge Classification *</label>
                      <select
                        className="form-control" required
                        value={formData.type || 'Addition'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="Addition">Addition (Add to Freight bills)</option>
                        <option value="Deduction">Deduction (Subtract driver advance)</option>
                      </select>
                    </div>
                  </>
                )}

                {currentTab === 'terms' && (
                  <>
                    <div className="form-group">
                      <label>Terms Title *</label>
                      <input
                        type="text" required className="form-control"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Document Scope *</label>
                      <select
                        className="form-control" required
                        value={formData.scope || 'Bilty'}
                        onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      >
                        <option value="Bilty">Lorry Receipt (Bilty)</option>
                        <option value="Invoice">GST Invoice</option>
                        <option value="Chalan">Hire Chalan</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Terms & Conditions Clause Text *</label>
                      <textarea
                        required className="form-control" style={{ resize: 'none', height: '100px' }}
                        value={formData.text || ''}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div style={styles.modalActions}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#64748b'
  },
  breadcrumbSeparator: {
    color: '#94a3b8'
  },
  breadcrumbActive: {
    color: '#0f172a',
    fontWeight: '700'
  },
  mainCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a'
  },
  addBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s'
  },
  backToListBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tabsRow: {
    display: 'flex',
    borderBottom: '2px solid #cbd5e1',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '2px',
    marginBottom: '20px'
  },
  tabBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    color: '#64748b',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '-2px',
    whiteSpace: 'nowrap'
  },
  tabBtnActive: {
    color: '#0066cc',
    borderBottomColor: '#0066cc'
  },
  subTabsRow: {
    display: 'flex',
    background: '#f1f5f9',
    padding: '4px',
    borderRadius: '6px',
    gap: '4px',
    width: 'fit-content',
    marginBottom: '20px',
    border: '1px solid #e2e8f0'
  },
  subTabBtn: {
    padding: '6px 16px',
    fontWeight: '700',
    fontSize: '0.8rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  subTabBtnActive: {
    backgroundColor: '#ffffff',
    color: '#0066cc',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  excelPrintGroup: {
    display: 'flex',
    gap: '8px'
  },
  excelBtn: {
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.8rem',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  printBtn: {
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.8rem',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  searchLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#334155'
  },
  searchInput: {
    border: '1px solid #cbd5e1',
    padding: '6px 12px',
    borderRadius: '4px',
    outline: 'none',
    width: '180px',
    fontSize: '0.85rem'
  },
  actionBtnGroup: {
    display: 'flex',
    gap: '6px'
  },
  actionEditBtn: {
    backgroundColor: '#e6f4ea',
    color: '#137333',
    border: '1px solid #ceead6',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  actionDeleteBtn: {
    backgroundColor: '#fce8e6',
    color: '#c5221f',
    border: '1px solid #fad2cf',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  emptyStateRow: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  roleBadge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  typeBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  scopeTag: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#374151',
    backgroundColor: '#e5e7eb',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  modalTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#0f172a',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '8px'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px'
  },

  // --- Dedicated Page Form Styles ---
  formCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
    maxWidth: '850px',
    margin: '0 auto'
  },
  formGridPage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroupPage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  formGridRowPage: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  formLabelPage: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#334155'
  },
  formInputPage: {
    padding: '10px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    fontFamily: "'Inter', sans-serif"
  },
  formTextareaPage: {
    padding: '10px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    height: '100px',
    resize: 'none',
    fontFamily: "'Inter', sans-serif"
  },
  greenButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px'
  },
  greenActionBtn: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '700',
    padding: '12px 64px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 176, 80, 0.2)',
    transition: 'background-color 0.2s',
    outline: 'none'
  },

  // --- Quad input & Radio custom styles ---
  radioTogglesRow: {
    display: 'flex',
    alignItems: 'center',
    height: '38px'
  },
  radioToggleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer'
  },
  radioInputStyle: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  quadInputRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    width: '100%'
  },
  quadInputBox: {
    flex: 1,
    padding: '10px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.875rem',
    textAlign: 'center',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    textTransform: 'uppercase'
  },
  checkboxWrapperLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    height: '38px',
    marginTop: '18px'
  },
  checkboxInputStyle: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  }
};
