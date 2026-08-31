'use strict';
const { query } = require('../config/database');

/**
 * GET /api/progress
 * Retrieves cognitive progress and weekly activities completed for the authenticated patient.
 */
async function getPatientProgress(req, res, next) {
  try {
    const patientId = req.user && req.user.sub;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Patient ID not found in token.'
      });
    }

    // 1. Fetch latest cognitive scores recorded in PostgreSQL
    const cogSql = `
      SELECT
        memory_score,
        attention_score,
        pattern_score,
        overall_score,
        recorded_at
      FROM cognitive_scores
      WHERE patient_id = $1
      ORDER BY recorded_at DESC
      LIMIT 1;
    `;
    const cogResult = await query(cogSql, [patientId]);
    const latestCog = cogResult.rows[0] || null;

    // 2. Fetch game sessions summary and weekly counts from PostgreSQL
    const sessionSql = `
      SELECT
        COUNT(*)::int AS total_sessions,
        COUNT(CASE WHEN completed_at >= NOW() - INTERVAL '7 days' THEN 1 END)::int AS weekly_sessions,
        ROUND(AVG(CASE WHEN game_type = 'memory' THEN accuracy END)::numeric, 0)::int AS avg_memory,
        ROUND(AVG(CASE WHEN game_type = 'attention' THEN accuracy END)::numeric, 0)::int AS avg_attention,
        ROUND(AVG(CASE WHEN game_type = 'pattern' THEN accuracy END)::numeric, 0)::int AS avg_pattern,
        ROUND(AVG(accuracy)::numeric, 0)::int AS avg_overall
      FROM game_sessions
      WHERE patient_id = $1;
    `;
    const sessionResult = await query(sessionSql, [patientId]);
    const stats = sessionResult.rows[0] || {
      total_sessions: 0,
      weekly_sessions: 0,
      avg_memory: null,
      avg_attention: null,
      avg_pattern: null,
      avg_overall: null
    };

    const hasData = (stats.total_sessions > 0) || Boolean(latestCog);

    if (!hasData) {
      return res.status(200).json({
        success: true,
        progress: {
          hasData: false,
          memoryScore: null,
          attentionScore: null,
          patternScore: null,
          overallScore: null,
          gamesCompleted: 0,
          sessionsCompleted: 0,
          weeklyActivities: 0
        }
      });
    }

    const memoryScore = latestCog?.memory_score != null
      ? Math.round(parseFloat(latestCog.memory_score))
      : (stats.avg_memory != null ? stats.avg_memory : null);

    const attentionScore = latestCog?.attention_score != null
      ? Math.round(parseFloat(latestCog.attention_score))
      : (stats.avg_attention != null ? stats.avg_attention : null);

    const patternScore = latestCog?.pattern_score != null
      ? Math.round(parseFloat(latestCog.pattern_score))
      : (stats.avg_pattern != null ? stats.avg_pattern : null);

    const overallScore = latestCog?.overall_score != null
      ? Math.round(parseFloat(latestCog.overall_score))
      : (stats.avg_overall != null ? stats.avg_overall : (memoryScore || 0));

    const gamesCompleted = stats.total_sessions || 0;
    const weeklyActivities = stats.weekly_sessions || gamesCompleted;

    return res.status(200).json({
      success: true,
      progress: {
        hasData: true,
        memoryScore,
        attentionScore,
        patternScore,
        overallScore,
        gamesCompleted,
        sessionsCompleted: gamesCompleted,
        weeklyActivities,
        recordedAt: latestCog?.recorded_at || null
      }
    });
  } catch (error) {
    console.error('[GET /api/progress ERROR]', error);
    next(error);
  }
}

module.exports = {
  getPatientProgress
};
