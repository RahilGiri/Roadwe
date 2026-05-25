import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Bell, User, LogOut, Menu, Sun, Moon, Search, AlertCircle, CheckCircle, Truck, Wallet } from 'lucide-react';

export default function Header({ 
  refreshData, 
  onLogout, 
  sidebarOpen, 
  setSidebarOpen,
  customers = [],
  vehicles = [],
  drivers = [],
  bilties = [],
  invoices = []
}) {
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark-theme'));
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'dispatch', title: 'Carrier Dispatched', text: 'UP-77-AN-4876 departed Kanpur Hub carrying Iron Sheets.', time: '10m ago', icon: <Truck size={14} color="#2563eb" />, bg: 'rgba(37,99,235,0.1)' },
    { id: 2, type: 'invoice', title: 'Payment Reminder', text: 'Invoice INV-SAAS-0284 outstanding balance due tomorrow.', time: '45m ago', icon: <Wallet size={14} color="#f59e0b" />, bg: 'rgba(245,158,11,0.1)' },
    { id: 3, type: 'warning', title: 'Route Alert', text: 'Shipment UP-77 delayed by 20 mins near bypass congestion.', time: '2h ago', icon: <AlertCircle size={14} color="#ef4444" />, bg: 'rgba(239,68,68,0.1)' }
  ]);

  const searchRef = useRef(null);
  const bellRef = useRef(null);

  const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
    setIsDark(document.body.classList.contains('dark-theme'));
  };

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Handle live global search calculations
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    // 1. Search Bilties
    bilties.forEach(b => {
      if (b.biltyNo?.toLowerCase().includes(query) || b.vehicleNumber?.toLowerCase().includes(query)) {
        results.push({ type: 'Bilty', title: `Bilty No. ${b.biltyNo}`, desc: `${b.fromCity} ➡️ ${b.toCity} (${b.vehicleNumber})`, key: `bilty-${b._id}` });
      }
    });

    // 2. Search Invoices
    invoices.forEach(i => {
      if (i.invoiceNo?.toLowerCase().includes(query) || i.customerName?.toLowerCase().includes(query)) {
        results.push({ type: 'Invoice', title: `Invoice No. ${i.invoiceNo}`, desc: `Party: ${i.customerName} (₹${i.grandTotal.toLocaleString('en-IN')})`, key: `inv-${i._id}` });
      }
    });

    // 3. Search Vehicles
    vehicles.forEach(v => {
      if (v.vehicleNumber?.toLowerCase().includes(query)) {
        results.push({ type: 'Vehicle', title: `Vehicle ${v.vehicleNumber}`, desc: `Model: ${v.model || 'N/A'} - Owner: ${v.ownerName || 'N/A'}`, key: `veh-${v._id}` });
      }
    });

    // 4. Search Drivers
    drivers.forEach(d => {
      if (d.name?.toLowerCase().includes(query) || d.mobile?.toLowerCase().includes(query)) {
        results.push({ type: 'Driver', title: `Driver: ${d.name}`, desc: `Mobile: ${d.mobile} - DL: ${d.licenseNumber}`, key: `drv-${d._id}` });
      }
    });

    // 5. Search Customers
    customers.forEach(c => {
      if (c.name?.toLowerCase().includes(query) || c.phone?.toLowerCase().includes(query)) {
        results.push({ type: 'Party', title: `Customer: ${c.name}`, desc: `Phone: ${c.phone} - City: ${c.city}`, key: `cust-${c._id}` });
      }
    });

    setSearchResults(results.slice(0, 10)); // Cap results at 10
  }, [searchQuery, bilties, invoices, vehicles, drivers, customers]);

  return (
    <div style={styles.header}>
      
      {/* Mobile Hamburger toggle menu */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.hamburgerBtn} className="mobile-hamburger-btn" title="Toggle Menu">
        <Menu size={22} />
      </button>

      {/* Brand Logo & Name */}
      <div style={styles.logoSection}>
        <div style={styles.logoBox}>
          <svg viewBox="0 0 100 100" width="30" height="30">
            <rect width="100" height="100" rx="15" fill="#0066cc" />
            <path d="M50 15 L35 85 M50 15 L65 85" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <path d="M50 15 L50 85" stroke="#ffffff" strokeWidth="4" strokeDasharray="8,8" />
          </svg>
        </div>
        <div>
          <h2 style={styles.brandTitle}>Roadwe</h2>
          <span style={styles.brandSub}>Roadwe Ventures Pvt. Ltd.</span>
        </div>
      </div>

      {/* NEW: MERN GLOBAL MULTI-FIELD SEARCH BAR */}
      <div className="global-search-container" ref={searchRef}>
        <div style={styles.searchBar}>
          <Search size={16} color="rgba(255,255,255,0.7)" />
          <input 
            type="text" 
            placeholder="Search Bilty, Invoice, Vehicle, Driver, or Party..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            style={styles.searchInput}
          />
        </div>
        
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="global-search-results scrollable-list">
            {searchResults.map((res) => (
              <div key={res.key} className="search-result-row" onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-main)' }}>{res.title}</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res.desc}</span>
                </div>
                <span className="status-badge" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', border: 'none', fontSize: '0.65rem', fontWeight: '800' }}>
                  {res.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div style={styles.controls}>
        {/* Refresh button */}
        <button onClick={refreshData} style={styles.refreshBtn} title="Refresh Stats">
          <RefreshCw size={14} style={{ marginRight: 6 }} />
          Refresh
        </button>

        {/* Financial Year Selector */}
        <select style={styles.fySelect} defaultValue="26-27">
          <option value="25-26">25-26</option>
          <option value="26-27">26-27</option>
          <option value="27-28">27-28</option>
        </select>

        {/* Theme Swapper Button */}
        <button onClick={toggleTheme} style={styles.themeBtn} title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {isDark ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} />}
        </button>

        {/* NEW: Notification Bell Container with Alarm Badge and Dropdown list */}
        <div className="notification-bell-container" ref={bellRef} onClick={() => setShowNotifications(!showNotifications)}>
          <div style={styles.bellWrapper}>
            <Bell size={18} />
            <span className="notification-badge-pill">3</span>
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-main)' }}>Operational Alerts</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '700' }}>Mark all read</span>
              </div>
              
              {notifications.map((n) => (
                <div key={n.id} className="notification-item">
                  <div className="notification-icon-wrapper" style={{ backgroundColor: n.bg }}>
                    {n.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-main)' }}>{n.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>{n.text}</div>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Avatar / Logout */}
        <div style={styles.profileSection} onClick={onLogout} title="Click to Logout">
          <div style={styles.avatarCircle}>
            <User size={16} />
          </div>
          <span style={styles.logoutText}>Logout</span>
          <LogOut size={14} style={{ marginLeft: 4 }} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    height: '60px',
    backgroundColor: 'var(--bg-header)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 99,
    position: 'sticky',
    top: 0
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '2px',
    borderRadius: '6px'
  },
  brandTitle: {
    fontFamily: "'Outfit', sans-serif",
    color: '#ffffff',
    fontSize: '1.25rem',
    fontWeight: '800',
    lineHeight: '1',
    letterSpacing: '0.01em'
  },
  brandSub: {
    fontSize: '0.65rem',
    opacity: 0.8,
    fontWeight: '500',
    letterSpacing: '0.02em'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '6px 14px',
    width: '100%'
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '500',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-body)'
  },
  refreshBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
    outline: 'none'
  },
  fySelect: {
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none'
  },
  bellWrapper: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: 'background-color 0.2s'
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    fontSize: '0.8rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  avatarCircle: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    color: '#0066cc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutText: {
    opacity: 0.95
  },
  hamburgerBtn: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    padding: '4px',
    outline: 'none'
  },
  themeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none'
  }
};
