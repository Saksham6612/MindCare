'use strict';
const { query } = require('../config/database');

/**
 * GET /api/activity/recent
 * Retrieves recent completed activities for the authenticated patient.
 */
async function getRecentActivities(req, res, next) {
  try {
    const patientId = req.user && req.user.sub;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Patient ID not found in token.'
      });
    }

    const sql = `
      SELECT
        id,
        activity_type,
        title,
        description,
        completed,
        completed_at
      FROM activities
      WHERE patient_id = $1 AND completed = true
      ORDER BY completed_at DESC
      LIMIT 5;
    `;
    const result = await query(sql, [patientId]);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      activities: result.rows
    });
  } catch (error) {
    console.error('[GET /api/activity/recent ERROR]', error);
    next(error);
  }
}

module.exports = {
  getRecentActivities
};
