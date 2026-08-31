'use strict';

const { Router } = require('express');

const healthRoutes = require('./health');
const dbTestRoutes = require('./db-test');
const authRoutes = require('./auth.routes');

const router = Router();

// Health
router.use('/health', healthRoutes);

// Database test
router.use('/health', dbTestRoutes);

// Authentication
router.use('/auth', authRoutes);

module.exports = router;