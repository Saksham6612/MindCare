const { query } = require('../config/database');

/**
 * GET /api/health
 * Returns server and database status.
 */
const getHealth = async (req, res, next) => {
  try {
    // Probe database connectivity
    let dbStatus = 'connected';
    let dbTime = null;

    try {
      const result = await query('SELECT NOW() AS now');
      dbTime = result.rows[0].now;
    } catch (dbErr) {
      dbStatus = 'disconnected';
      console.warn('[Health] Database probe failed:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'MindCare API is running',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        ...(dbTime && { serverTime: dbTime })
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHealth };
