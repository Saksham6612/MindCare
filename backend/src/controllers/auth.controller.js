'use strict';
const bcrypt = require('bcrypt');
const { query } = require('../config/database');
const { signToken } = require('../utils/jwt');
const { validateRegister, validateLogin } = require('../utils/validation');

const BCRYPT_ROUNDS = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip password_hash before sending a user object to the client. */
function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { name, email, password, role?, language? }
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role = 'patient', language = 'en' } = req.body;

    // Input validation
    const { valid, errors } = validateRegister({ name, email, password, role });
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRole  = role.toLowerCase();

    // Check duplicate email
    const existing = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists.'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Insert user
    const insertResult = await query(
      `INSERT INTO users (name, email, password_hash, role, language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, language, is_active, created_at`,
      [name.trim(), normalizedEmail, password_hash, normalizedRole, language]
    );

    const user  = insertResult.rows[0];
    const token = signToken({ id: user.id, role: user.role });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Input validation
    const { valid, errors } = validateLogin({ email, password });
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Fetch user — intentionally use the same generic message for both "not found"
    // and "wrong password" to prevent email enumeration attacks.
    const result = await query(
      `SELECT id, name, email, password_hash, role, language, is_active, created_at
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Check account status
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken({ id: user.id, role: user.role });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    next(err);
  }
}

// ─── Me ───────────────────────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 * Requires: valid JWT in Authorization header.
 * Returns the authenticated user's profile (with patient_profiles data if applicable).
 */
async function getMe(req, res, next) {
  try {
    // req.user is set by the authenticate middleware
    const userId = req.user.sub;

    const result = await query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.role,
         u.language,
         u.is_active,
         u.created_at,
         -- Patient profile fields (NULL for non-patients)
         pp.date_of_birth,
         pp.emergency_contact,
         pp.preferred_language,
         pp.avatar_url
       FROM users u
       LEFT JOIN patient_profiles pp ON pp.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = result.rows[0];

    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
