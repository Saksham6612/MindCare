'use strict';

const { Router } = require('express');
const { pool } = require('../config/database');

const router = Router();

// GET /api/health
router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'MindCare API is running'
  });
});

// GET /api/health/db-test
router.get('/db-test', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW() AS database_time');

    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      databaseTime: result.rows[0].database_time
    });
  } catch (error) {
    console.error('[DB TEST]', error.message);
    next(error);
  }
});

module.exports = router;