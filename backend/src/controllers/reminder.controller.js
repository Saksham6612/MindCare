'use strict';
const { query } = require('../config/database');

/**
 * Helper to infer reminder_type from title/task text.
 * Allowed enum values in schema: 'medicine', 'hydration', 'activity', 'appointment'
 */
function inferReminderType(text = '', explicitType) {
  if (explicitType && ['medicine', 'hydration', 'activity', 'appointment'].includes(String(explicitType).toLowerCase())) {
    return String(explicitType).toLowerCase();
  }
  const lower = String(text).toLowerCase();
  if (
    lower.includes('water') ||
    lower.includes('hydration') ||
    lower.includes('drink') ||
    lower.includes('tea') ||
    lower.includes('juice') ||
    lower.includes('glass')
  ) {
    return 'hydration';
  }
  if (
    lower.includes('medicine') ||
    lower.includes('tablet') ||
    lower.includes('pill') ||
    lower.includes('medication') ||
    lower.includes('dose') ||
    lower.includes('drops') ||
    lower.includes('syrup') ||
    lower.includes('capsule') ||
    lower.includes('injection')
  ) {
    return 'medicine';
  }
  if (
    lower.includes('doctor') ||
    lower.includes('appointment') ||
    lower.includes('clinic') ||
    lower.includes('hospital') ||
    lower.includes('checkup') ||
    lower.includes('check up') ||
    lower.includes('visit')
  ) {
    return 'appointment';
  }
  return 'activity';
}

/**
 * POST /api/reminders
 * 
 * Creates a new reminder for the authenticated patient in PostgreSQL.
 * Body: { title, reminder_time, reminder_date?, type?, description? }
 * Protected: Requires Authorization: Bearer <token>
 */
async function createReminder(req, res, next) {
  try {
    const userId = req.user.sub;
    const userRole = req.user.role;
    const { title, reminder_time, reminder_date, type, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reminder title/task is required.'
      });
    }

    if (!reminder_time || !reminder_time.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reminder time is required.'
      });
    }

    // Always use patient ID from JWT (or linked patient if caregiver)
    let patientId = userId;
    if (userRole === 'caregiver' && req.body.patient_id) {
      patientId = req.body.patient_id;
    }

    const cleanTitle = title.trim();
    const cleanTime = reminder_time.trim();
    const targetDate = reminder_date || new Date().toLocaleDateString('en-CA');
    const reminderType = inferReminderType(cleanTitle, type);
    const cleanDesc = description ? description.trim() : null;

    const result = await query(
      `INSERT INTO reminders
         (patient_id, type, title, description, reminder_date, reminder_time, is_completed)
       VALUES
         ($1, $2, $3, $4, $5::DATE, $6::TIME, FALSE)
       RETURNING
         id,
         patient_id,
         type,
         title,
         description,
         TO_CHAR(reminder_date, 'YYYY-MM-DD') AS reminder_date,
         TO_CHAR(reminder_time, 'HH24:MI') AS reminder_time,
         is_completed,
         created_at`,
      [patientId, reminderType, cleanTitle, cleanDesc, targetDate, cleanTime]
    );

    return res.status(201).json({
      success: true,
      message: 'Reminder created successfully.',
      reminder: result.rows[0]
    });
  } catch (err) {
    console.error('[CREATE REMINDER ERROR]', err);
    next(err);
  }
}

/**
 * GET /api/reminders/today
 * or GET /api/reminders?date=YYYY-MM-DD
 * 
 * Returns reminders for the authenticated patient for the given date (default: today).
 * Protected: Requires Authorization: Bearer <token>
 */
