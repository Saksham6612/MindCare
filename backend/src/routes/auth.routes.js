'use strict';
const { Router } = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

/**
 * POST /api/auth/register
 * Public — create a new user account.
 * Body: { name, email, password, role?, language? }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Public — authenticate and receive a JWT.
 * Body: { email, password }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Protected — return the authenticated user's profile.
 * Requires: Authorization: Bearer <token>
 */
router.get('/me', authenticate, getMe);

module.exports = router;
