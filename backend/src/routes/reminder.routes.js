'use strict';
const { Router } = require('express');
const {
  createReminder,
  getTodayReminders,
  getNextReminder,
  getDueReminders
} = require('../controllers/reminder.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

/**
 * POST /api/reminders
 * Protected: Requires Authorization: Bearer <token>
 */
router.post('/', authenticate, createReminder);

/**
 * GET /api/reminders/due
 * Protected: Requires Authorization: Bearer <token>
 */
router.get('/due', authenticate, getDueReminders);

/**
 * GET /api/reminders/next
 * Protected: Requires Authorization: Bearer <token>
 */
router.get('/next', authenticate, getNextReminder);

/**
 * GET /api/reminders/today
 * Protected: Requires Authorization: Bearer <token>
 */
router.get('/today', authenticate, getTodayReminders);

/**
 * GET /api/reminders
 * Protected: Requires Authorization: Bearer <token>
 */
router.get('/', authenticate, getTodayReminders);

module.exports = router;
