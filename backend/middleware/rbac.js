const { getModel } = require('../config/db');
const { SubUserSchema, RoleSchema } = require('../models/schemas');

const SubUser = getModel('SubUser', SubUserSchema);
const Role = getModel('Role', RoleSchema);

/**
 * Enterprise Route-Level RBAC Authorization Middleware
 * @param {string} moduleName - The target module (e.g., 'bilty', 'invoice')
 * @param {string} action - The action type ('view', 'create', 'edit', 'delete', 'export', 'approve', 'assign')
 */
const checkPermission = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId;
      
      // 1. Check if the user is a main Transporter Account (has super/company admin bypass)
      // Transporter accounts are registered in the main User schema. If we find them, they bypass checks.
      const { UserSchema } = require('../models/schemas');
      const User = getModel('User', UserSchema);
      const isMainTransporter = await User.findById(userId);

      if (isMainTransporter) {
        // Direct Owner/Admin has bypass permissions
        req.userRole = 'company_admin';
        req.allowedBranches = ['ALL'];
        return next();
      }

      // 2. Query SubUser registry if not the main Transporter owner
      const subuser = await SubUser.findById(userId);
      if (!subuser) {
        return res.status(403).json({ error: 'Access Denied. Operator account not found.' });
      }

      // If user account is suspended/inactive, reject instantly
      if (subuser.status === 'Inactive') {
        return res.status(403).json({ error: 'Access Denied. This operator account is suspended/inactive.' });
      }

      // Add allowed branch constraints to the request context for database isolation
      req.allowedBranches = subuser.allowedBranches && subuser.allowedBranches.length > 0 
        ? subuser.allowedBranches 
        : [subuser.branchAccess];

      // 3. Lookup dynamic Role
      // Support prefilled matches or database lookups
      const roleKey = subuser.role.toLowerCase().replace(/\s+/g, '_');
      req.userRole = roleKey;

      const role = await Role.findOne({ 
        transporterId: subuser.transporterId,
        $or: [{ key: roleKey }, { name: subuser.role }]
      });

      // Direct fallback bypass if testing locally without seeded roles
      if (!role) {
        // Safe sandbox default permissions if db is unpopulated:
        // Operations Executives can manage bilties/loading slips.
        // Accountants can manage invoices/ledgers.
        const isOps = roleKey.includes('operations') || roleKey.includes('clerk');
        const isAcct = roleKey.includes('accountant') || roleKey.includes('ledger');
        
        if (moduleName === 'bilty' || moduleName === 'loading-slip' || moduleName === 'chalan') {
          if (isOps && ['view', 'create', 'edit'].includes(action)) return next();
        }
        if (moduleName === 'invoice' || moduleName === 'voucher' || moduleName === 'ledger') {
          if (isAcct && ['view', 'create', 'edit'].includes(action)) return next();
        }
        
        // Let other master queries proceed in developer mode
        if (roleKey === 'super_admin') return next();
        
        return res.status(403).json({ 
          error: `Insufficient Permissions. Role [${subuser.role}] lacks capability [${action}] on module [${moduleName}].` 
        });
      }

      // 4. Inspect Dynamic Permission Matrix
      const permissionMatrix = role.permissions || [];
      const modulePermissions = permissionMatrix.find(p => p.moduleName.toLowerCase() === moduleName.toLowerCase());

      if (!modulePermissions || !modulePermissions[action]) {
        return res.status(403).json({ 
          error: `Access Denied. Your role [${role.name}] does not have permission to ${action} ${moduleName}.` 
        });
      }

      // Authorization succeeded
      next();
    } catch (err) {
      console.error('🛡️ RBAC Middleware Error:', err);
      res.status(500).json({ error: 'Internal Authorization error.' });
    }
  };
};

module.exports = { checkPermission };
