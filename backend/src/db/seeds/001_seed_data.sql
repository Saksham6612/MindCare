-- =============================================================================
-- MindCare Seed Data
-- File: 001_seed_data.sql
-- Description: Development seed — realistic sample data for North-Eastern India.
--
-- Run AFTER 001_create_schema.sql:
--   psql -U <user> -d mindcare -f 001_seed_data.sql
--
-- NOTE: Passwords below are bcrypt hashes of "password123" (cost factor 10).
--       Change before any production deployment.
-- =============================================================================

-- Wrap in a transaction so seed either fully succeeds or fully rolls back
BEGIN;

-- ── 1. Users ──────────────────────────────────────────────────────────────────

INSERT INTO users (id, name, email, password_hash, role, language) VALUES
  -- Patient
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Biren Hazarika',
    'biren.hazarika@example.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',  -- "password123"
    'patient',
    'en'
  ),
  -- Caregiver (daughter)
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Priya Hazarika',
    'priya.hazarika@example.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',
    'caregiver',
    'en'
  ),
  -- Admin
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'MindCare Admin',
    'admin@mindcare.in',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3y',
    'admin',
    'en'
  )
ON CONFLICT (email) DO NOTHING;


-- ── 2. Patient Profile ────────────────────────────────────────────────────────

INSERT INTO patient_profiles (user_id, date_of_birth, emergency_contact, preferred_language) VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1950-03-15',
    '{"name": "Priya Hazarika", "relation": "Daughter", "phone": "+91 98640 12345"}'::JSONB,
    'en'
  )
ON CONFLICT (user_id) DO NOTHING;


-- ── 3. Caregiver–Patient Link ─────────────────────────────────────────────────

INSERT INTO caregiver_patient (caregiver_id, patient_id) VALUES
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',  -- Priya (caregiver)
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'   -- Dr. Biren (patient)
  )
ON CONFLICT DO NOTHING;


-- ── 4. Game Sessions (last 7 days) ────────────────────────────────────────────

INSERT INTO game_sessions
  (patient_id, game_type, difficulty, score, total_items, accuracy, response_time, completed_at)
VALUES
  -- Memory games
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'memory',    'Easy',   5, 6,  83.33, 22.4, NOW() - INTERVAL '6 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'memory',    'Easy',   4, 6,  66.67, 28.1, NOW() - INTERVAL '5 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'memory',    'Easy',   6, 6, 100.00, 18.7, NOW() - INTERVAL '4 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'memory',    'Medium', 6, 7,  85.71, 20.3, NOW() - INTERVAL '3 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'memory',    'Medium', 7, 7, 100.00, 17.2, NOW() - INTERVAL '2 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'memory',    'Medium', 6, 7,  85.71, 19.9, NOW() - INTERVAL '1 day'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'memory',    'Medium', 5, 7,  71.43, 24.6, NOW()),

  -- Attention games
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'attention', 'Easy',   4, 6,  66.67, 31.0, NOW() - INTERVAL '5 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'attention', 'Easy',   5, 6,  83.33, 27.4, NOW() - INTERVAL '4 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'attention', 'Easy',   5, 6,  83.33, 25.9, NOW() - INTERVAL '2 days'),

  -- Pattern games
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'pattern',   'Easy',   3, 6,  50.00, 38.2, NOW() - INTERVAL '6 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'pattern',   'Easy',   4, 6,  66.67, 34.1, NOW() - INTERVAL '4 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'pattern',   'Easy',   5, 6,  83.33, 29.5, NOW() - INTERVAL '2 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'pattern',   'Easy',   5, 6,  83.33, 27.0, NOW() - INTERVAL '1 day');


-- ── 5. Cognitive Scores (one row per day for the last 7 days) ─────────────────

INSERT INTO cognitive_scores
  (patient_id, memory_score, attention_score, pattern_score, overall_score, recorded_at)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 83.00, 70.00, 65.00, 72.67, NOW() - INTERVAL '6 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 78.00, 75.00, 72.00, 75.00, NOW() - INTERVAL '5 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 85.00, 68.00, 70.00, 74.33, NOW() - INTERVAL '4 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 90.00, 80.00, 75.00, 81.67, NOW() - INTERVAL '3 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 88.00, 85.00, 80.00, 84.33, NOW() - INTERVAL '2 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 92.00, 82.00, 78.00, 84.00, NOW() - INTERVAL '1 day'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 86.00, 88.00, 83.00, 85.67, NOW());


-- ── 6. Reminders (today) ─────────────────────────────────────────────────────

INSERT INTO reminders
  (patient_id, type, title, description, reminder_date, reminder_time, is_completed, completed_at)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'medicine', 'Morning Blood Pressure Tablet',
    'Take Amlodipine 5mg with a full glass of warm water after light breakfast.',
    CURRENT_DATE, '08:30', TRUE, NOW() - INTERVAL '5 hours'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'hydration', 'Drink Water & Warm Tea',
    'Enjoy a cup of warm Assam tea and drink at least 2 glasses of water.',
    CURRENT_DATE, '10:30', FALSE, NULL
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'medicine', 'Calcium Tablet with Lunch',
    'Take 1 Calcium tablet after warm rice, dal, and boiled vegetables.',
    CURRENT_DATE, '13:00', FALSE, NULL
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'activity', 'Gentle Verandah Walk',
    '15 minutes of slow walking in the garden or verandah for joint health.',
    CURRENT_DATE, '17:00', FALSE, NULL
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'appointment', 'Neurology Check-up',
    'Visit Dr. Samarjit Baruah at Guwahati Neurological Clinic. Bring previous reports.',
    CURRENT_DATE, '11:00', FALSE, NULL
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'medicine', 'Night Memory Medicine',
    'Take Donepezil 5mg tablet with warm water before going to bed.',
    CURRENT_DATE, '20:30', FALSE, NULL
  );


-- ── 7. Activities (last 48 hours) ────────────────────────────────────────────

INSERT INTO activities
  (patient_id, activity_type, title, description, completed, completed_at)
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'game_session', 'Completed Memory Game',
    'Score: 5/7 (71%) · Level: Medium', TRUE, NOW() - INTERVAL '2 hours'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'medication_taken', 'Took Morning Tablet',
    'Amlodipine 5mg — marked as taken', TRUE, NOW() - INTERVAL '5 hours'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'hydration_logged', 'Hydration Logged',
    'Drank 3 glasses of water by 11 AM', TRUE, NOW() - INTERVAL '4 hours'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'mood_checkin', 'Mood Check-in',
    'Reported feeling Good this morning', TRUE, NOW() - INTERVAL '6 hours'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'game_session', 'Attention Game Skipped',
    'Session not completed', FALSE, NOW() - INTERVAL '1 day 3 hours'
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'medication_taken', 'Evening Tablet Missed',
    'Donepezil 5mg — not marked by 10 PM', FALSE, NOW() - INTERVAL '1 day'
  );

COMMIT;

-- Seed validation
DO $$
DECLARE
  user_count      INT;
  reminder_count  INT;
  activity_count  INT;
  game_count      INT;
BEGIN
  SELECT COUNT(*) INTO user_count     FROM users;
  SELECT COUNT(*) INTO reminder_count FROM reminders;
  SELECT COUNT(*) INTO activity_count FROM activities;
  SELECT COUNT(*) INTO game_count     FROM game_sessions;

  RAISE NOTICE '✅  Seed complete — users: %, reminders: %, activities: %, game_sessions: %',
    user_count, reminder_count, activity_count, game_count;
END $$;
