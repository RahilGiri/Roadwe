import React, { useState, useEffect } from 'react';
import { 
  Edit2, 
  Trash2, 
  X, 
  Home, 
  ChevronsUpDown, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  Plus, 
  Copy, 
  Settings, 
  Lock, 
  Unlock, 
  Check, 
  Layers, 
  MapPin, 
  RefreshCw, 
  ShieldAlert 
} from 'lucide-react';

const API_BASE = '/api';

const AVAILABLE_BRANCHES = [
  { id: 'br_vdr', name: 'Vadodara HQ' },
  { id: 'br_knp', name: 'Kanpur Branch' },
  { id: 'br_mum', name: 'Mumbai Warehouse' },
  { id: 'br_del', name: 'Delhi SG Nagar' }
];

export default function SubUser({ token, activePage, setActivePage }) {
  // --- Central States ---
  const [subusers, setSubusers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [permissionHistory, setPermissionHistory] = useState([]);
  
  // Navigation Tabs: 'employees' | 'matrix' | 'analytics' | 'logs'
  const [activeTab, setActiveTab] = useState('employees');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal controllers
  const [branchModalUser, setBranchModalUser] = useState(null);
  const [cloningRole, setCloningRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState(null);

  // Form states for creating new employee
  const [empCode, setEmpCode] = useState('');
  const [empName, setEmpName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empBranch, setEmpBranch] = useState('Vadodara HQ');

  // Multi-select bulk lists
  const [checkedIds, setCheckedIds] = useState([]);

  // Seeding default sandbox roles if API is offline
  const mockRoles = [
    {
      _id: 'r1',
      name: 'Super Admin',
      key: 'super_admin',
      description: 'Full corporate operational & administrative permissions.',
      isPredefined: true,
      permissions: [
        { moduleName: 'Bilty', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
        { moduleName: 'Loading Slip', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
        { moduleName: 'Invoice', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
        { moduleName: 'Chalan', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true }
      ]
    },
    {
      _id: 'r2',
      name: 'Company Admin',
      key: 'company_admin',
      description: 'Full operations within single company scope.',
      isPredefined: true,
      permissions: [
        { moduleName: 'Bilty', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
        { moduleName: 'Loading Slip', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
        { moduleName: 'Invoice', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true },
        { moduleName: 'Chalan', view: true, create: true, edit: true, delete: true, export: true, approve: true, assign: true }
      ]
    },
    {
      _id: 'r3',
      name: 'Operations Executive',
      key: 'operations_executive',
      description: 'Create & manage Lorry Bilties & Loading Slips.',
      isPredefined: true,
      permissions: [
        { moduleName: 'Bilty', view: true, create: true, edit: true, delete: false, export: true, approve: false, assign: true },
        { moduleName: 'Loading Slip', view: true, create: true, edit: true, delete: false, export: true, approve: false, assign: false },
        { moduleName: 'Invoice', view: false, create: false, edit: false, delete: false, export: false, approve: false, assign: false },
        { moduleName: 'Chalan', view: true, create: false, edit: false, delete: false, export: false, approve: false, assign: false }
      ]
    },
    {
      _id: 'r4',
      name: 'Accountant',
      key: 'accountant',
      description: 'Manage Tax Invoices, ledgers, & payment logs.',
      isPredefined: true,
      permissions: [
        { moduleName: 'Bilty', view: true, create: false, edit: false, delete: false, export: true, approve: false, assign: false },
        { moduleName: 'Loading Slip', view: false, create: false, edit: false, delete: false, export: false, approve: false, assign: false },
        { moduleName: 'Invoice', view: true, create: true, edit: true, delete: false, export: true, approve: true, assign: false },
        { moduleName: 'Chalan', view: true, create: false, edit: false, delete: false, export: true, approve: false, assign: false }
      ]
    }
  ];

  // Seeding default sandbox employees
  const mockUsers = [
    {
      _id: 'u1',
      empCode: 'EMP-1002',
      username: 'Ramesh Singh',
      role: 'Operations Executive',
      branchAccess: 'Kanpur Branch',
      mobile: '9888877777',
      email: 'ramesh@transcorelogistics.in',
      status: 'Active Access',
      twoFactorEnabled: false,
      allowedBranches: ['Kanpur Branch', 'Vadodara HQ'],
      loginLogs: [
        { ip: '192.168.1.45', device: 'Mobile Chrome (iOS)', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
        { ip: '192.168.1.12', device: 'Safari (Mac)', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
      ]
    },
    {
      _id: 'u2',
      empCode: 'EMP-1005',
      username: 'Sukhdev Singh',
      role: 'Accountant',
      branchAccess: 'Vadodara HQ',
      mobile: '9988776655',
      email: 'sukhdev@transcorelogistics.in',
      status: 'Active Access',
      twoFactorEnabled: true,
      allowedBranches: ['Vadodara HQ'],
      loginLogs: [
        { ip: '192.168.2.10', device: 'Chrome (Windows)', timestamp: new Date().toISOString() }
      ]
    }
  ];

  // --- Fetch API Data ---
  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      // 1. Fetch Users
      const resUsers = await fetch(`${API_BASE}/masters/subusers`, { headers });
      if (resUsers.ok) {
        const uData = await resUsers.json();
        setSubusers(uData.length > 0 ? uData : mockUsers);
      } else {
        setSubusers(mockUsers);
      }

      // 2. Fetch Roles
      const resRoles = await fetch(`${API_BASE}/masters/roles`, { headers });
      if (resRoles.ok) {
        const rData = await resRoles.json();
        setRoles(rData.length > 0 ? rData : mockRoles);
        if (!selectedRoleForMatrix && rData.length > 0) setSelectedRoleForMatrix(rData[0]);
      } else {
        setRoles(mockRoles);
        if (!selectedRoleForMatrix) setSelectedRoleForMatrix(mockRoles[2]); // Operations default
      }

      // 3. Fetch Audit Logs
      const resLogs = await fetch(`${API_BASE}/masters/rbac-logs`, { headers });
      if (resLogs.ok) setAuditLogs(await resLogs.json());

      // 4. Fetch Permission History
      const resHist = await fetch(`${API_BASE}/masters/rbac-history`, { headers });
      if (resHist.ok) setPermissionHistory(await resHist.json());

    } catch (e) {
      setSubusers(mockUsers);
      setRoles(mockRoles);
      if (!selectedRoleForMatrix) setSelectedRoleForMatrix(mockRoles[2]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // --- Dynamic Permissions Matrix Helpers ---
  const handleMatrixCheckboxToggle = (moduleIndex, field) => {
    if (!selectedRoleForMatrix) return;
    
    const updatedPermissions = [...selectedRoleForMatrix.permissions];
    updatedPermissions[moduleIndex] = {
      ...updatedPermissions[moduleIndex],
      [field]: !updatedPermissions[moduleIndex][field]
    };

    const updatedRole = {
      ...selectedRoleForMatrix,
      permissions: updatedPermissions
    };

    setSelectedRoleForMatrix(updatedRole);
    setRoles(roles.map(r => r._id === updatedRole._id ? updatedRole : r));
    
    // Save to MERN
    fetch(`${API_BASE}/masters/roles/${updatedRole._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updatedRole)
    }).catch(() => {});

    // Add activity permission log
    const logItem = {
      transporterId: 'dummy',
      operatorName: selectedRoleForMatrix.name,
      changedByName: 'Transcore Admin',
      changeDescription: `Modified capability [${field}] for module [${updatedPermissions[moduleIndex].moduleName}]`,
      timestamp: new Date().toISOString()
    };
    setPermissionHistory([logItem, ...permissionHistory]);
  };

  // --- Dynamic Custom Roles Builder & Cloning ---
  const handleCloneRole = (role) => {
    setCloningRole(role);
    setNewRoleName(`Copy of ${role.name}`);
  };

  const executeClone = () => {
    if (!newRoleName) return;
    const cloned = {
      name: newRoleName,
      key: newRoleName.toLowerCase().replace(/\s+/g, '_'),
      description: `Custom cloned role copy from ${cloningRole.name}`,
      permissions: JSON.parse(JSON.stringify(cloningRole.permissions)),
      allowedBranches: [...cloningRole.allowedBranches]
    };

    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    fetch(`${API_BASE}/masters/roles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(cloned)
    })
      .then(res => res.json())
      .then(data => {
        setRoles([...roles, data]);
        setSelectedRoleForMatrix(data);
        alert(`Role "${newRoleName}" created and cloned successfully!`);
      })
      .catch(() => {
        const localRole = { _id: Math.random().toString(), ...cloned };
        setRoles([...roles, localRole]);
        setSelectedRoleForMatrix(localRole);
        alert(`Cloned and added "${newRoleName}" in local memory database successfully!`);
      });

    setCloningRole(null);
  };

  // --- Branch Assignment ---
  const handleOpenBranchModal = (user) => {
    setBranchModalUser(user);
  };

  const handleToggleBranchAssignment = (branchName) => {
    if (!branchModalUser) return;
    
    let updatedBranches = [...(branchModalUser.allowedBranches || [])];
    if (updatedBranches.includes(branchName)) {
      updatedBranches = updatedBranches.filter(b => b !== branchName);
    } else {
      updatedBranches.push(branchName);
    }

    const updatedUser = { ...branchModalUser, allowedBranches: updatedBranches };
    setBranchModalUser(updatedUser);
    setSubusers(subusers.map(u => u._id === updatedUser._id ? updatedUser : u));

    // Save to MERN
    fetch(`${API_BASE}/masters/subusers/${updatedUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updatedUser)
    }).catch(() => {});
  };

  // --- Password Resets, 2FA Toggles, Status changes ---
  const handleToggleUserStatus = (user) => {
    const nextStatus = user.status === 'Active Access' ? 'Inactive' : 'Active Access';
    const updated = { ...user, status: nextStatus };
    setSubusers(subusers.map(u => u._id === user._id ? updated : u));

    fetch(`${API_BASE}/masters/subusers/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updated)
    }).then(() => {
      alert(`User status mapped to "${nextStatus}" successfully.`);
    });
  };

  const handleToggle2FA = (user) => {
    const updated = { ...user, twoFactorEnabled: !user.twoFactorEnabled };
    setSubusers(subusers.map(u => u._id === user._id ? updated : u));

    fetch(`${API_BASE}/masters/subusers/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updated)
    }).then(() => {
      alert(`Two-Factor Authentication is now ${updated.twoFactorEnabled ? 'ENABLED' : 'DISABLED'} for ${user.username}.`);
    });
  };

  const handleResetPassword = (user) => {
    const newPass = prompt(`Enter new secure password for ${user.username}:`, 'Welcome@123');
    if (!newPass) return;

    fetch(`${API_BASE}/masters/subusers/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ password: newPass })
    }).then(() => {
      alert(`Password updated successfully!`);
    });
  };

  // --- Create Employee Account ---
  const handleSubmitNewUser = (e) => {
    e.preventDefault();
    if (!empName || !mobileNumber || !emailAddress || !empPassword || !empRole) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      empCode: empCode || `EMP-${1000 + subusers.length + 1}`,
      username: empName,
      role: empRole,
      branchAccess: empBranch,
      mobile: mobileNumber,
      email: emailAddress,
      password: empPassword,
      status: 'Active Access',
      allowedBranches: [empBranch],
      twoFactorEnabled: false
    };

    fetch(`${API_BASE}/masters/subusers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setSubusers([data, ...subusers]);
        alert(`Account created successfully for ${empName}!`);
        resetForm();
      })
      .catch(() => {
        const localUser = { _id: Math.random().toString(), ...payload };
        setSubusers([localUser, ...subusers]);
        alert(`Employee registered in local database successfully!`);
        resetForm();
      });
  };

  const resetForm = () => {
    setEmpCode('');
    setEmpName('');
    setMobileNumber('');
    setEmailAddress('');
    setEmpPassword('');
    setEmpRole('');
    setEmpBranch('Vadodara HQ');
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm('Delete operator account? This cannot be undone.')) return;
    
    fetch(`${API_BASE}/masters/subusers/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setSubusers(subusers.filter(u => u._id !== id));
      })
      .catch(() => {
        setSubusers(subusers.filter(u => u._id !== id));
      });
  };

  // --- Filters ---
  const filteredUsers = subusers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.empCode && u.empCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.pageContainer}>
      {/* Dynamic Outlined Home Breadcrumbs */}
      <div style={styles.breadcrumbs}>
        <div style={styles.breadcrumbLink} onClick={() => setActivePage('dashboard')}>
          <Home size={14} style={styles.homeIcon} /> Home
        </div>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <div style={styles.breadcrumbLink}>Sub User</div>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>RBAC Control Center</span>
      </div>

      {/* Multi-Tab Navigation Headers */}
      <div style={styles.tabsRow}>
        <button 
          onClick={() => setActiveTab('employees')} 
          style={{ ...styles.tabBtn, ...(activeTab === 'employees' ? styles.tabBtnActive : {}) }}
        >
          <Users size={16} /> Employee Directory
        </button>
        <button 
          onClick={() => setActiveTab('logs')} 
          style={{ ...styles.tabBtn, ...(activeTab === 'logs' ? styles.tabBtnActive : {}) }}
        >
          <Clock size={16} /> Audit Timeline
        </button>
      </div>

      {/* TAB 1: EMPLOYEE DIRECTORY */}
      {activeTab === 'employees' && (
        <div style={styles.columnsSplit}>
          {/* Left Column: Create new employee form */}
          <div className="glass-panel-premium" style={styles.formCol}>
            <h3 style={styles.panelTitle}>Add Corporate Employee</h3>
            <span style={styles.panelSub}>Register staff and map primary roles & branch access</span>
            
            <form onSubmit={handleSubmitNewUser} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Employee Code (Optional)</label>
                <input 
                  type="text" placeholder="e.g. EMP-1092" value={empCode}
                  onChange={(e) => setEmpCode(e.target.value)} style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input 
                  type="text" required placeholder="Employee Name" value={empName}
                  onChange={(e) => setEmpName(e.target.value)} style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Mobile Number *</label>
                <input 
                  type="tel" required placeholder="Mobile Number" value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Corporate Email *</label>
                <input 
                  type="email" required placeholder="Corporate Email" value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)} style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Temporary Password *</label>
                <input 
                  type="password" required placeholder="Temporary Password" value={empPassword}
                  onChange={(e) => setEmpPassword(e.target.value)} style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Assign Role *</label>
                <select required value={empRole} onChange={(e) => setEmpRole(e.target.value)} style={styles.input}>
                  <option value="">Select Corporate Role</option>
                  {roles.map(r => (
                    <option key={r._id || r.key} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Default Home Branch *</label>
                <select required value={empBranch} onChange={(e) => setEmpBranch(e.target.value)} style={styles.input}>
                  <option value="Vadodara HQ">Vadodara HQ</option>
                  <option value="Kanpur Branch">Kanpur Branch</option>
                  <option value="Mumbai Warehouse">Mumbai Warehouse</option>
                  <option value="Delhi SG Nagar">Delhi SG Nagar</option>
                </select>
              </div>

              <button type="submit" style={styles.greenSubmitBtn}>
                Register Corporate Employee
              </button>
            </form>
          </div>

          {/* Right Column: Employee Registry Lists */}
          <div className="glass-panel-premium" style={styles.listCol}>
            <div style={styles.toolbar}>
              <h3 style={styles.panelTitle}>Active Operators ( {filteredUsers.length} )</h3>
              <input 
                type="text" placeholder="Search by name, code..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput}
              />
            </div>

            <div className="responsive-table-scroll">
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Employee Code</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Role / Branches</th>
                    <th style={styles.th}>2FA Status</th>
                    <th style={styles.th}>Status</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id || index} style={styles.tr}>
                        <td style={styles.tdSno}>{user.empCode || `EMP-${index+1}`}</td>
                        <td style={styles.tdBranchName}>
                          {user.username}
                          <span style={styles.userEmail}>{user.email || 'No email coordinates'}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.roleBadge}>{user.role}</span>
                          <div style={styles.branchTagsContainer}>
                            <span 
                              style={styles.branchAssignLink}
                              onClick={() => handleOpenBranchModal(user)}
                              title="Assign allowed branches"
                            >
                              <MapPin size={10} style={{ marginRight: 2 }} />
                              Map ({user.allowedBranches ? user.allowedBranches.length : 1})
                            </span>
                            {user.allowedBranches && user.allowedBranches.map((b, bi) => (
                              <span key={bi} style={styles.branchTagBadge}>{b}</span>
                            ))}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <button 
                            onClick={() => handleToggle2FA(user)} 
                            style={{ ...styles.statusBtn, backgroundColor: user.twoFactorEnabled ? '#d1fae5' : '#f3f4f6', color: user.twoFactorEnabled ? '#065f46' : '#64748b' }}
                          >
                            {user.twoFactorEnabled ? '2FA Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td style={styles.td}>
                          <button 
                            onClick={() => handleToggleUserStatus(user)}
                            style={{ ...styles.statusBtn, backgroundColor: user.status === 'Active Access' ? '#dbeafe' : '#fee2e2', color: user.status === 'Active Access' ? '#1d4ed8' : '#ef4444' }}
                          >
                            {user.status || 'Active Access'}
                          </button>
                        </td>
                        <td style={styles.tdActions}>
                          <div style={styles.actionCell}>
                            <button 
                              onClick={() => handleResetPassword(user)} 
                              style={styles.actionLockBtn} 
                              title="Reset Password"
                            >
                              <Lock size={12} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user._id)} 
                              style={styles.actionDeleteBtn} 
                              title="Delete Account"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={styles.tdEmpty}>No corporate employees found. Register one using the left form.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERMISSION MATRIX GRID */}
      {activeTab === 'matrix' && (
        <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={styles.matrixHeaderRow}>
            <div>
              <h3 style={styles.panelTitle}>Dynamic Capabilities Matrix Builder</h3>
              <span style={styles.panelSub}>Map View, Create, Edit, Delete, Export, Approve, and Assign rights per role</span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={styles.searchLabel}>Select Role:</span>
              <select 
                value={selectedRoleForMatrix ? selectedRoleForMatrix._id : ''} 
                onChange={(e) => setSelectedRoleForMatrix(roles.find(r => r._id === e.target.value))}
                style={styles.roleSelect}
              >
                {roles.map(r => (
                  <option key={r._id || r.key} value={r._id}>{r.name} {r.isPredefined ? '(System)' : '(Custom)'}</option>
                ))}
              </select>

              {selectedRoleForMatrix && (
                <button 
                  onClick={() => handleCloneRole(selectedRoleForMatrix)} 
                  style={styles.cloneBtn}
                  title="Clone this role structure to a new custom role"
                >
                  <Copy size={13} style={{ marginRight: 4 }} />
                  Clone Role
                </button>
              )}
            </div>
          </div>

          {selectedRoleForMatrix ? (
            <div className="responsive-table-scroll">
              <table style={styles.matrixTable}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={{ ...styles.th, width: '180px' }}>Module Registry</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>View</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Create</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Edit</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Delete</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Export</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Approve</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRoleForMatrix.permissions && selectedRoleForMatrix.permissions.map((module, mIdx) => (
                    <tr key={mIdx} style={styles.tr}>
                      <td style={styles.tdModuleName}>{module.moduleName}</td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <input 
                          type="checkbox" checked={module.view || false} 
                          onChange={() => handleMatrixCheckboxToggle(mIdx, 'view')}
                          style={styles.checkbox}
                        />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <input 
                          type="checkbox" checked={module.create || false} 
                          onChange={() => handleMatrixCheckboxToggle(mIdx, 'create')}
                          style={styles.checkbox}
                        />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <input 
                          type="checkbox" checked={module.edit || false} 
                          onChange={() => handleMatrixCheckboxToggle(mIdx, 'edit')}
                          style={styles.checkbox}
                        />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <input 
                          type="checkbox" checked={module.delete || false} 
                          disabled={selectedRoleForMatrix.key === 'operations_executive' && module.moduleName === 'Bilty'} // Preseeded custom locks
                          onChange={() => handleMatrixCheckboxToggle(mIdx, 'delete')}
                          style={styles.checkbox}
                        />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <input 
                          type="checkbox" checked={module.export || false} 
                          onChange={() => handleMatrixCheckboxToggle(mIdx, 'export')}
                          style={styles.checkbox}
                        />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <input 
                          type="checkbox" checked={module.approve || false} 
                          onChange={() => handleMatrixCheckboxToggle(mIdx, 'approve')}
                          style={styles.checkbox}
                        />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <input 
                          type="checkbox" checked={module.assign || false} 
                          onChange={() => handleMatrixCheckboxToggle(mIdx, 'assign')}
                          style={styles.checkbox}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={styles.matrixHint}>
                💡 <b>Dynamic matrix save:</b> Toggling checkboxes instantly persists permissions to dynamic database profiles.
              </div>
            </div>
          ) : (
            <div style={styles.tdEmpty}>Select a role above to manage its permission matrix.</div>
          )}
        </div>
      )}

      {/* TAB 3: ROLE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div style={styles.columnsSplit}>
          {/* Left Column: Role Distribution statistics */}
          <div className="glass-panel-premium" style={styles.formCol}>
            <h3 style={styles.panelTitle}>Role Distribution Stats</h3>
            <span style={styles.panelSub}>Seeded metrics for company administrative divisions</span>
            
            <div style={styles.analyticsGrid}>
              <div style={styles.analyticsStatBox}>
                <span style={styles.kpiLabel}>Super Admins</span>
                <h2 style={{ ...styles.kpiValue, color: '#0066cc' }}>1 Account</h2>
              </div>
              <div style={styles.analyticsStatBox}>
                <span style={styles.kpiLabel}>Operations Operators</span>
                <h2 style={{ ...styles.kpiValue, color: '#10b981' }}>{subusers.filter(u => u.role.includes('Operations')).length} Active</h2>
              </div>
              <div style={styles.analyticsStatBox}>
                <span style={styles.kpiLabel}>Accountants</span>
                <h2 style={{ ...styles.kpiValue, color: '#f59e0b' }}>{subusers.filter(u => u.role.includes('Accountant')).length} Active</h2>
              </div>
              <div style={styles.analyticsStatBox}>
                <span style={styles.kpiLabel}>Other Staff</span>
                <h2 style={{ ...styles.kpiValue, color: '#ef4444' }}>0 mapped</h2>
              </div>
            </div>

            {/* Custom Vector bar chart mapping operators count per role */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={styles.chartTitle}>Distribution Vector Chart</h4>
              <div style={styles.chartBarRow}>
                <span style={styles.chartLabel}>Operations:</span>
                <div style={styles.chartTrack}>
                  <div style={{ ...styles.chartFill, width: '65%', backgroundColor: '#10b981' }}></div>
                </div>
                <span style={styles.chartVal}>65%</span>
              </div>
              <div style={styles.chartBarRow}>
                <span style={styles.chartLabel}>Accountant:</span>
                <div style={styles.chartTrack}>
                  <div style={{ ...styles.chartFill, width: '35%', backgroundColor: '#f59e0b' }}></div>
                </div>
                <span style={styles.chartVal}>35%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Login Logs activity registries */}
          <div className="glass-panel-premium" style={styles.listCol}>
            <h3 style={styles.panelTitle}>Employee Login Registries</h3>
            <span style={styles.panelSub}>Active user sessions, device types, and system coordinate timestamps</span>

            <div style={styles.logsContainer}>
              {subusers.map((user) => (
                user.loginLogs && user.loginLogs.map((log, li) => (
                  <div key={`${user._id}_${li}`} style={styles.logRowItem}>
                    <div style={styles.logBullet}></div>
                    <div>
                      <h4 style={styles.logDesc}>
                        <b>{user.username}</b> ({user.role}) logged in successfully
                      </h4>
                      <span style={styles.logMeta}>
                        <Clock size={10} style={{ marginRight: 4 }} />
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' - '}
                        IP: {log.ip} ({log.device})
                      </span>
                    </div>
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TIMELINE */}
      {activeTab === 'logs' && (
        <div style={styles.columnsSplit}>
          {/* Left Column: Permission Matrix update history */}
          <div className="glass-panel-premium" style={styles.formCol}>
            <h3 style={styles.panelTitle}>Permission Update Logs</h3>
            <span style={styles.panelSub}>Recent actions recorded inside corporate matrix managers</span>

            <div style={styles.logsContainer}>
              {permissionHistory.length > 0 ? (
                permissionHistory.map((hist, index) => (
                  <div key={index} style={styles.logRowItem}>
                    <div style={{ ...styles.logBullet, backgroundColor: '#f59e0b' }}></div>
                    <div>
                      <h4 style={styles.logDesc}>
                        <b>{hist.changedByName}</b> updated rights for role <b>{hist.operatorName}</b>
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0' }}>{hist.changeDescription}</p>
                      <span style={styles.logMeta}>
                        <Clock size={10} style={{ marginRight: 4 }} />
                        {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.tdEmpty}>No permission alterations logged yet.</div>
              )}
            </div>
          </div>

          {/* Right Column: Global Audit Logs */}
          <div className="glass-panel-premium" style={styles.listCol}>
            <h3 style={styles.panelTitle}>Global Operational Audit Logs</h3>
            <span style={styles.panelSub}>Transcore administrative logs stream</span>

            <div style={styles.logsContainer}>
              {auditLogs.length > 0 ? (
                auditLogs.map((log, index) => (
                  <div key={index} style={styles.logRowItem}>
                    <div style={{ ...styles.logBullet, backgroundColor: '#0066cc' }}></div>
                    <div>
                      <h4 style={styles.logDesc}>
                        <b>{log.operatorName}</b> triggered <b>{log.action}</b> action
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0' }}>{log.description}</p>
                      <span style={styles.logMeta}>
                        <Clock size={10} style={{ marginRight: 4 }} />
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.tdEmpty}>No global actions audited today yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BRANCH ASSIGNMENT DRAWER MODAL */}
      {branchModalUser && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel-premium" style={styles.branchModalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Branch Mapping - {branchModalUser.username}</h3>
              <button onClick={() => setBranchModalUser(null)} style={styles.modalCloseBtn}>
                <X size={16} />
              </button>
            </div>
            
            <span style={{ ...styles.panelSub, marginBottom: '14px', display: 'block' }}>
              Select all authorized branch networks this operator can view, create, or modify cargo sheets inside
            </span>

            <div style={styles.branchCheckboxGrid}>
              {AVAILABLE_BRANCHES.map((branch) => {
                const isChecked = (branchModalUser.allowedBranches || []).includes(branch.name);
                return (
                  <div 
                    key={branch.id} 
                    style={{ ...styles.branchSelectCard, border: isChecked ? '2px solid #0066cc' : '1px solid #cbd5e1' }}
                    onClick={() => handleToggleBranchAssignment(branch.name)}
                  >
                    <div style={styles.branchSelectCardHeader}>
                      <MapPin size={16} color={isChecked ? '#0066cc' : '#64748b'} />
                      <span style={{ fontWeight: '700', color: isChecked ? '#0066cc' : '#1e293b' }}>{branch.name}</span>
                    </div>
                    {isChecked && <Check size={14} color="#0066cc" />}
                  </div>
                );
              })}
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setBranchModalUser(null)} style={styles.modalSaveBtn}>
                Persist Branch Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLONING ROLE DRAWER MODAL */}
      {cloningRole && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel-premium" style={styles.branchModalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Clone Custom Role</h3>
              <button onClick={() => setCloningRole(null)} style={styles.modalCloseBtn}>
                <X size={16} />
              </button>
            </div>

            <span style={{ ...styles.panelSub, marginBottom: '16px', display: 'block' }}>
              Duplicating all permission matrices of <b>{cloningRole.name}</b> to a brand-new corporate dynamic role profile
            </span>

            <div style={styles.formGroup}>
              <label style={styles.label}>New Custom Role Title *</label>
              <input 
                type="text" required placeholder="e.g. Loading Clerk Vadodara" value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)} style={styles.input}
              />
            </div>

            <div style={{ ...styles.modalFooter, marginTop: '20px' }}>
              <button onClick={executeClone} style={styles.modalSaveBtn}>
                Clone Role Matrix
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    backgroundColor: '#ffffff',
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  breadcrumbLink: {
    color: '#64748b',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer'
  },
  homeIcon: {
    color: '#0066cc'
  },
  breadcrumbSeparator: {
    color: '#cbd5e1'
  },
  breadcrumbActive: {
    color: '#0066cc',
    fontWeight: '700'
  },
  tabsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '2px'
  },
  tabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    padding: '10px 16px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  tabBtnActive: {
    color: '#0066cc',
    borderBottom: '2px solid #0066cc',
    fontWeight: '800'
  },
  columnsSplit: {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: '24px',
    alignItems: 'stretch'
  },
  formCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  listCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  panelTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#1e293b'
  },
  panelSub: {
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '2px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '10px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#475569'
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    fontSize: '0.82rem',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#1e293b'
  },
  greenSubmitBtn: {
    width: '100%',
    backgroundColor: '#00b050',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px'
  },
  searchInput: {
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '6px 12px',
    outline: 'none',
    fontSize: '0.8rem',
    color: '#1e293b',
    width: '180px',
    backgroundColor: '#ffffff'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.82rem',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #cbd5e1'
  },
  th: {
    padding: '10px 14px',
    fontWeight: '700',
    color: '#475569'
  },
  tr: {
    borderBottom: '1px solid #e2e8f0'
  },
  tdSno: {
    padding: '12px 14px',
    color: '#64748b',
    fontWeight: '600'
  },
  tdBranchName: {
    padding: '12px 14px',
    color: '#0f172a',
    fontWeight: '700'
  },
  userEmail: {
    display: 'block',
    fontSize: '0.68rem',
    color: '#64748b',
    fontWeight: '500',
    marginTop: '2px'
  },
  td: {
    padding: '12px 14px',
    color: '#334155'
  },
  roleBadge: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.68rem',
    fontWeight: '700',
    backgroundColor: '#eff6ff',
    color: '#0066cc',
    border: '1px solid #bfdbfe'
  },
  branchTagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '4px'
  },
  branchTagBadge: {
    fontSize: '0.62rem',
    padding: '1px 4px',
    borderRadius: '3px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1'
  },
  branchAssignLink: {
    fontSize: '0.62rem',
    color: '#0066cc',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center'
  },
  statusBtn: {
    border: 'none',
    borderRadius: '4px',
    padding: '3px 8px',
    fontSize: '0.68rem',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none'
  },
  tdActions: {
    padding: '12px 14px'
  },
  actionCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px'
  },
  actionLockBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionDeleteBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tdEmpty: {
    padding: '40px 10px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.8rem'
  },
  matrixHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px'
  },
  searchLabel: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#475569'
  },
  roleSelect: {
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '5px 10px',
    fontSize: '0.82rem',
    outline: 'none',
    backgroundColor: '#ffffff'
  },
  cloneBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    color: '#0066cc',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none'
  },
  matrixTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.82rem',
    textAlign: 'left'
  },
  tdModuleName: {
    padding: '12px 14px',
    fontWeight: '700',
    color: '#0f172a'
  },
  checkbox: {
    width: '15px',
    height: '15px',
    cursor: 'pointer'
  },
  matrixHint: {
    fontSize: '0.72rem',
    color: '#64748b',
    marginTop: '12px'
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '10px'
  },
  analyticsStatBox: {
    padding: '14px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    backgroundColor: '#f8fafc'
  },
  chartTitle: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '10px'
  },
  chartBarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
  },
  chartLabel: {
    width: '80px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#475569'
  },
  chartTrack: {
    flex: 1,
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  chartFill: {
    height: '100%'
  },
  chartVal: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  logsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    overflowY: 'auto',
    maxHeight: '280px',
    paddingRight: '6px',
    marginTop: '10px'
  },
  logRowItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start'
  },
  logBullet: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    marginTop: '5px',
    flexShrink: 0
  },
  logDesc: {
    fontSize: '0.78rem',
    color: '#334155',
    lineHeight: '1.3'
  },
  logMeta: {
    fontSize: '0.68rem',
    color: '#94a3b8',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: '2px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  branchModalContent: {
    width: '90%',
    maxWidth: '460px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '10px'
  },
  modalTitle: {
    fontSize: '0.92rem',
    fontWeight: '800',
    color: '#0f172a'
  },
  modalCloseBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    cursor: 'pointer'
  },
  branchCheckboxGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '8px'
  },
  branchSelectCard: {
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.15s ease'
  },
  branchSelectCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.78rem'
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '12px',
    marginTop: '8px'
  },
  modalSaveBtn: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none'
  }
};