async function getTodayReminders(req, res, next) {
  try {
    const userId = req.user.sub;
    const userRole = req.user.role;

    // Determine target local date
    const targetDate = req.query.date || new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'

    let patientId = userId;
    // Caregivers can inspect linked patient reminders
    if (userRole === 'caregiver' && req.query.patientId) {
      patientId = req.query.patientId;
    }

    const result = await query(
      `SELECT
         id,
         patient_id,
         type,
         title,
         description,
         TO_CHAR(reminder_date, 'YYYY-MM-DD') AS reminder_date,
         TO_CHAR(reminder_time, 'HH24:MI') AS reminder_time,
         is_completed,
         completed_at,
         created_at
       FROM reminders
       WHERE patient_id = $1 AND reminder_date = $2::DATE
       ORDER BY reminder_time ASC`,
      [patientId, targetDate]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      date: targetDate,
      reminders: result.rows
    });
  } catch (err) {
    console.error('[GET TODAY REMINDERS ERROR]', err);
    next(err);
  }
}

/**
 * GET /api/reminders/next
 * 
 * Returns the next upcoming incomplete reminder for the authenticated patient for today.
 * Query parameters:
 *   - date (optional): 'YYYY-MM-DD'
 *   - time (optional): 'HH:MM' or 'HH:MM:SS'
 * Protected: Requires Authorization: Bearer <token>
 */
async function getNextReminder(req, res, next) {
  try {
    const userId = req.user.sub;
    const userRole = req.user.role;

    // Determine target date (default: local date YYYY-MM-DD)
    const targetDate = req.query.date || new Date().toLocaleDateString('en-CA');

    // Determine target time (default: current local time HH:MM)
    const now = new Date();
    const currentTime =
      req.query.time ||
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let patientId = userId;
    if (userRole === 'caregiver' && req.query.patientId) {
      patientId = req.query.patientId;
    }

    const result = await query(
      `SELECT
         id,
         patient_id,
         type,
         title,
         description,
         TO_CHAR(reminder_date, 'YYYY-MM-DD') AS reminder_date,
         TO_CHAR(reminder_time, 'HH24:MI') AS reminder_time,
         is_completed,
         completed_at,
         created_at
       FROM reminders
       WHERE patient_id = $1
         AND reminder_date = $2::DATE
         AND is_completed = FALSE
         AND reminder_time >= $3::TIME
       ORDER BY reminder_time ASC
       LIMIT 1`,
      [patientId, targetDate, currentTime]
    );

    const reminder = result.rows.length > 0 ? result.rows[0] : null;

    return res.status(200).json({
      success: true,
      reminder
    });
  } catch (err) {
    console.error('[GET NEXT REMINDER ERROR]', err);
    next(err);
  }
}

/**
 * GET /api/reminders/due
 * 
 * Returns all due incomplete reminders for the authenticated patient for today:
 *   - reminder_date = current date (or req.query.date)
 *   - reminder_time <= current time (or req.query.time)
 *   - is_completed = false
 * Protected: Requires Authorization: Bearer <token>
 */
async function getDueReminders(req, res, next) {
  try {
    const userId = req.user.sub;
    const userRole = req.user.role;

    // Determine target date (default: local date YYYY-MM-DD)
    const targetDate = req.query.date || new Date().toLocaleDateString('en-CA');

    // Determine target time (default: current local time HH:MM)
    const now = new Date();
    const currentTime =
      req.query.time ||
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let patientId = userId;
    if (userRole === 'caregiver' && req.query.patientId) {
      patientId = req.query.patientId;
    }

    const result = await query(
      `SELECT
         id,
         patient_id,
         type,
         title,
         description,
         TO_CHAR(reminder_date, 'YYYY-MM-DD') AS reminder_date,
         TO_CHAR(reminder_time, 'HH24:MI') AS reminder_time,
         is_completed,
         completed_at,
         created_at
       FROM reminders
       WHERE patient_id = $1
         AND reminder_date = $2::DATE
         AND is_completed = FALSE
         AND reminder_time <= $3::TIME
       ORDER BY reminder_time ASC`,
      [patientId, targetDate, currentTime]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      currentTime,
      date: targetDate,
      reminders: result.rows
    });
  } catch (err) {
    console.error('[GET DUE REMINDERS ERROR]', err);
    next(err);
  }
}

module.exports = {
  createReminder,
  getTodayReminders,
  getNextReminder,
  getDueReminders
};
