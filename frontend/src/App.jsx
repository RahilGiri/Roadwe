import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Masters from './pages/Masters';
import Bilty from './pages/Bilty';
import LoadingSlip from './pages/LoadingSlip';
import Chalan from './pages/Chalan';
import Invoice from './pages/Invoice';
import Ledger from './pages/Ledger';
import Voucher from './pages/Voucher';
import SupplierAdvance from './pages/SupplierAdvance';
import Tracking from './pages/Tracking';
import Branch from './pages/Branch';
import Quotation from './pages/Quotation';
import SubUser from './pages/SubUser';
import CashBank from './pages/CashBank';
import MyDocuments from './pages/MyDocuments';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Accounts from './pages/Accounts';
import Reports from './pages/Reports';
import Subscription from './pages/Subscription';
import AllLedgerSummary from './pages/AllLedgerSummary';
import PartyReceivedPayment from './pages/PartyReceivedPayment';
import CommissionLedger from './pages/CommissionLedger';
import SupplierPaidPayment from './pages/SupplierPaidPayment';
import Letterhead from './pages/Letterhead';
import DeliverySlip from './pages/DeliverySlip';
import LandingPage from './pages/LandingPage';
import { Plus, Trash2, X, ShieldCheck, LogOut, RefreshCw } from 'lucide-react';

const API_BASE = '/api';

