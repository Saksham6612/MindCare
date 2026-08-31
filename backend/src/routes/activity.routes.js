'use strict';
const { Router } = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { getRecentActivities } = require('../controllers/activity.controller');

const router = Router();

// GET /api/activity/recent - Secured with JWT authenticate middleware
router.get('/recent', authenticate, getRecentActivities);

module.exports = router;
