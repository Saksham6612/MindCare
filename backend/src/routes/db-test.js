const { Router } = require('express');
const { pool } = require('../config/database');

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW() AS database_time');

    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      databaseTime: result.rows[0].database_time
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;