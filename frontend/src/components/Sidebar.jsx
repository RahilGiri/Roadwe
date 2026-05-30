import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  FileText, 
  TrendingUp, 
  FileCheck, 
  Truck, 
  BookOpen, 
  ClipboardList, 
  FileSpreadsheet, 
  CreditCard, 
  GitBranch, 
  ChevronDown, 
  ChevronRight,
  PhoneCall,
  FileBadge,
  UserCheck,
  Wallet,
  Building2,
  Users,
  Folder,
  User,
  BarChart3,
  Calculator,
  Settings
} from 'lucide-react';

export default function Sidebar({ user, activePage, setActivePage, sidebarOpen, setSidebarOpen }) {
  // Navigation expand states
  const [expandStates, setExpandStates] = useState(() => {
    return {
      masters: ['master-party', 'master-truck', 'master-supplier', 'master-employee', 'master-item', 'master-charge', 'master-terms'].includes(activePage),
      bilty: ['bilty-create', 'bilty-list'].includes(activePage),
      loadingSlip: ['loading-create', 'loading-list'].includes(activePage),
      invoice: ['invoice-create', 'invoice-list'].includes(activePage),
      chalan: ['chalan-create', 'chalan-list'].includes(activePage),
      quotation: ['quotation-transport-create', 'quotation-transport-list', 'quotation-pm-create', 'quotation-pm-list'].includes(activePage),
      letterhead: ['letterhead-create', 'letterhead-list'].includes(activePage),
      deliverySlip: ['delivery-create', 'delivery-list'].includes(activePage),
      voucher: ['voucher-create', 'voucher-list'].includes(activePage),
      tracking: ['tracking-add', 'tracking-list'].includes(activePage),
      branch: ['branch-create', 'branch-list'].includes(activePage),
      subuser: ['subuser-create', 'subuser-list'].includes(activePage),
      cashbank: ['cashbank-cash-master', 'cashbank-bank-master', 'cashbank-khata'].includes(activePage),
      accounts: ['accounts-pump', 'accounts-driver-khata', 'accounts-bilty-expense', 'accounts-loading-expense', 'accounts-truck-expense', 'accounts-office-expense'].includes(activePage),
      reports: ['reports-pl', 'reports-revenue'].includes(activePage)
    };
  });

  // Automatically expand corresponding sidebar item when activePage updates
  React.useEffect(() => {
    if (!activePage) return;
    setExpandStates(prev => ({
      ...prev,
      masters: prev.masters || ['master-party', 'master-truck', 'master-supplier', 'master-employee', 'master-item', 'master-charge', 'master-terms'].includes(activePage),
      bilty: prev.bilty || ['bilty-create', 'bilty-list'].includes(activePage),
      loadingSlip: prev.loadingSlip || ['loading-create', 'loading-list'].includes(activePage),
      invoice: prev.invoice || ['invoice-create', 'invoice-list'].includes(activePage),
      chalan: prev.chalan || ['chalan-create', 'chalan-list'].includes(activePage),
      quotation: prev.quotation || ['quotation-transport-create', 'quotation-transport-list', 'quotation-pm-create', 'quotation-pm-list'].includes(activePage),
      letterhead: prev.letterhead || ['letterhead-create', 'letterhead-list'].includes(activePage),
      deliverySlip: prev.deliverySlip || ['delivery-create', 'delivery-list'].includes(activePage),
      voucher: prev.voucher || ['voucher-create', 'voucher-list'].includes(activePage),
      tracking: prev.tracking || ['tracking-add', 'tracking-list'].includes(activePage),
      branch: prev.branch || ['branch-create', 'branch-list'].includes(activePage),
      subuser: prev.subuser || ['subuser-create', 'subuser-list'].includes(activePage),
      cashbank: prev.cashbank || ['cashbank-cash-master', 'cashbank-bank-master', 'cashbank-khata'].includes(activePage),
      accounts: prev.accounts || ['accounts-pump', 'accounts-driver-khata', 'accounts-bilty-expense', 'accounts-loading-expense', 'accounts-truck-expense', 'accounts-office-expense'].includes(activePage),
      reports: prev.reports || ['reports-pl', 'reports-revenue'].includes(activePage)
    }));
  }, [activePage]);

  const toggleExpand = (key) => {
    setExpandStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'masters', 
      label: 'Create Masters', 
      icon: Database,
      isExpandable: true,
      isOpen: expandStates.masters,
      onClick: () => toggleExpand('masters'),
      subItems: [
        { id: 'master-party', label: 'Party List' },
        { id: 'master-truck', label: 'Truck List' },
        { id: 'master-supplier', label: 'Supplier List' },
        { id: 'master-employee', label: 'Employee List' },
        { id: 'master-item', label: 'Item List' },
        { id: 'master-charge', label: 'Charge List' },
        { id: 'master-terms', label: 'Terms & Condition List' }
      ]
    },
    { 
      id: 'bilty', 
      label: 'Bilty', 
      icon: FileText,
      isExpandable: true,
      isOpen: expandStates.bilty,
      onClick: () => toggleExpand('bilty'),
      subItems: [
        { id: 'bilty-create', label: 'Create New Bilty' },
        { id: 'bilty-list', label: 'Bilty List' }
      ]
    },
    { 
      id: 'loading-slip', 
      label: 'Loading Slip', 
      icon: ClipboardList,
      isExpandable: true,
      isOpen: expandStates.loadingSlip,
      onClick: () => toggleExpand('loadingSlip'),
      subItems: [
        { id: 'loading-create', label: 'Create Loading Slip' },
        { id: 'loading-list', label: 'Loading Slip List' }
      ]
    },
    { 
      id: 'invoice', 
      label: 'Invoice', 
      icon: FileSpreadsheet,
      isExpandable: true,
      isOpen: expandStates.invoice,
      onClick: () => toggleExpand('invoice'),
      subItems: [
        { id: 'invoice-create', label: 'Create New Invoice' },
        { id: 'invoice-list', label: 'Invoice List' }
      ]
    },
    { 
      id: 'chalan', 
      label: 'Chalan', 
      icon: Truck,
      isExpandable: true,
      isOpen: expandStates.chalan,
      onClick: () => toggleExpand('chalan'),
      subItems: [
        { id: 'chalan-create', label: 'Create New Chalan' },
        { id: 'chalan-list', label: 'Chalan List' }
      ]
    },
    { id: 'ledger', label: 'Ledger', icon: BookOpen },
    { 
      id: 'quotation', 
      label: 'Quotation', 
      icon: FileBadge,
      isExpandable: true,
      isOpen: expandStates.quotation,
      onClick: () => toggleExpand('quotation'),
      subItems: [
        { id: 'quotation-transport-create', label: 'Create Transport Quotation' },
        { id: 'quotation-transport-list', label: 'Transport Quotation List' },
        { id: 'quotation-pm-create', label: 'Create P&M Quotation' },
        { id: 'quotation-pm-list', label: 'P&M Quotation List' }
      ]
    },
    { 
      id: 'letterhead', 
      label: 'Letterhead', 
      icon: FileSpreadsheet,
      isExpandable: true,
      isOpen: expandStates.letterhead,
      onClick: () => toggleExpand('letterhead'),
      subItems: [
        { id: 'letterhead-create', label: 'Create Letterhead' },
        { id: 'letterhead-list', label: 'Letterhead List' }
      ]
    },
    { 
      id: 'delivery-slip', 
      label: 'Delivery Slip', 
      icon: ClipboardList,
      isExpandable: true,
      isOpen: expandStates.deliverySlip,
      onClick: () => toggleExpand('deliverySlip'),
      subItems: [
        { id: 'delivery-create', label: 'Create Delivery Slip' },
        { id: 'delivery-list', label: 'Delivery Slip List' }
      ]
    },
    { 
      id: 'voucher', 
      label: 'Voucher', 
      icon: FileCheck,
      isExpandable: true,
      isOpen: expandStates.voucher,
      onClick: () => toggleExpand('voucher'),
      subItems: [
        { id: 'voucher-create', label: 'Create Voucher' },
        { id: 'voucher-list', label: 'Voucher List' }
      ]
    },
    { 
      id: 'tracking', 
      label: 'Location Tracking', 
      icon: TrendingUp,
      isExpandable: true,
      isOpen: expandStates.tracking,
      onClick: () => toggleExpand('tracking'),
      subItems: [
        { id: 'tracking-add', label: 'Add Location Tracking' },
        { id: 'tracking-list', label: 'Location Tracking List' }
      ]
    },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { 
      id: 'branch', 
      label: 'Branch', 
      icon: GitBranch,
      isExpandable: true,
      isOpen: expandStates.branch,
      onClick: () => toggleExpand('branch'),
      subItems: [
        { id: 'branch-create', label: 'Create New Branch' },
        { id: 'branch-list', label: 'Branch List' }
      ]
    },
    { 
      id: 'subuser', 
      label: 'Sub User', 
      icon: UserCheck,
      isExpandable: true,
      isOpen: expandStates.subuser,
      onClick: () => toggleExpand('subuser'),
      subItems: [
        { id: 'subuser-create', label: 'Create New Sub User' },
        { id: 'subuser-list', label: 'Sub User List' }
      ]
    },
    { 
      id: 'cashbank', 
      label: 'Cash/Bank Manage', 
      icon: Wallet,
      isExpandable: true,
      isOpen: expandStates.cashbank,
      onClick: () => toggleExpand('cashbank'),
      subItems: [
        { id: 'cashbank-cash-master', label: 'Cash Master' },
        { id: 'cashbank-bank-master', label: 'Bank Master' },
        { id: 'cashbank-khata', label: 'Cash/Bank Khata' }
      ]
    },
    { 
      id: 'accounts', 
      label: 'Accounts', 
      icon: Calculator,
      isExpandable: true,
      isOpen: expandStates.accounts,
      onClick: () => toggleExpand('accounts'),
      subItems: [
        { id: 'accounts-pump', label: 'Pump Master' },
        { id: 'accounts-driver-khata', label: 'Driver/EMP Khata' },
        { id: 'accounts-bilty-expense', label: 'Bilty Expense' },
        { id: 'accounts-loading-expense', label: 'Loading Slip Expense' },
        { id: 'accounts-truck-expense', label: 'Direct Truck Expense' },
        { id: 'accounts-office-expense', label: 'Office Expense' }
      ]
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: BarChart3,
      isExpandable: true,
      isOpen: expandStates.reports,
      onClick: () => toggleExpand('reports'),
      subItems: [
        { id: 'reports-pl', label: 'Profit / Loss Report' },
        { id: 'reports-revenue', label: 'Truck Revenue Report' }
      ]
    },
    { id: 'my-documents', label: 'My Documents', icon: Folder },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Enforce strict Role-Based Access Control list filtering
  const userRole = user?.role || 'Transporter';
  const filteredMenuItems = menuItems.filter(item => {
    if (userRole === 'Manager') {
      if (['subscription', 'subuser'].includes(item.id)) return false;
    }
    if (userRole === 'Operator') {
      if (['cashbank', 'accounts', 'reports', 'subscription', 'subuser'].includes(item.id)) return false;
    }
    if (userRole === 'Accountant') {
      if (['subuser', 'tracking'].includes(item.id)) return false;
    }
    return true;
  });

  return (
    <div className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`} style={styles.sidebar}>
      {/* Transporter Company Header */}
      <div style={styles.companyHeader}>
        <div style={styles.avatar}>
          {(user?.companyName || 'TL').substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h4 style={styles.companyName}>{user?.companyName || 'TRANSCORE LOGISTICS'}</h4>
          <span style={styles.role}>{userRole.toUpperCase()}</span>
        </div>
      </div>

      {/* Nav List */}
      <div style={styles.navList}>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isSubActive = item.subItems && item.subItems.some(sub => sub.id === activePage);
          const isActive = activePage === item.id || isSubActive;

          return (
            <div key={item.id} style={styles.menuContainer}>
              <div 
                style={{
                  ...styles.menuItem,
                  ...(isActive && !item.isExpandable ? styles.menuItemActive : {}),
                  ...(isActive && item.isExpandable ? styles.menuItemActiveParent : {})
                }}
                onClick={item.isExpandable ? item.onClick : () => { setActivePage(item.id); if (setSidebarOpen) setSidebarOpen(false); }}
              >
                <Icon size={18} style={isActive ? styles.iconActive : styles.icon} />
                <span style={styles.menuText}>{item.label}</span>
                {item.isExpandable && (
                  <span style={styles.chevron}>
                    {item.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                )}
              </div>

              {/* Render Sub Items */}
              {item.isExpandable && item.isOpen && (
                <div style={styles.subList}>
                  {item.subItems.map((sub) => {
                    const isChildActive = activePage === sub.id;
                    return (
                      <div 
                        key={sub.id}
                        style={{
                          ...styles.subItem,
                          ...(isChildActive ? styles.subItemActive : {})
                        }}
                        onClick={() => { setActivePage(sub.id); if (setSidebarOpen) setSidebarOpen(false); }}
                      >
                        <span style={styles.indentIcon}>↳</span>
                        {sub.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support Dial Card */}
      <div style={styles.supportCard}>
        <div style={styles.supportHeader}>
          <PhoneCall size={14} style={{ marginRight: 6 }} />
          Support Contact No.
        </div>
        <div style={styles.supportNumber}>82692 03922</div>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: 'var(--bg-sidebar)',
    color: 'var(--text-main)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    borderRight: '1px solid var(--border-color)',
    flexShrink: 0
  },
  companyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 16px',
    borderBottom: '1px solid var(--border-color)',
    background: 'var(--bg-main)'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.95rem',
    border: '1px solid var(--border-color)'
  },
  companyName: {
    color: 'var(--text-main)',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.02em',
    lineHeight: '1.2'
  },
  role: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
    letterSpacing: '0.05em'
  },
  navList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 8px'
  },
  menuContainer: {
    marginBottom: '2px'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.15s ease',
    userSelect: 'none',
    color: 'var(--text-main)'
  },
  menuItemActive: {
    backgroundColor: '#0066cc',
    color: '#ffffff'
  },
  menuItemActiveParent: {
    backgroundColor: 'var(--bg-main)',
    color: 'var(--primary)'
  },
  menuText: {
    flex: 1,
    marginLeft: '12px'
  },
  icon: {
    color: '#64748b'
  },
  iconActive: {
    color: '#0066cc'
  },
  chevron: {
    color: '#64748b',
    display: 'flex'
  },
  subList: {
    paddingLeft: '14px',
    marginTop: '2px'
  },
  subItem: {
    padding: '8px 12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease',
    color: 'var(--text-muted)'
  },
  subItemActive: {
    color: 'var(--primary)',
    fontWeight: '700',
    backgroundColor: 'var(--primary-glow)'
  },
  indentIcon: {
    color: '#94a3b8',
    marginRight: '2px',
    fontWeight: 'bold'
  },
  supportCard: {
    margin: '12px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#00cc66',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  supportHeader: {
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    opacity: 0.95
  },
  supportNumber: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1.05rem',
    fontWeight: '700',
    letterSpacing: '0.03em'
  }
};
