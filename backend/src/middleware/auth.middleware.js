'use strict';
const { verifyToken } = require('../utils/jwt');

// ─── Role hierarchy ───────────────────────────────────────────────────────────
// Used to resolve which roles are "at least" a given level.
const ROLES = ['patient', 'caregiver', 'healthcare_worker', 'admin'];

// ─── authenticate ─────────────────────────────────────────────────────────────

/**
 * Middleware: verify the JWT in the Authorization header.
 * On success:  populates req.user with the decoded payload and calls next().
 * On failure:  returns 401 Unauthorized.
 *
 * Expected header:
 *   Authorization: Bearer <token>
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.slice(7).trim(); // Remove "Bearer "

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { sub: userId, role, iat, exp, iss }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed token.'
    });
  }
}

// ─── authorize ────────────────────────────────────────────────────────────────

/**
 * Middleware factory: role-based authorization.
 * Call AFTER authenticate() in your route chain.
 *
 * Usage:
 *   router.get('/admin-only', authenticate, authorize('admin'), handler)
 *   router.get('/staff',      authenticate, authorize('caregiver', 'healthcare_worker', 'admin'), handler)
 *
 * @param {...string} allowedRoles - One or more roles that may access the route.
 * @returns {Function} Express middleware
 */
function authorize(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userRole = req.user.role.toLowerCase();

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
}

// ─── authorizeMinRole ─────────────────────────────────────────────────────────

/**
 * Middleware factory: hierarchical role authorization.
 * Allows the specified role AND any role ranked higher in the hierarchy.
 *
 * Hierarchy (lowest → highest):
 *   patient → caregiver → healthcare_worker → admin
 *
 * Usage:
 *   authorize.minRole('caregiver')  — allows caregiver, healthcare_worker, admin
 *
 * @param {string} minimumRole
 * @returns {Function} Express middleware
 */
function authorizeMinRole(minimumRole) {
  const minIndex = ROLES.indexOf(minimumRole.toLowerCase());

  if (minIndex === -1) {
    throw new Error(`authorizeMinRole: unknown role "${minimumRole}"`);
  }

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userIndex = ROLES.indexOf(req.user.role.toLowerCase());

    if (userIndex < minIndex) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Minimum required role: ${minimumRole}.`
      });
    }

    next();
  };
}

module.exports = { authenticate, authorize, authorizeMinRole };
