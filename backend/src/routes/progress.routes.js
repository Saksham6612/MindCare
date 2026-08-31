'use strict';
const { Router } = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getPatientProgress } = require('../controllers/progress.controller');

const router = Router();

// GET /api/progress - Secured with JWT authenticate middleware
router.get('/', authenticate, getPatientProgress);

module.exports = router;
