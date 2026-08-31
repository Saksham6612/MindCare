'use strict';

const { Router } = require('express');
const { pool } = require('../config/database');
const authRoutes = require('./auth.routes');
const reminderRoutes = require('./reminder.routes');
const progressRoutes = require('./progress.routes');
const activityRoutes = require('./activity.routes');

const router = Router();

// ── Auth routes ─────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ── Reminder routes ─────────────────────────────────────────────────────────
router.use('/reminders', reminderRoutes);

// ── Progress routes ─────────────────────────────────────────────────────────
router.use('/progress', progressRoutes);

// ── Activity routes ─────────────────────────────────────────────────────────
router.use('/activity', activityRoutes);

// GET /api/health
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'MindCare API is running'
  });
});

// GET /api/health/db-test
router.get('/health/db-test', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW() AS database_time');

    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      databaseTime: result.rows[0].database_time
    });
  } catch (error) {
    console.error('[DB TEST ERROR]', error);
    next(error);
  }
});

// GET /api/games
router.get('/games', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        description,
        category,
        difficulty,
        language,
        is_active
      FROM games
      WHERE is_active = true
      ORDER BY name ASC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      games: result.rows
    });
  } catch (error) {
    console.error('[GAMES ERROR]', error);
    next(error);
  }
});

module.exports = router;