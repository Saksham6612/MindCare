'use strict';
const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET  || 'mindcare_dev_secret_change_in_production';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign a JWT containing the user's id and role.
 * @param {{ id: string, role: string }} payload
 * @returns {string} signed token
 */
function signToken(payload) {
  return jwt.sign(
    { sub: payload.id, role: payload.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES, issuer: 'mindcare-api' }
  );
}

/**
 * Verify a JWT and return its decoded payload.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, { issuer: 'mindcare-api' });
}

module.exports = { signToken, verifyToken };