const seededSuppliers = [
  { name: 'SANDEEP KUMAR', phone: '9129918353', pan: 'KKRPK2121M', address: 'Kanpur Nagar, Uttar Pradesh' },
  { name: 'SHYAM JI MISHRA', phone: '8174076214', pan: 'AYFPS2020K', address: 'Jamshedpur Industrial Area, Jharkhand' },
  { name: 'DELHI GUJRAT FLEET CARRIER PVT LTD', phone: '6360843409', pan: 'DGFCP1070A', address: 'Sanjay Gandhi Transport Nagar, Delhi' },
  { name: 'LKO KANPUR GOODS CARRIERS', phone: '8924830532', pan: 'LKGCP3327B', address: 'Transport Nagar, Lucknow' },
  { name: 'LUCKNOW KANPUR ROADLINES', phone: '8423295286', pan: 'LKRLP9211C', address: 'Kanpur Bypass Road, Uttar Pradesh' },
  { name: 'RIZWAN SIDDIQUI', phone: '8957113583', pan: 'AYFPS2685A', address: 'G.T. Road, Kanpur' },
  { name: 'RAJU', phone: '7318172261', pan: 'CFNPR8308L', address: 'Unnao Industrial Estate, Uttar Pradesh' },
  { name: 'DIPAKKUMAR PRAJAPATI', phone: '8303932821', pan: 'BQJPP8558E', address: 'Mehsana Road, Gujarat' },
  { name: 'RAKESH PANDEY', phone: '8382877989', pan: 'RPPAN4876H', address: 'Varanasi Bypass, Uttar Pradesh' }
];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [activePage, setActivePage] = useState('dashboard');
  const [quickAddTarget, setQuickAddTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // --- Platform Super Admin & Impersonation States ---
  const [isAdminView, setIsAdminView] = useState(window.location.pathname === '/admin');
  const [isImpersonating, setIsImpersonating] = useState(!!sessionStorage.getItem('admin_token'));
  const [transporters, setTransporters] = useState([]);
  const [editingTransporter, setEditingTransporter] = useState(null);

  // Super Admin tab navigation state
  const [adminTab, setAdminTab] = useState('overview');

  // Pre-seeded Admin Logs & Alert feeds
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TKT-901', company: 'TRANSCORE LOGISTICS', category: 'Printer Alignment', subject: 'Kanpur Branch Bilty layout is slightly clipped on A4 thermal printer', status: 'Pending', priority: 'High', date: '2026-05-24' },
    { id: 'TKT-902', company: 'GUJARAT FREIGHT MOVERS', category: 'API Limit', subject: 'Need to lift limit on maximum drivers allowed in Free Trial', status: 'Resolved', priority: 'Medium', date: '2026-05-23' },
    { id: 'TKT-903', company: 'FASTTRACK CARGO', category: 'GPS Sync', subject: 'Truck MH-12-FT-8888 coordinates lagging by 10 minutes in Pune bypass', status: 'Pending', priority: 'Low', date: '2026-05-25' }
  ]);

  const [failedLogs, setFailedLogs] = useState([
    { timestamp: '07:22:15', method: 'POST', endpoint: '/api/masters/subusers', error: '400 Bad Request - Username already taken', ip: '192.168.1.15' },
    { timestamp: '06:10:48', method: 'GET', endpoint: '/api/documents/bilties/c123', error: '404 Not Found - Record deleted by owner', ip: '182.23.45.101' },
    { timestamp: '04:05:12', method: 'PUT', endpoint: '/api/admin/impersonate/t1', error: '403 Forbidden - Unauthorized Admin signature', ip: '192.168.1.8' }
  ]);

  const [gpsAlerts, setGpsAlerts] = useState([
    { time: '10 mins ago', vehicle: 'HR-55-MD-7777', alert: 'Route Deviation Alert (1.2 km off Gurugram-Kolkata segment)', status: 'Active' },
    { time: '45 mins ago', vehicle: 'MH-12-FT-8888', alert: 'Over-speeding Alert (88 km/h on NH-48 bypass)', status: 'Cleared' },
    { time: '2 hours ago', vehicle: 'DL-03-RL-5555', alert: 'Long Stoppage Alert (3.5 hours near highway dhaba)', status: 'Active' }
  ]);

  // Auth form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Registration form states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    const checkPath = () => {
      const isCurrentlyAdmin = window.location.pathname === '/admin';
      setIsAdminView(isCurrentlyAdmin);
      setEmail('');
      setPassword('');
    };
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  // Central Entity Databases
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [bilties, setBilties] = useState([]);
  const [slips, setSlips] = useState([]);
  const [chalans, setChalans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [supplierAdvances, setSupplierAdvances] = useState([]);

  // --- Global Settings States (with LocalStorage persistence) ---
  const [logoImg, setLogoImg] = useState(() => localStorage.getItem('settings_logoImg') || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="58" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="1"/><path d="M25,65 Q60,40 95,65" stroke="%23f59e0b" stroke-width="3" fill="none"/><path d="M20,70 Q60,45 100,70" stroke="%230f172a" stroke-width="3" fill="none"/><text x="60" y="55" font-family="Outfit" font-size="11" font-weight="900" fill="%230f172a" text-anchor="middle" letter-spacing="0.05em">TRANSCORE</text><text x="60" y="85" font-family="Inter" font-size="7" font-weight="700" fill="%23f59e0b" text-anchor="middle" letter-spacing="0.1em">LOGISTICS</text></svg>');
  const [stampImg, setStampImg] = useState(() => localStorage.getItem('settings_stampImg') || null);
  const [headingColor, setHeadingColor] = useState(() => localStorage.getItem('settings_headingColor') || '#000000');
  const [listDocBy, setListDocBy] = useState(() => localStorage.getItem('settings_listDocBy') || 'Document Date');
  const [showBiltyBank, setShowBiltyBank] = useState(() => localStorage.getItem('settings_showBiltyBank') === 'false' ? false : true);
  const [showLoadBank, setShowLoadBank] = useState(() => localStorage.getItem('settings_showLoadBank') === 'false' ? false : true);
  const [showInvoiceBank, setShowInvoiceBank] = useState(() => localStorage.getItem('settings_showInvoiceBank') === 'false' ? false : true);
  const [selectedBiltyFormat, setSelectedBiltyFormat] = useState(() => Number(localStorage.getItem('settings_selectedBiltyFormat')) || 1);
  const [selectedLoadingFormat, setSelectedLoadingFormat] = useState(() => Number(localStorage.getItem('settings_selectedLoadingFormat')) || 1);
  const [loadingBgColor, setLoadingBgColor] = useState(() => localStorage.getItem('settings_loadingBgColor') || '#ffffff');
  const [voucherBgColor, setVoucherBgColor] = useState(() => localStorage.getItem('settings_voucherBgColor') || '#ffffff');
  const [biltyMinDigits, setBiltyMinDigits] = useState(() => localStorage.getItem('settings_biltyMinDigits') || 'Select Minimum Digits');
  const [loadingMinDigits, setLoadingMinDigits] = useState(() => localStorage.getItem('settings_loadingMinDigits') || 'Select Minimum Digits');
  const [invoiceMinDigits, setInvoiceMinDigits] = useState(() => localStorage.getItem('settings_invoiceMinDigits') || 'Select Minimum Digits');
  const [chalanMinDigits, setChalanMinDigits] = useState(() => localStorage.getItem('settings_chalanMinDigits') || 'Select Minimum Digits');
  const [notifyInterval, setNotifyInterval] = useState(() => localStorage.getItem('settings_notifyInterval') || '15 MIN');
  const [invoiceHeading, setInvoiceHeading] = useState(() => localStorage.getItem('settings_invoiceHeading') || 'Default Template');

  useEffect(() => {
    localStorage.setItem('settings_logoImg', logoImg || '');
    localStorage.setItem('settings_stampImg', stampImg || '');
    localStorage.setItem('settings_headingColor', headingColor);
    localStorage.setItem('settings_listDocBy', listDocBy);
    localStorage.setItem('settings_showBiltyBank', String(showBiltyBank));
    localStorage.setItem('settings_showLoadBank', String(showLoadBank));
    localStorage.setItem('settings_showInvoiceBank', String(showInvoiceBank));
    localStorage.setItem('settings_selectedBiltyFormat', String(selectedBiltyFormat));
    localStorage.setItem('settings_selectedLoadingFormat', String(selectedLoadingFormat));
    localStorage.setItem('settings_loadingBgColor', loadingBgColor);
    localStorage.setItem('settings_voucherBgColor', voucherBgColor);
    localStorage.setItem('settings_biltyMinDigits', biltyMinDigits);
    localStorage.setItem('settings_loadingMinDigits', loadingMinDigits);
    localStorage.setItem('settings_invoiceMinDigits', invoiceMinDigits);
    localStorage.setItem('settings_chalanMinDigits', chalanMinDigits);
    localStorage.setItem('settings_notifyInterval', notifyInterval);
    localStorage.setItem('settings_invoiceHeading', invoiceHeading);
  }, [
    logoImg, stampImg, headingColor, listDocBy, showBiltyBank, showLoadBank, showInvoiceBank,
    selectedBiltyFormat, selectedLoadingFormat, loadingBgColor, voucherBgColor,
    biltyMinDigits, loadingMinDigits, invoiceMinDigits, chalanMinDigits, notifyInterval, invoiceHeading
  ]);

  // Fetch all MERN data from API
  const fetchData = async () => {
    if (!token) return;
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // 1. Dashboard counts
      const resStats = await fetch(`${API_BASE}/reports/dashboard-stats`, { headers });
      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data.counts);
        setLogs(data.logs);
      }

      // 2. Masters
      const resC = await fetch(`${API_BASE}/masters/customers`, { headers });
      if (resC.ok) setCustomers(await resC.json());

      const resV = await fetch(`${API_BASE}/masters/vehicles`, { headers });
      if (resV.ok) setVehicles(await resV.json());

      const resD = await fetch(`${API_BASE}/masters/drivers`, { headers });
      if (resD.ok) setDrivers(await resD.json());

      // 3. Documents
      const resB = await fetch(`${API_BASE}/documents/bilties`, { headers });
      if (resB.ok) setBilties(await resB.json());

      const resS = await fetch(`${API_BASE}/documents/loading-slips`, { headers });
      if (resS.ok) setSlips(await resS.json());

      const resCh = await fetch(`${API_BASE}/documents/chalans`, { headers });
      if (resCh.ok) setChalans(await resCh.json());

      const resI = await fetch(`${API_BASE}/documents/invoices`, { headers });
      if (resI.ok) setInvoices(await resI.json());

      const resVo = await fetch(`${API_BASE}/documents/vouchers`, { headers });
      if (resVo.ok) setVouchers(await resVo.json());

      const resAd = await fetch(`${API_BASE}/documents/supplier-advances`, { headers });
      if (resAd.ok) setSupplierAdvances(await resAd.json());

    } catch (err) {
      console.warn('⚠️ Server offline or unreachable. Activating mock-seeding data in browser...', err);
      activateMockFallback();
    }
  };

  // Safe fallback seed if API server is offline during initial testing
  const activateMockFallback = () => {
    const mockCust = [
      { _id: 'c1', name: 'TATA STEEL LTD', phone: '9876543210', email: 'logistics@tatasteel.com', gstin: '22AAAAA0000A1Z1', address: 'Jamshedpur Industrial Area', city: 'Jamshedpur' },
      { _id: 'c2', name: 'RELIANCE INDUSTRIES', phone: '9123456789', email: 'dispatch@ril.com', gstin: '27BBBBB1111B2Z2', address: 'Reliance Refinery', city: 'Jamnagar' }
    ];
    setCustomers(mockCust);

    setVehicles([
      { _id: 'v1', vehicleNumber: 'UP-77-AN-4876', model: 'Tata Signa 4825.T', ownerName: 'Transcore Owner', ownerPhone: '8269203922' },
      { _id: 'v2', vehicleNumber: 'DL-01-GB-1234', model: 'Ashok Leyland 3520', ownerName: 'Subhash Transport', ownerPhone: '9988776655' }
    ]);

    setDrivers([
      { _id: 'd1', name: 'Ramesh Singh', licenseNumber: 'DL1234567890123', mobile: '9888877777', commissionRate: 10 }
    ]);

    const mockBilties = [];
    for (let i = 1; i <= 31; i++) {
      mockBilties.push({
        _id: `bilty_${i}`,
        biltyNo: i === 31 ? '1000011205' : `1000011${205 - i}`,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fromCity: i === 31 ? 'Kanpur' : 'Jamshedpur',
        toCity: i === 31 ? 'Mumbai' : 'Jamnagar',
        consignorId: 'c1',
        consignorName: 'TATA STEEL LTD',
        consigneeId: 'c2',
        consigneeName: 'RELIANCE INDUSTRIES',
        vehicleNumber: i === 31 ? 'UP-77-AN-4876' : 'DL-01-GB-1234',
        goodsDescription: i === 31 ? 'Iron Sheets / Coils' : 'Chemical Barrels',
        totalFreight: i === 31 ? 41000 : 32000,
        advancePaid: i === 31 ? 15000 : 10000,
        balanceAmount: i === 31 ? 26000 : 22000,
        deliveryStatus: i === 31 ? 'Dispatched' : 'Delivered'
      });
    }
    setBilties(mockBilties);

    setStats({
      bilty: 31,
      loadingSlip: 0,
      invoice: 0,
      chalan: 0,
      voucher: 0,
      customer: 2,
      driver: 1,
      letterhead: 0,
      deliverySlip: 0,
      quotation: 0,
      locationTracking: 3
    });

    setSupplierAdvances([]);

    setLogs([
      { _id: 'l1', description: 'Updated Bilty No. 1000011205 (UP-77-AN-4876) by TRANSCORE LOGISTICS.', timestamp: new Date().toISOString() },
      { _id: 'l2', description: 'Created Bilty No. 1000011205 (UP-77-AN-4876) by TRANSCORE LOGISTICS.', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() }
    ]);
  };

  // Fetch transporters for the Super Admin panel
  const fetchTransporters = async () => {
    if (!token || !isAdminView) return;
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/admin/transporters`, { headers });
      if (res.ok) {
        const data = await res.json();
        setTransporters(data);
      }
    } catch (err) {
      console.warn('Backend admin transporters connection offline. Using sandbox fallback...');
      setTransporters([
        { _id: 't1', name: 'Transcore Admin', companyName: 'TRANSCORE LOGISTICS', email: 'admin@transcore.com', mobile: '8269203922', gstin: '09AAACT9211C1ZA', subscriptionPlan: 'Premium Transporter', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { _id: 't2', name: 'Shyam Ji Mishra', companyName: 'SHYAM LOGISTICS BYPASS', email: 'shyam@roadlines.com', mobile: '8174076214', gstin: '27BBBBB1111B2Z2', subscriptionPlan: 'Free Trial', createdAt: new Date().toISOString() }
      ]);
    }
  };

  useEffect(() => {
    if (token) {
      if (isAdminView) {
        fetchTransporters();
      } else {
        fetchData();
      }
    }
  }, [token, isAdminView]);

  // Auth handlers
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          companyName: regCompanyName,
          email: regEmail,
          mobile: regMobile,
          password: regPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Registration failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setShowLoginModal(false);
      setIsRegisterMode(false);
      setRegName('');
      setRegCompanyName('');
      setRegEmail('');
      setRegMobile('');
      setRegPassword('');
    } catch (err) {
      console.error('Registration connection error:', err);
      setAuthError('Connection error: Unable to connect to the authentication server. Please ensure the backend server is running on port 5001.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      console.error('Login connection error:', err);
      setAuthError('Connection error: Unable to connect to the authentication server. Please ensure the backend server is running on port 5001.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    setToken('');
    setUser(null);
    setIsImpersonating(false);
  };

  // --- Platform Super Admin CRUD Actions ---
  const handleCreateTransporter = async (data) => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/admin/transporters`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) fetchTransporters();
    } catch (e) {
      const newRecord = { _id: Math.random().toString(), createdAt: new Date().toISOString(), ...data };
      setTransporters([...transporters, newRecord]);
    }
  };

  const handleUpdateTransporter = async (id, data) => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/admin/transporters/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) fetchTransporters();
    } catch (e) {
      setTransporters(transporters.map(t => t._id === id ? { ...t, ...data } : t));
    }
  };

  const handleDeleteTransporter = async (id) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/admin/transporters/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchTransporters();
    } catch (e) {
      setTransporters(transporters.filter(t => t._id !== id));
    }
  };

  // Impersonate / Assist Transporter company
  const handleImpersonateTransporter = async (id) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/admin/impersonate/${id}`, { method: 'POST', headers });
      const data = await res.json();
      if (res.ok) {
        // Save current active admin states
        sessionStorage.setItem('admin_token', token);
        sessionStorage.setItem('admin_user', JSON.stringify(user));
        
        // Load target customer TMS credentials
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setIsImpersonating(true);
        setIsAdminView(false);
        setActivePage('dashboard');
        window.history.pushState({}, '', '/');
      }
    } catch (e) {
      // Impersonate local fallback for offline tests
      const target = transporters.find(t => t._id === id);
      if (target) {
        sessionStorage.setItem('admin_token', token);
        sessionStorage.setItem('admin_user', JSON.stringify(user));
        
        const dummyClient = { name: target.name, companyName: target.companyName, email: target.email, id: target._id, isSuperAdmin: false };
        localStorage.setItem('token', 'local_dummy_token_impersonate');
        localStorage.setItem('user', JSON.stringify(dummyClient));
        setToken('local_dummy_token_impersonate');
        setUser(dummyClient);
        setIsImpersonating(true);
        setIsAdminView(false);
        setActivePage('dashboard');
        window.history.pushState({}, '', '/');
      }
    }
  };

  // Return to Platform Admin Dashboard
  const handleReturnToAdmin = () => {
    const adminToken = sessionStorage.getItem('admin_token');
    const adminUser = JSON.parse(sessionStorage.getItem('admin_user') || 'null');
    
    if (adminToken && adminUser) {
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_user');
      
      localStorage.setItem('token', adminToken);
      localStorage.setItem('user', JSON.stringify(adminUser));
      setToken(adminToken);
      setUser(adminUser);
      setIsImpersonating(false);
      setIsAdminView(true);
      setActivePage('dashboard');
      window.history.pushState({}, '', '/admin');
    }
  };

  // --- CRUD API Connectors ---
  // Masters CRUD Action Mappings
  const handleCreateMaster = async (type, data) => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/masters/${type}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) fetchData();
    } catch (e) {
      // Local state adjustment for offline testing
      const newRecord = { _id: Math.random().toString(), ...data };
      if (type === 'customers') setCustomers([...customers, newRecord]);
      if (type === 'vehicles') setVehicles([...vehicles, newRecord]);
      if (type === 'drivers') setDrivers([...drivers, newRecord]);
    }
  };

  const handleUpdateMaster = async (type, id, data) => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/masters/${type}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) fetchData();
    } catch (e) {
      const mapFn = (arr) => arr.map(x => x._id === id ? { ...x, ...data } : x);
      if (type === 'customers') setCustomers(mapFn(customers));
      if (type === 'vehicles') setVehicles(mapFn(vehicles));
      if (type === 'drivers') setDrivers(mapFn(drivers));
    }
  };

  const handleDeleteMaster = async (type, id) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/masters/${type}/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchData();
    } catch (e) {
      const filterFn = (arr) => arr.filter(x => x._id !== id);
      if (type === 'customers') setCustomers(filterFn(customers));
      if (type === 'vehicles') setVehicles(filterFn(vehicles));
      if (type === 'drivers') setDrivers(filterFn(drivers));
    }
  };

  // Documents CRUD Action Mappings
  const handleCreateDocument = async (type, endpoint, data) => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/documents/${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) fetchData();
    } catch (e) {
      const newDoc = { _id: Math.random().toString(), ...data };
      if (type === 'bilty') {
        setBilties([...bilties, newDoc]);
        setLogs([{ description: `Created Bilty No. ${newDoc.biltyNo} by TRANSCORE LOGISTICS.`, timestamp: new Date().toISOString() }, ...logs]);
      }
      if (type === 'slip') setSlips([...slips, newDoc]);
      if (type === 'chalan') setChalans([...chalans, newDoc]);
      if (type === 'invoice') setInvoices([...invoices, newDoc]);
      if (type === 'voucher') setVouchers([...vouchers, newDoc]);
      if (type === 'supplier-advance') setSupplierAdvances([...supplierAdvances, newDoc]);
    }
  };

  const handleUpdateDocument = async (type, endpoint, id, data) => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/documents/${endpoint}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) fetchData();
    } catch (e) {
      const mapFn = (arr) => arr.map(x => x._id === id ? { ...x, ...data } : x);
      if (type === 'bilty') {
        setBilties(mapFn(bilties));
        setLogs([{ description: `Updated Bilty No. ${data.biltyNo} by TRANSCORE LOGISTICS.`, timestamp: new Date().toISOString() }, ...logs]);
      }
      if (type === 'slip') setSlips(mapFn(slips));
      if (type === 'chalan') setChalans(mapFn(chalans));
      if (type === 'invoice') setInvoices(mapFn(invoices));
      if (type === 'voucher') setVouchers(mapFn(vouchers));
      if (type === 'supplier-advance') setSupplierAdvances(mapFn(supplierAdvances));
    }
  };

  const handleDeleteDocument = async (type, endpoint, id) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_BASE}/documents/${endpoint}/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchData();
    } catch (e) {
      const filterFn = (arr) => arr.filter(x => x._id !== id);
      if (type === 'bilty') setBilties(filterFn(bilties));
      if (type === 'slip') setSlips(filterFn(slips));
      if (type === 'chalan') setChalans(filterFn(chalans));
      if (type === 'invoice') setInvoices(filterFn(invoices));
      if (type === 'voucher') setVouchers(filterFn(vouchers));
      if (type === 'supplier-advance') setSupplierAdvances(filterFn(supplierAdvances));
    }
  };

  // Auth Gate layout rendering
  if (!token) {
    if (isAdminView) {
      return (
        <div style={authStyles.container}>
          <div style={authStyles.card}>
            <div style={authStyles.logo}>
              <svg viewBox="0 0 100 100" width="50" height="50">
                <rect width="100" height="100" rx="20" fill="#3b82f6" />
                <path d="M25 50 L40 65 L75 35" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <h2 style={authStyles.title}>Roadwe Super Admin</h2>
            <p style={authStyles.subtitle}>System Administrative login to monitor SaaS and renew client accounts</p>
            
            <form onSubmit={handleLogin} style={authStyles.form}>
              {authError && <div style={authStyles.error}>{authError}</div>}
              <div className="form-group">
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Administrator Email</label>
                <input 
                  type="email" name="email" required className="form-control"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ marginTop: '4px', height: '40px', padding: '8px 12px' }}
                />
              </div>
              <div className="form-group" style={{ marginTop: '14px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Password</label>
                <input 
                  type="password" name="password" required className="form-control"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  style={{ marginTop: '4px', height: '40px', padding: '8px 12px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px', height: '44px', fontWeight: '800', backgroundColor: '#3b82f6' }}>
                Login to Platform Console
              </button>
            </form>
            
            <div style={{ marginTop: '20px', fontSize: '0.8rem' }}>
              <span onClick={() => { setIsAdminView(false); window.history.pushState({}, '', '/'); setEmail(''); setPassword(''); }} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>
                🚛 Regular Transporter Login
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <LandingPage 
          onLoginClick={() => {
            setAuthError('');
            setEmail('');
            setPassword('');
            setShowLoginModal(true);
          }} 
          onAdminLoginClick={() => {
            setIsAdminView(true);
            window.history.pushState({}, '', '/admin');
            setEmail('');
            setPassword('');
            setAuthError('');
          }}
        />

        {showLoginModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(9, 15, 25, 0.7)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px'
          }}>
            <div style={{
              ...authStyles.card,
              position: 'relative', width: '100%', maxWidth: '420px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '40px 28px',
              textAlign: 'center'
            }}>
              
              <button 
                onClick={() => { setShowLoginModal(false); setIsRegisterMode(false); }}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'none', border: 'none', color: '#64748b',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', padding: '6px', borderRadius: '50%'
                }}
              >
                <X size={18} />
              </button>

              <div style={authStyles.logo}>
                <svg viewBox="0 0 100 100" width="50" height="50">
                  <rect width="100" height="100" rx="20" fill="#0066cc" />
                  <path d="M50 15 L35 85 M50 15 L65 85" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
                  <path d="M50 15 L50 85" stroke="#ffffff" strokeWidth="5" strokeDasharray="10,10" />
                </svg>
              </div>
              
              {isRegisterMode ? (
                <>
                  <h2 style={authStyles.title}>Register Account</h2>
                  <p style={authStyles.subtitle}>Set up a premium transporter workspace with your business details</p>
                  
                  <form onSubmit={handleRegister} style={authStyles.form}>
                    {authError && <div style={authStyles.error}>{authError}</div>}
                    
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Company Name</label>
                      <input 
                        type="text" required className="form-control"
                        value={regCompanyName} onChange={(e) => setRegCompanyName(e.target.value)}
                        style={{ marginTop: '4px', height: '40px', padding: '8px 12px' }}
                        placeholder="e.g. Speedex Logistics"
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Owner Full Name</label>
                      <input 
                        type="text" required className="form-control"
                        value={regName} onChange={(e) => setRegName(e.target.value)}
                        style={{ marginTop: '4px', height: '40px', padding: '8px 12px' }}
                        placeholder="e.g. Ramesh Kumar"
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Email Address</label>
                      <input 
                        type="email" required className="form-control"
                        value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                        style={{ marginTop: '4px', height: '40px', padding: '8px 12px' }}
                        placeholder="e.g. contact@speedex.com"
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Mobile Number</label>
                      <input 
                        type="tel" required className="form-control"
                        value={regMobile} onChange={(e) => setRegMobile(e.target.value)}
                        style={{ marginTop: '4px', height: '40px', padding: '8px 12px' }}
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    
                    <div className="form-group" style={{ marginTop: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Setup Password</label>
                      <input 
                        type="password" required className="form-control"
                        value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                        style={{ marginTop: '4px', height: '40px', padding: '8px 12px' }}
                        placeholder="Choose a secure password"
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px', height: '44px', fontWeight: '800', backgroundColor: '#0066cc' }}>
                      Register & Get Started
                    </button>
                  </form>

                  <div style={{ marginTop: '20px', fontSize: '0.8rem', textAlign: 'center' }}>
                    <span onClick={() => { setIsRegisterMode(false); setAuthError(''); }} style={{ color: '#0066cc', cursor: 'pointer', fontWeight: '700' }}>
                      ← Back to Login
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={authStyles.title}>Roadwe Transporter</h2>
                  <p style={authStyles.subtitle}>Manage your lorry bilties, invoices, & chalans in one secure place</p>
                  
                  <form onSubmit={async (e) => {
                    await handleLogin(e);
                  }} style={authStyles.form}>
                    {authError && <div style={authStyles.error}>{authError}</div>}
                    
                    <div className="form-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Email Address</label>
                      <input 
                        type="email" name="email" required className="form-control"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        style={{ marginTop: '4px', height: '40px', padding: '8px 12px' }}
                      />
                    </div>
                    
                    <div className="form-group" style={{ marginTop: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Password</label>
                      <input 
                        type="password" name="password" required className="form-control"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        style={{ marginTop: '4px', height: '40px', padding: '8px 12px' }}
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px', height: '44px', fontWeight: '800', backgroundColor: '#0066cc' }}>
                      Access Transporter Dashboard
                    </button>
                  </form>

                  <div style={{ marginTop: '16px', fontSize: '0.8rem', textAlign: 'center' }}>
                    <span style={{ color: '#64748b' }}>Don't have an account? </span>
                    <span onClick={() => { setIsRegisterMode(true); setAuthError(''); }} style={{ color: '#0066cc', cursor: 'pointer', fontWeight: '700' }}>
                      Register New Account
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '24px', fontSize: '0.8rem', borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span onClick={() => { setIsAdminView(true); window.history.pushState({}, '', '/admin'); setEmail(''); setPassword(''); setShowLoginModal(false); }} style={{ color: '#0066cc', cursor: 'pointer', fontWeight: '700' }}>
                      🏢 System Admin Login
                    </span>
                    <span onClick={() => setShowLoginModal(false)} style={{ color: '#64748b', cursor: 'pointer', fontWeight: '700' }}>
                      Cancel
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
    }

    // Super Admin Dashboard rendering logic
    if (token && user?.isSuperAdmin && isAdminView) {
      return (
        <div className="app-container admin-theme" style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f3f4f6', display: 'flex', width: '100%' }}>
          
          {/* A. SUPER ADMIN PANEL SIDEBAR */}
          <div className="sidebar-drawer open" style={{ width: '280px', display: 'flex', flexDirection: 'column', height: '100vh', borderRight: '1px solid rgba(55, 65, 81, 0.6)', backgroundColor: '#0f172a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px 16px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid rgba(55, 65, 81, 0.6)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontFamily: "'Outfit', sans-serif", fontSize: '1rem', border: '1px solid #3b82f6', backgroundColor: '#2563eb', color: '#ffffff', boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }}>SA</div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.04em', lineHeight: '1.2' }}>ROADWE Platform</h4>
                <span style={{ fontSize: '0.68rem', color: '#60a5fa', fontWeight: '700', letterSpacing: '0.05em' }}>SYSTEM CONTROL TOWER</span>
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ padding: '0 12px 6px 12px', fontSize: '0.65rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operations HUD</span>
              
              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease', userSelect: 'none', backgroundColor: adminTab === 'overview' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: adminTab === 'overview' ? '#60a5fa' : '#9ca3af' }}
                onClick={() => setAdminTab('overview')}
              >
                <ShieldCheck size={18} style={{ color: adminTab === 'overview' ? '#60a5fa' : '#64748b' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>SaaS Overview</span>
              </div>

              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease', userSelect: 'none', backgroundColor: adminTab === 'companies' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: adminTab === 'companies' ? '#60a5fa' : '#9ca3af' }}
                onClick={() => setAdminTab('companies')}
              >
                <Plus size={18} style={{ color: adminTab === 'companies' ? '#60a5fa' : '#64748b' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>Transporter Companies</span>
              </div>

              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease', userSelect: 'none', backgroundColor: adminTab === 'vehicles' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: adminTab === 'vehicles' ? '#60a5fa' : '#9ca3af' }}
                onClick={() => setAdminTab('vehicles')}
              >
                <Plus size={18} style={{ color: adminTab === 'vehicles' ? '#60a5fa' : '#64748b' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>Active Vehicles</span>
              </div>

              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease', userSelect: 'none', backgroundColor: adminTab === 'tracking' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: adminTab === 'tracking' ? '#60a5fa' : '#9ca3af' }}
                onClick={() => setAdminTab('tracking')}
              >
                <Plus size={18} style={{ color: adminTab === 'tracking' ? '#60a5fa' : '#64748b' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>Global GPS Tracking</span>
              </div>

              <span style={{ padding: '16px 12px 6px 12px', fontSize: '0.65rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue & Plans</span>

              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease', userSelect: 'none', backgroundColor: adminTab === 'revenue' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: adminTab === 'revenue' ? '#60a5fa' : '#9ca3af' }}
                onClick={() => setAdminTab('revenue')}
              >
                <Plus size={18} style={{ color: adminTab === 'revenue' ? '#60a5fa' : '#64748b' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>Revenue Analytics</span>
              </div>

              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease', userSelect: 'none', backgroundColor: adminTab === 'plans' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: adminTab === 'plans' ? '#60a5fa' : '#9ca3af' }}
                onClick={() => setAdminTab('plans')}
              >
                <Plus size={18} style={{ color: adminTab === 'plans' ? '#60a5fa' : '#64748b' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>Subscription Plans</span>
              </div>

              <span style={{ padding: '16px 12px 6px 12px', fontSize: '0.65rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support & Health</span>

              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease', userSelect: 'none', backgroundColor: adminTab === 'tickets' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: adminTab === 'tickets' ? '#60a5fa' : '#9ca3af' }}
                onClick={() => setAdminTab('tickets')}
              >
                <Plus size={18} style={{ color: adminTab === 'tickets' ? '#60a5fa' : '#64748b' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>Support Tickets</span>
                {supportTickets.filter(t => t.status === 'Pending').length > 0 && (
                  <span style={{ backgroundColor: '#ef4444', color: '#ffffff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '9999px', fontWeight: '800' }}>
                    {supportTickets.filter(t => t.status === 'Pending').length}
                  </span>
                )}
              </div>

              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease', userSelect: 'none', backgroundColor: adminTab === 'health' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: adminTab === 'health' ? '#60a5fa' : '#9ca3af' }}
                onClick={() => setAdminTab('health')}
              >
                <Plus size={18} style={{ color: adminTab === 'health' ? '#60a5fa' : '#64748b' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>System Health</span>
              </div>

              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s ease', userSelect: 'none', backgroundColor: adminTab === 'audit' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: adminTab === 'audit' ? '#60a5fa' : '#9ca3af' }}
                onClick={() => setAdminTab('audit')}
              >
                <Plus size={18} style={{ color: adminTab === 'audit' ? '#60a5fa' : '#64748b' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>Audit Logs</span>
              </div>
            </div>
            
            <div style={{ flexShrink: 0, padding: '16px', borderTop: '1px solid rgba(55, 65, 81, 0.6)', backgroundColor: '#090d16' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', color: '#ef4444', transition: 'all 0.15s ease' }}
                onClick={handleLogout}
              >
                <LogOut size={18} style={{ color: '#ef4444' }} />
                <span style={{ flex: 1, marginLeft: '12px' }}>Logout Platform</span>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.65rem', color: '#475569', textAlign: 'center' }}>
                Roadwe SaaS Engine v2.0.0
              </div>
            </div>
          </div>

          {/* B. SUPER ADMIN MAIN DISPLAY COORDINATES */}
          <div className="main-content" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#090d16', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '70px', borderBottom: '1px solid rgba(55, 65, 81, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#0f172a' }}>
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: '800', fontSize: '1.4rem', color: '#ffffff' }}>
                  {adminTab === 'overview' && '🛡️ SaaS Control Tower'}
                  {adminTab === 'companies' && '🏢 Transporter Client Directory'}
                  {adminTab === 'vehicles' && '🚛 Global Fleet Inventory'}
                  {adminTab === 'tracking' && '📡 Live Indian GPS Track Segment'}
                  {adminTab === 'revenue' && '💰 Revenue & Payment Analytics'}
                  {adminTab === 'plans' && '💎 Subscription Service Tiers'}
                  {adminTab === 'tickets' && '🎟️ Platform Resolution Desk'}
                  {adminTab === 'health' && '⚡ System Infrastructure Metrics'}
                  {adminTab === 'audit' && '📜 System Audit Trail'}
                </h2>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Platform Owner Node: superadmin@roadwe.com</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700' }}>
                  ⚙️ System Node Online
                </div>
                <button onClick={fetchTransporters} className="btn-icon" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(55,65,81,0.5)', color: '#9ca3af' }} title="Refresh Directory">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            <div className="page-body" style={{ padding: '24px', flex: 1 }}>
              
              {/* TAB 1: SAAS OVERVIEW HUB */}
              {adminTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Top Statistics HUD Matrix */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                    <div className="glass-panel-premium" style={{ borderLeft: '4px solid #3b82f6' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Registered Companies</span>
                      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '6px', color: '#ffffff' }}>{transporters.length} Companies</h2>
                      <span style={{ fontSize: '0.68rem', color: '#10b981' }}>📈 100% cloud operational</span>
                    </div>

                    <div className="glass-panel-premium" style={{ borderLeft: '4px solid #10b981' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Active Fleet size</span>
                      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '6px', color: '#ffffff' }}>10 Active</h2>
                      <span style={{ fontSize: '0.68rem', color: '#60a5fa' }}>📡 Real-time GPS pings active</span>
                    </div>

                    <div className="glass-panel-premium" style={{ borderLeft: '4px solid #f59e0b' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Running Trips</span>
                      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '6px', color: '#ffffff' }}>4 Shipments</h2>
                      <span style={{ fontSize: '0.68rem', color: '#ef4444' }}>⚠️ 1 segment delay alert</span>
                    </div>

                    <div className="glass-panel-premium" style={{ borderLeft: '4px solid #a855f7' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Monthly SaaS Revenue</span>
                      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '6px', color: '#ffffff' }}>₹84,500</h2>
                      <span style={{ fontSize: '0.68rem', color: '#10b981' }}>💵 +18% growth this month</span>
                    </div>
                  </div>

                  {/* Dual Chart and Monitor Rows */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
                    <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: '700' }}>Annual SaaS Recurring Revenue (ARR)</h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Consolidated platform fee metrics collected across subscription renewals</span>
                      
                      <div style={{ height: '180px', marginTop: '10px' }}>
                        <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                          <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                          <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                          
                          <path 
                            d="M0,120 Q50,90 100,105 T200,75 T300,90 T400,45 T500,15" 
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="3.5" 
                            strokeLinecap="round"
                          />
                          <path 
                            d="M0,120 Q50,90 100,105 T200,75 T300,90 T400,45 T500,15 L500,135 L0,135 Z" 
                            fill="url(#adminChartGrad)" 
                          />
                          
                          <circle cx="100" cy="105" r="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
                          <circle cx="200" cy="75" r="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
                          <circle cx="300" cy="90" r="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
                          <circle cx="400" cy="45" r="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
                          <circle cx="500" cy="15" r="5.5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                          
                          <text x="5" y="145" fontSize="8" fill="#64748b" fontWeight="600">Jan</text>
                          <text x="100" y="145" fontSize="8" fill="#64748b" fontWeight="600">Feb</text>
                          <text x="200" y="145" fontSize="8" fill="#64748b" fontWeight="600">Mar</text>
                          <text x="300" y="145" fontSize="8" fill="#64748b" fontWeight="600">Apr</text>
                          <text x="400" y="145" fontSize="8" fill="#64748b" fontWeight="600">May</text>
                          <text x="465" y="145" fontSize="8" fill="#10b981" fontWeight="700">Live (Jun)</text>
                        </svg>
                      </div>
                    </div>

                    <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: '700' }}>Active GPS Tracking Alert Feed</h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Real-time telemetry parsed from active transporter fleets</span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                        {gpsAlerts.map((alert, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '12px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(55,65,81,0.3)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: alert.status === 'Active' ? '#ef4444' : '#10b981', marginTop: '4px', display: 'inline-block', flexShrink: 0 }}></span>
                            <div>
                              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#f3f4f6' }}>{alert.vehicle} - {alert.time}</div>
                              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px' }}>{alert.alert}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Failed API Logs & Health Panel */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <h3 style={{ fontSize: '#0.98rem', color: '#ffffff', fontWeight: '700' }}>Failed API Logs & Security Warnings</h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Auditing system error states and permission leaks</span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        {failedLogs.map((log, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px', backgroundColor: 'rgba(239,68,68,0.04)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                              <span style={{ fontWeight: '700', color: '#ef4444' }}>{log.method} {log.endpoint}</span>
                              <span style={{ color: '#64748b' }}>{log.timestamp}</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#fca5a5', fontFamily: 'monospace' }}>{log.error}</div>
                            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>IP Address: {log.ip}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '0.98rem', color: '#ffffff', fontWeight: '700' }}>Active Platform User Directory</h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Online transporters and active impersonation metrics</span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                        {transporters.map((t, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(55,65,81,0.3)' }}>
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>{t.companyName}</div>
                              <span style={{ fontSize: '0.7rem', color: '#60a5fa' }}>{t.subscriptionPlan}</span>
                            </div>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>
                              <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span> Online
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: TRANSPORTER COMPANIES MANAGEMENT GRID */}
              {adminTab === 'companies' && (
                <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Multi-Tenant Client Registry</h3>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Add, renew, suspend, or assist registered transporter client accounts</span>
                    </div>
                    
                    <button 
                      onClick={() => setEditingTransporter({ name: '', companyName: '', email: '', mobile: '', password: '', subscriptionPlan: 'Free Trial', _isNew: true })} 
                      className="btn btn-primary"
                      style={{ backgroundColor: '#2563eb' }}
                    >
                      <Plus size={16} /> Register Transporter
                    </button>
                  </div>

                  <div className="responsive-table-scroll">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Company Name</th>
                          <th>Owner Details</th>
                          <th>Mobile</th>
                          <th>Subscription Plan</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transporters.length > 0 ? (
                          transporters.map((t) => (
                            <tr key={t._id}>
                              <td>
                                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>{t.companyName}</div>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>ID: {t._id}</span>
                              </td>
                              <td>
                                <div style={{ fontWeight: '600', color: '#f3f4f6' }}>{t.name}</div>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t.email}</span>
                              </td>
                              <td style={{ fontWeight: '500', color: '#e5e7eb' }}>{t.mobile}</td>
                              <td>
                                <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '700', backgroundColor: t.subscriptionPlan === 'Suspended' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.15)', color: t.subscriptionPlan === 'Suspended' ? '#ef4444' : '#60a5fa' }}>
                                  {t.subscriptionPlan || 'Free Trial'}
                                </span>
                              </td>
                              <td>
                                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', backgroundColor: t.subscriptionPlan === 'Suspended' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: t.subscriptionPlan === 'Suspended' ? '#ef4444' : '#10b981' }}>
                                  {t.subscriptionPlan === 'Suspended' ? 'Suspended' : 'Active'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                  <button 
                                    onClick={() => setEditingTransporter(t)}
                                    className="btn btn-secondary" 
                                    style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: '700', backgroundColor: '#1e293b', borderColor: '#374151', color: '#f3f4f6' }}
                                  >
                                    Edit / Renew
                                  </button>
                                  <button 
                                    onClick={() => handleImpersonateTransporter(t._id)}
                                    className="btn btn-primary" 
                                    style={{ padding: '4px 12px', fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#2563eb' }}
                                  >
                                    Help / Assist
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to remove ${t.companyName}?`)) {
                                        handleDeleteTransporter(t._id);
                                      }
                                    }}
                                    className="btn btn-danger" 
                                    style={{ padding: '4px 8px', fontSize: '0.72rem', backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>
                              No transporter companies registered.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVE VEHICLES INVENTORY */}
              {adminTab === 'vehicles' && (
                <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Global Fleet Inventory</h3>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Consolidated view of all active carrier vehicles registered across transporter tenants</span>
                  </div>

                  <div className="responsive-table-scroll">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Transporter Client</th>
                          <th>Vehicle Number</th>
                          <th>Model</th>
                          <th>Owner details</th>
                          <th>Insurance Expiry</th>
                          <th>Telemetry Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transporters.map((t) => (
                          <tr key={t._id}>
                            <td style={{ fontWeight: '700', color: '#ffffff' }}>{t.companyName}</td>
                            <td style={{ fontWeight: '800', color: '#60a5fa', fontFamily: 'monospace' }}>
                              {t.companyName.includes('TRANSCORE') ? 'UP-77-AN-4876' : 
                               t.companyName.includes('GUJARAT') ? 'GJ-01-XX-9999' :
                               t.companyName.includes('FASTTRACK') ? 'MH-12-FT-8888' :
                               t.companyName.includes('MAHADEV') ? 'HR-55-MD-7777' : 'DL-03-RL-5555'}
                            </td>
                            <td>{t.companyName.includes('TRANSCORE') ? 'Tata Signa 4825.T' : 'Eicher Pro 6028'}</td>
                            <td>{t.name}</td>
                            <td>2027-12-31</td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: t.subscriptionPlan === 'Suspended' ? '#ef4444' : '#10b981', fontWeight: '700' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: t.subscriptionPlan === 'Suspended' ? '#ef4444' : '#10b981', display: 'inline-block' }}></span>
                                {t.subscriptionPlan === 'Suspended' ? 'Offline' : 'GPS Pinging'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: GLOBAL GPS TRACKING MAP */}
              {adminTab === 'tracking' && (
                <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Global GPS Carrier segment</h3>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Platform tracking overview across active segments in India</span>
                  </div>

                  <div style={{ position: 'relative', width: '100%', height: '420px', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(55,65,81,0.6)', overflow: 'hidden' }}>
                    <svg viewBox="0 0 350 280" style={{ width: '100%', height: '100%' }}>
                      <defs>
                        <pattern id="adminMapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.03)" strokeWidth="1" />
                        </pattern>
                        <radialGradient id="adminGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#adminMapGrid)" />
                      
                      <path 
                        d="M120,40 L160,30 L170,10 L195,35 L200,60 L240,80 L230,110 L280,120 L270,160 L230,170 L240,210 L190,260 L180,270 L140,230 L110,210 L100,160 L80,140 L110,95 L120,40 Z" 
                        fill="url(#adminGlow)" 
                        stroke="rgba(59,130,246,0.2)" 
                        strokeWidth="2" 
                        strokeDasharray="4,4" 
                      />

                      {/* Nodes */}
                      <g transform="translate(140, 60)"><circle r="4" fill="#ef4444" /><text x="8" y="2" fontSize="6.5" fill="#9ca3af" fontWeight="600">Delhi</text></g>
                      <g transform="translate(170, 95)"><circle r="4" fill="#3b82f6" /><text x="8" y="2" fontSize="6.5" fill="#9ca3af" fontWeight="600">Kanpur</text></g>
                      <g transform="translate(230, 125)"><circle r="4" fill="#3b82f6" /><text x="8" y="2" fontSize="6.5" fill="#9ca3af" fontWeight="600">Jamshedpur</text></g>
                      <g transform="translate(125, 205)"><circle r="4" fill="#ef4444" /><text x="8" y="2" fontSize="6.5" fill="#9ca3af" fontWeight="600">Mumbai</text></g>
                      <g transform="translate(260, 135)"><circle r="4" fill="#10b981" /><text x="8" y="2" fontSize="6.5" fill="#9ca3af" fontWeight="600">Kolkata</text></g>
                      
                      {/* Active Route Segments */}
                      <line x1="170" y1="95" x2="125" y2="205" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" className="map-route-segment" />
                      <line x1="230" y1="125" x2="125" y2="205" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" className="map-route-segment" />
                      <line x1="140" y1="60" x2="260" y2="135" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" className="map-route-segment" />

                      {/* Moving Truck */}
                      <g transform="translate(150, 140)">
                        <circle r="12" fill="none" stroke="#3b82f6" strokeWidth="1" className="glowing-radar-ping" />
                        <rect x="-6" y="-4" width="12" height="8" rx="1.5" fill="#3b82f6" />
                        <rect x="2" y="-2" width="4" height="4" fill="#93c5fd" />
                      </g>
                    </svg>

                    <div style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: '#0f172a', border: '1px solid rgba(55,65,81,0.6)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: '800' }}>📡 Real-time GPS Tracker HUD</span>
                      <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Active carriers: <b>4</b></div>
                      <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Current Speed Limit: <b>80 km/h</b></div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: REVENUE ANALYTICS */}
              {adminTab === 'revenue' && (
                <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Subscription Payment Registry</h3>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Consolidated platform billings collected across active transporter accounts</span>
                  </div>

                  <div className="responsive-table-scroll">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Billing Reference ID</th>
                          <th>Transporter Client</th>
                          <th>Billing Plan Tiers</th>
                          <th>Payment Date</th>
                          <th>Collected Amount</th>
                          <th>Payment Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontFamily: 'monospace', color: '#9ca3af' }}>INV-SAAS-0284</td>
                          <td style={{ fontWeight: '700', color: '#ffffff' }}>TRANSCORE LOGISTICS</td>
                          <td>Premium Transporter</td>
                          <td>2026-05-20</td>
                          <td style={{ fontWeight: '800', color: '#10b981' }}>₹4,500</td>
                          <td><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: '700' }}>Settled</span></td>
                        </tr>
                        <tr>
                          <td style={{ fontFamily: 'monospace', color: '#9ca3af' }}>INV-SAAS-0285</td>
                          <td style={{ fontWeight: '700', color: '#ffffff' }}>FASTTRACK CARGO</td>
                          <td>Enterprise Gold</td>
                          <td>2026-05-18</td>
                          <td style={{ fontWeight: '800', color: '#10b981' }}>₹12,000</td>
                          <td><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: '700' }}>Settled</span></td>
                        </tr>
                        <tr>
                          <td style={{ fontFamily: 'monospace', color: '#9ca3af' }}>INV-SAAS-0286</td>
                          <td style={{ fontWeight: '700', color: '#ffffff' }}>MAHADEV TRANSPORT</td>
                          <td>Premium Transporter</td>
                          <td>2026-05-15</td>
                          <td style={{ fontWeight: '800', color: '#10b981' }}>₹4,500</td>
                          <td><span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: '700' }}>Settled</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: SUBSCRIPTION PLANS */}
              {adminTab === 'plans' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-panel-premium">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Pricing & Subscription Service Tiers</h3>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Configure pricing structures, database size volumes, and active modules per tier.</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    {/* Tier 1 */}
                    <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #64748b' }}>
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: '800', textTransform: 'uppercase' }}>Basic Starter</span>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>Free Trial</h2>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Best for independent transporters</span>
                      <hr style={{ borderColor: 'rgba(55,65,81,0.5)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#9ca3af' }}>
                        <div>✔️ Up to 2 active vehicles</div>
                        <div>✔️ Bilty & Loading Slip creation</div>
                        <div>❌ Custom Invoice branding</div>
                        <div>❌ Multiple Branch control</div>
                      </div>
                    </div>

                    {/* Tier 2 */}
                    <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #3b82f6', boxShadow: '0 0 15px rgba(59, 130, 246, 0.15)' }}>
                      <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: '800', textTransform: 'uppercase' }}>Professional Volume</span>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>Premium Transporter</h2>
                      <span style={{ fontSize: '0.8rem', color: '#60a5fa' }}>₹4,500 / Month</span>
                      <hr style={{ borderColor: 'rgba(55,65,81,0.5)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#9ca3af' }}>
                        <div>✔️ Up to 25 active vehicles</div>
                        <div>✔️ Custom invoice heading branding</div>
                        <div>✔️ Ledger & Cash/Bank registers</div>
                        <div>✔️ Multi-branch directory routing</div>
                      </div>
                    </div>

                    {/* Tier 3 */}
                    <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #f59e0b' }}>
                      <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: '800', textTransform: 'uppercase' }}>Enterprise Corporate</span>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>Enterprise Gold</h2>
                      <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>₹12,000 / Month</span>
                      <hr style={{ borderColor: 'rgba(55,65,81,0.5)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#9ca3af' }}>
                        <div>✔️ Unlimited active vehicles & dispatches</div>
                        <div>✔️ Real-time India GPS tracking segmentation</div>
                        <div>✔️ Priority SLA 24/7 technical resolution</div>
                        <div>✔️ Multi-user branches routing maps</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: SUPPORT TICKETS DESK */}
              {adminTab === 'tickets' && (
                <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>Resolution Tickets desk</h3>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Process and toggle active support requests from transporter companies</span>
                  </div>

                  <div className="responsive-table-scroll">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Ticket ID</th>
                          <th>Transporter</th>
                          <th>Category</th>
                          <th>Subject</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supportTickets.map((t) => (
                          <tr key={t.id}>
                            <td style={{ fontFamily: 'monospace', color: '#9ca3af', fontWeight: '600' }}>{t.id}</td>
                            <td style={{ fontWeight: '700', color: '#ffffff' }}>{t.company}</td>
                            <td>{t.category}</td>
                            <td>{t.subject}</td>
                            <td>
                              <span style={{ color: t.priority === 'High' ? '#ef4444' : t.priority === 'Medium' ? '#f59e0b' : '#64748b', fontWeight: '700' }}>
                                {t.priority}
                              </span>
                            </td>
                            <td>
                              <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', backgroundColor: t.status === 'Resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: t.status === 'Resolved' ? '#10b981' : '#f59e0b', fontWeight: '700' }}>
                                {t.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button 
                                onClick={() => {
                                  setSupportTickets(supportTickets.map(x => x.id === t.id ? { ...x, status: x.status === 'Resolved' ? 'Pending' : 'Resolved' } : x));
                                }}
                                className="btn btn-secondary" 
                                style={{ padding: '4px 10px', fontSize: '0.7rem', backgroundColor: '#1e293b', borderColor: '#374151', color: '#f3f4f6' }}
                              >
                                {t.status === 'Resolved' ? 'Mark Pending' : 'Mark Resolved'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 8: SYSTEM HEALTH METRICS */}
              {adminTab === 'health' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-panel-premium">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Infrastructure Metrics HUD</h3>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Auditing active server regions, API response timings, and cache metrics</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    <div className="glass-panel-premium">
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>CPU utilization</span>
                      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '6px', color: '#10b981' }}>12.4 %</h2>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Load balances normalized</span>
                    </div>

                    <div className="glass-panel-premium">
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Allocated RAM</span>
                      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '6px', color: '#60a5fa' }}>410 MB</h2>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Heap limit: 2048 MB</span>
                    </div>

                    <div className="glass-panel-premium">
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>API Response Latency</span>
                      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '6px', color: '#10b981' }}>14 ms</h2>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Cached route segments active</span>
                    </div>

                    <div className="glass-panel-premium">
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>Local database persistent engine</span>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: '#f59e0b' }}>Persistent JSON</h2>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Active fallbacks online</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: AUDIT LOGS */}
              {adminTab === 'audit' && (
                <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>System Audit Trail</h3>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Platform-wide transaction history and login metrics</span>
                  </div>

                  <div className="responsive-table-scroll">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Operator</th>
                          <th>Transporter Scope</th>
                          <th>API Endpoint Action</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ color: '#9ca3af' }}>07:38:42</td>
                          <td style={{ fontWeight: '600', color: '#f3f4f6' }}>superadmin@roadwe.com</td>
                          <td>Roadwe Platform HQ</td>
                          <td style={{ fontWeight: '700', color: '#60a5fa' }}>GET_TRANSPORTERS</td>
                          <td>Platform owner audited transporter registry.</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#9ca3af' }}>07:35:10</td>
                          <td style={{ fontWeight: '600', color: '#f3f4f6' }}>admin@transcore.com</td>
                          <td>TRANSCORE LOGISTICS</td>
                          <td style={{ fontWeight: '700', color: '#3b82f6' }}>CREATE_BILTY</td>
                          <td>Created Bilty No. 1000011205 (UP-77-AN-4876).</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#9ca3af' }}>07:22:15</td>
                          <td style={{ fontWeight: '600', color: '#f3f4f6' }}>gujarat_mover_clerk</td>
                          <td>GUJARAT FREIGHT MOVERS</td>
                          <td style={{ fontWeight: '700', color: '#ef4444' }}>FAILED_API_LOGIN</td>
                          <td>Failed 2FA auth signature at /api/masters/subusers.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Modal for Registering/Editing Transporter Plan */}
          {editingTransporter && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '500px', padding: '24px', backgroundColor: '#1e293b', border: '1px solid rgba(55,65,81,0.6)', color: '#f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: '800', color: '#ffffff' }}>
                    {editingTransporter._isNew ? 'Register Transporter' : 'Edit Subscription Plan'}
                  </h3>
                  <button onClick={() => setEditingTransporter(null)} className="btn-icon" style={{ border: 'none', background: 'transparent', color: '#9ca3af' }}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formEl = e.target;
                  const data = {
                    name: formEl.name.value,
                    companyName: formEl.companyName.value,
                    email: formEl.email.value,
                    mobile: formEl.mobile.value,
                    subscriptionPlan: formEl.subscriptionPlan.value
                  };
                  if (editingTransporter._isNew) {
                    data.password = formEl.password.value;
                    await handleCreateTransporter(data);
                  } else {
                    await handleUpdateTransporter(editingTransporter._id, data);
                  }
                  setEditingTransporter(null);
                }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div className="form-group">
                    <label style={{ color: '#9ca3af' }}>Company Name</label>
                    <input type="text" name="companyName" required className="form-control" defaultValue={editingTransporter.companyName} style={{ backgroundColor: '#111827', color: '#f3f4f6', borderColor: 'rgba(55,65,81,0.8)' }} />
                  </div>
                  
                  <div className="form-group">
                    <label style={{ color: '#9ca3af' }}>Owner Name</label>
                    <input type="text" name="name" required className="form-control" defaultValue={editingTransporter.name} style={{ backgroundColor: '#111827', color: '#f3f4f6', borderColor: 'rgba(55,65,81,0.8)' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ color: '#9ca3af' }}>Email Address</label>
                    <input type="email" name="email" required className="form-control" defaultValue={editingTransporter.email} style={{ backgroundColor: '#111827', color: '#f3f4f6', borderColor: 'rgba(55,65,81,0.8)' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ color: '#9ca3af' }}>Mobile Number</label>
                    <input type="text" name="mobile" required className="form-control" defaultValue={editingTransporter.mobile} style={{ backgroundColor: '#111827', color: '#f3f4f6', borderColor: 'rgba(55,65,81,0.8)' }} />
                  </div>

                  {editingTransporter._isNew && (
                    <div className="form-group">
                      <label style={{ color: '#9ca3af' }}>Account Password</label>
                      <input type="password" name="password" required className="form-control" placeholder="Choose password" style={{ backgroundColor: '#111827', color: '#f3f4f6', borderColor: 'rgba(55,65,81,0.8)' }} />
                    </div>
                  )}

                  <div className="form-group">
                    <label style={{ color: '#9ca3af' }}>Subscription Plan</label>
                    <select name="subscriptionPlan" className="form-control" defaultValue={editingTransporter.subscriptionPlan} style={{ backgroundColor: '#111827', color: '#f3f4f6', borderColor: 'rgba(55,65,81,0.8)' }}>
                      <option value="Free Trial">Free Trial</option>
                      <option value="Premium Transporter">Premium Transporter</option>
                      <option value="Enterprise Gold">Enterprise Gold</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', padding: '10px', fontWeight: '700', backgroundColor: '#2563eb' }}>
                    {editingTransporter._isNew ? 'Create & Register Account' : 'Apply Plan Changes'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {isImpersonating && (
        <div style={{
          backgroundColor: '#f59e0b',
          color: '#0f172a',
          padding: '8px 24px',
          fontSize: '0.85rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999,
          position: 'sticky',
          top: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️ <b>Platform Assistant Mode:</b> You are logged in as customer company <b>{user?.companyName}</b> ({user?.email}) to assist them.</span>
          </div>
          <button 
            onClick={handleReturnToAdmin} 
            className="btn" 
            style={{ 
              backgroundColor: '#0f172a', 
              color: '#ffffff', 
              padding: '4px 12px', 
              fontSize: '0.75rem', 
              fontWeight: '700',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Return to Super Admin Dashboard
          </button>
        </div>
      )}

      <div className="app-container" style={{ flex: 1 }}>
        {/* Mobile Drawer Overlay Backdrop */}
        <div className={`drawer-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>

        {/* 1. Sidebar Nav */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* 2. Main content coordinates */}
        <div className="main-content">
        <Header 
          refreshData={fetchData} 
          onLogout={handleLogout} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          customers={customers}
          vehicles={vehicles}
          drivers={drivers}
          bilties={bilties}
          invoices={invoices}
        />
        
        <div className="page-body">
          {activePage === 'dashboard' && (
            <Dashboard 
              stats={stats} logs={logs} bilties={bilties} refreshData={fetchData} 
              setActivePage={setActivePage} setQuickAddTarget={setQuickAddTarget}
            />
          )}

          {activePage.startsWith('master-') && (
            <Masters 
              activePage={activePage} setActivePage={setActivePage}
              customers={customers} vehicles={vehicles} drivers={drivers}
              onCreateMaster={handleCreateMaster}
              onUpdateMaster={handleUpdateMaster}
              onDeleteMaster={handleDeleteMaster}
            />
          )}

          {(activePage === 'bilty' || activePage.startsWith('bilty-')) && (
            <Bilty 
              bilties={bilties} customers={customers} vehicles={vehicles} 
              quickAddTarget={activePage === 'bilty-create' ? 'bilty' : quickAddTarget}
              onCreateBilty={(data) => handleCreateDocument('bilty', 'bilties', data)}
              onUpdateBilty={(id, data) => handleUpdateDocument('bilty', 'bilties', id, data)}
              onDeleteBilty={(id) => handleDeleteDocument('bilty', 'bilties', id)}
              headingColor={headingColor}
              showBiltyBank={showBiltyBank}
              selectedBiltyFormat={selectedBiltyFormat}
              logoImg={logoImg}
              stampImg={stampImg}
            />
          )}

          {(activePage === 'loading-slip' || activePage.startsWith('loading-')) && (
            <LoadingSlip 
              slips={slips} customers={customers} vehicles={vehicles}
              initialOpen={activePage === 'loading-create'}
              onCreateSlip={(data) => handleCreateDocument('slip', 'loading-slips', data)}
              onUpdateSlip={(id, data) => handleUpdateDocument('slip', 'loading-slips', id, data)}
              onDeleteSlip={(id) => handleDeleteDocument('slip', 'loading-slips', id)}
              headingColor={headingColor}
              showLoadBank={showLoadBank}
              selectedLoadingFormat={selectedLoadingFormat}
              loadingBgColor={loadingBgColor}
              logoImg={logoImg}
              stampImg={stampImg}
            />
          )}

          {(activePage === 'chalan' || activePage.startsWith('chalan-')) && (
            <Chalan 
              chalans={chalans} vehicles={vehicles} drivers={drivers}
              bilties={bilties} slips={slips}
              headingColor={headingColor} logoImg={logoImg} stampImg={stampImg}
              initialOpen={activePage === 'chalan-create'}
              onCreateChalan={(data) => handleCreateDocument('chalan', 'chalans', data)}
              onUpdateChalan={(id, data) => handleUpdateDocument('chalan', 'chalans', id, data)}
              onDeleteChalan={(id) => handleDeleteDocument('chalan', 'chalans', id)}
              setActivePage={setActivePage}
            />
          )}

          {(activePage === 'invoice' || activePage.startsWith('invoice-')) && (
            <Invoice 
              invoices={invoices} bilties={bilties} customers={customers} slips={slips} vehicles={vehicles}
              initialOpen={activePage === 'invoice-create'}
              onCreateInvoice={(data) => handleCreateDocument('invoice', 'invoices', data)}
              onUpdateInvoice={(id, data) => handleUpdateDocument('invoice', 'invoices', id, data)}
              onDeleteInvoice={(id) => handleDeleteDocument('invoice', 'invoices', id)}
              headingColor={headingColor}
              showInvoiceBank={showInvoiceBank}
              invoiceHeading={invoiceHeading}
              logoImg={logoImg}
              stampImg={stampImg}
            />
          )}

          {(activePage === 'voucher' || activePage.startsWith('voucher-')) && (
            <Voucher 
              vouchers={vouchers} customers={customers}
              initialOpen={activePage === 'voucher-create'}
              onCreateVoucher={(data) => handleCreateDocument('voucher', 'vouchers', data)}
              onUpdateVoucher={(id, data) => handleUpdateDocument('voucher', 'vouchers', id, data)}
              onDeleteVoucher={(id) => handleDeleteDocument('voucher', 'vouchers', id)}
              headingColor={headingColor}
              voucherBgColor={voucherBgColor}
              logoImg={logoImg}
              stampImg={stampImg}
            />
          )}

          {activePage === 'ledger' && (
            <Ledger 
              customers={customers} invoices={invoices} vouchers={vouchers} chalans={chalans}
              supplierAdvances={supplierAdvances}
              onCreateVoucher={(data) => handleCreateDocument('voucher', 'vouchers', data)}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'all-party-ledger' && (
            <AllLedgerSummary 
              mode="party"
              customers={customers}
              invoices={invoices}
              vouchers={vouchers}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'all-supplier-ledger' && (
            <AllLedgerSummary 
              mode="supplier"
              vouchers={vouchers}
              chalans={chalans}
              supplierAdvances={supplierAdvances}
              seededSuppliers={seededSuppliers}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'commission-ledger' && (
            <CommissionLedger 
              chalans={chalans}
              seededSuppliers={seededSuppliers}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'supplier-paid-payment' && (
            <SupplierPaidPayment 
              seededSuppliers={seededSuppliers}
              chalans={chalans}
              supplierAdvances={supplierAdvances}
              onCreateVoucher={(data) => handleCreateDocument('voucher', 'vouchers', data)}
              onUpdateChalan={(id, data) => handleUpdateDocument('chalan', 'chalans', id, data)}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'party-received-payment' && (
            <PartyReceivedPayment 
              customers={customers}
              invoices={invoices}
              bilties={bilties}
              onCreateVoucher={(data) => handleCreateDocument('voucher', 'vouchers', data)}
              onUpdateInvoice={(id, data) => handleUpdateDocument('invoice', 'invoices', id, data)}
              onUpdateBilty={(id, data) => handleUpdateDocument('bilty', 'bilties', id, data)}
              setActivePage={setActivePage}
            />
          )}

          {(activePage === 'supplier-advance' || activePage.startsWith('supplier-advance-')) && (
            <SupplierAdvance 
              supplierAdvances={supplierAdvances}
              initialOpen={activePage === 'supplier-advance-create'}
              onCreateAdvance={(data) => handleCreateDocument('supplier-advance', 'supplier-advances', data)}
              onUpdateAdvance={(id, data) => handleUpdateDocument('supplier-advance', 'supplier-advances', id, data)}
              onDeleteAdvance={(id) => handleDeleteDocument('supplier-advance', 'supplier-advances', id)}
              setActivePage={setActivePage}
            />
          )}

          {/* Letterhead Generator View */}
          {(activePage === 'letterhead' || activePage.startsWith('letterhead-')) && (
            <Letterhead token={token} activePage={activePage} setActivePage={setActivePage} />
          )}

          {/* Delivery Slip View */}
          {(activePage === 'delivery-slip' || activePage.startsWith('delivery-')) && (
            <DeliverySlip token={token} activePage={activePage} setActivePage={setActivePage} />
          )}

          {/* Sub User Management View */}
          {(activePage === 'subuser' || activePage.startsWith('subuser-')) && (
            <SubUser token={token} activePage={activePage} setActivePage={setActivePage} />
          )}

          {/* Location Tracking View */}
          {(activePage === 'tracking' || activePage.startsWith('tracking-')) && (
            <Tracking activePage={activePage} setActivePage={setActivePage} />
          )}

          {/* Branch Directory View */}
          {(activePage === 'branch' || activePage.startsWith('branch-')) && (
            <Branch token={token} />
          )}

          {/* Quotations View */}
          {(activePage === 'quotation' || activePage.startsWith('quotation-')) && (
            <Quotation token={token} activePage={activePage} setActivePage={setActivePage} />
          )}

          {/* Cash/Bank Management View */}
          {(activePage === 'cashbank' || activePage.startsWith('cashbank-')) && (
            <CashBank token={token} activePage={activePage} setActivePage={setActivePage} />
          )}

          {/* Accounts View */}
          {(activePage === 'accounts' || activePage.startsWith('accounts-')) && (
            <Accounts activePage={activePage} setActivePage={setActivePage} />
          )}

          {/* Reports View */}
          {(activePage === 'reports' || activePage.startsWith('reports-')) && (
            <Reports activePage={activePage} />
          )}

          {/* My Documents View */}
          {activePage === 'my-documents' && (
            <MyDocuments />
          )}

          {/* Settings View */}
          {activePage === 'settings' && (
            <Settings 
              logoImg={logoImg} setLogoImg={setLogoImg}
              stampImg={stampImg} setStampImg={setStampImg}
              headingColor={headingColor} setHeadingColor={setHeadingColor}
              listDocBy={listDocBy} setListDocBy={setListDocBy}
              showBiltyBank={showBiltyBank} setShowBiltyBank={setShowBiltyBank}
              showLoadBank={showLoadBank} setShowLoadBank={setShowLoadBank}
              showInvoiceBank={showInvoiceBank} setShowInvoiceBank={setShowInvoiceBank}
              selectedBiltyFormat={selectedBiltyFormat} setSelectedBiltyFormat={setSelectedBiltyFormat}
              selectedLoadingFormat={selectedLoadingFormat} setSelectedLoadingFormat={setSelectedLoadingFormat}
              loadingBgColor={loadingBgColor} setLoadingBgColor={setLoadingBgColor}
              voucherBgColor={voucherBgColor} setVoucherBgColor={setVoucherBgColor}
              biltyMinDigits={biltyMinDigits} setBiltyMinDigits={setBiltyMinDigits}
              loadingMinDigits={loadingMinDigits} setLoadingMinDigits={setLoadingMinDigits}
              invoiceMinDigits={invoiceMinDigits} setInvoiceMinDigits={setInvoiceMinDigits}
              chalanMinDigits={chalanMinDigits} setChalanMinDigits={setChalanMinDigits}
              notifyInterval={notifyInterval} setNotifyInterval={setNotifyInterval}
              invoiceHeading={invoiceHeading} setInvoiceHeading={setInvoiceHeading}
            />
          )}

          {/* Profile View */}
          {activePage === 'profile' && (
            <Profile logoImg={logoImg} setLogoImg={setLogoImg} />
          )}

          {/* Subscription View */}
          {activePage === 'subscription' && (
            <Subscription />
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

// Authentication login layout styles
const authStyles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-main)'
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    padding: '36px',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '420px',
    textAlign: 'center',
    border: '1px solid var(--border-color)'
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  title: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--text-main)'
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '6px',
    lineHeight: '1.4',
    marginBottom: '24px'
  },
  form: {
    textAlign: 'left'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginBottom: '12px'
  },
  hint: {
    backgroundColor: 'var(--primary-glow)',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '0.75rem',
    lineHeight: '1.4',
    marginTop: '24px',
    textAlign: 'left'
  }
};
