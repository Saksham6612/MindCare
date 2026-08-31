'use strict';
/**
 * Input validation helpers for auth routes.
 * Keeps controllers clean — each function returns { valid, errors }.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate register payload.
 * @param {{ name, email, password, role }} body
 */
function validateRegister({ name, email, password, role }) {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name must be at least 2 characters.');
  }
  if (!email || !EMAIL_RE.test(email)) {
    errors.push('A valid email address is required.');
  }
  if (!password || password.length < 8) {
    errors.push('password must be at least 8 characters.');
  }

  const VALID_ROLES = ['patient', 'caregiver', 'healthcare_worker', 'admin'];
  if (role && !VALID_ROLES.includes(role.toLowerCase())) {
    errors.push(`role must be one of: ${VALID_ROLES.join(', ')}.`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate login payload.
 * @param {{ email, password }} body
 */
function validateLogin({ email, password }) {
  const errors = [];

  if (!email || !EMAIL_RE.test(email)) {
    errors.push('A valid email address is required.');
  }
  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('password is required.');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateRegister, validateLogin };
