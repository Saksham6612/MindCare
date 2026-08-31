-- =============================================================================
-- MindCare Database Schema
-- Migration: 001_create_schema.sql
-- Description: Initial schema for MindCare — AI-powered cognitive assistance
--              platform for elderly dementia patients.
--
-- Run with:
--   psql -U <user> -d mindcare -f 001_create_schema.sql
-- =============================================================================

-- Enable UUID generation (requires PostgreSQL 13+ built-in, or pgcrypto)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================================
-- ENUMS
-- Using enums keeps column values validated at the DB level without lookup tables.
-- =============================================================================

CREATE TYPE user_role AS ENUM ('patient', 'caregiver', 'healthcare_worker', 'admin');

CREATE TYPE reminder_type AS ENUM ('medicine', 'hydration', 'activity', 'appointment');

CREATE TYPE game_type AS ENUM ('memory', 'attention', 'pattern');

CREATE TYPE difficulty_level AS ENUM ('Easy', 'Medium', 'Hard');

CREATE TYPE activity_type AS ENUM (
  'game_session',
  'medication_taken',
  'hydration_logged',
  'mood_checkin',
  'reminder_completed',
  'caregiver_checkin'
);


-- =============================================================================
-- 1. users
-- Core authentication and identity table. Shared by patients, caregivers, admin.
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(150)  NOT NULL,
  email           VARCHAR(255)  NOT NULL UNIQUE,
  password_hash   TEXT          NOT NULL,
  role            user_role     NOT NULL DEFAULT 'patient',
  language        VARCHAR(10)   NOT NULL DEFAULT 'en',  -- BCP-47 language tag (e.g. 'en', 'as')
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index for login lookup
CREATE INDEX IF NOT EXISTS idx_users_email    ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role     ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_active   ON users (is_active);

COMMENT ON TABLE  users                IS 'Unified identity table for patients, caregivers and admins.';
COMMENT ON COLUMN users.language       IS 'BCP-47 language code. Supports English (en) and Assamese (as).';
COMMENT ON COLUMN users.password_hash  IS 'bcrypt hash — never store plain-text passwords.';


-- =============================================================================
-- 2. patient_profiles
-- Extended medical/personal data for users with role = patient.
-- =============================================================================

CREATE TABLE IF NOT EXISTS patient_profiles (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID         NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,

  date_of_birth        DATE,
  -- Store emergency contact as a simple JSON object for flexibility:
  -- { "name": "Priya", "relation": "Daughter", "phone": "+91 98640 12345" }
  emergency_contact    JSONB,

  preferred_language   VARCHAR(10)  NOT NULL DEFAULT 'en',
  avatar_url           TEXT,

  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patient_profiles_user_id ON patient_profiles (user_id);

COMMENT ON TABLE  patient_profiles                  IS 'Extended profile data for users with role = patient.';
COMMENT ON COLUMN patient_profiles.emergency_contact IS 'JSON: { name, relation, phone }';


-- =============================================================================
-- 3. caregiver_patient
-- Many-to-many link between caregivers and patients.
-- A caregiver can monitor multiple patients; a patient can have multiple caregivers.
-- =============================================================================

CREATE TABLE IF NOT EXISTS caregiver_patient (
  caregiver_id  UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  patient_id    UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  PRIMARY KEY (caregiver_id, patient_id),
  -- Prevent a user from being their own caregiver
  CONSTRAINT chk_no_self_care CHECK (caregiver_id <> patient_id)
);

CREATE INDEX IF NOT EXISTS idx_caregiver_patient_caregiver ON caregiver_patient (caregiver_id);
CREATE INDEX IF NOT EXISTS idx_caregiver_patient_patient   ON caregiver_patient (patient_id);

COMMENT ON TABLE caregiver_patient IS 'Junction table linking caregivers to patients (many-to-many).';


-- =============================================================================
-- 4. game_sessions
-- Records every completed brain exercise session.
-- =============================================================================

CREATE TABLE IF NOT EXISTS game_sessions (
  id             UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id     UUID             NOT NULL REFERENCES users (id) ON DELETE CASCADE,

  game_type      game_type        NOT NULL,
  difficulty     difficulty_level NOT NULL DEFAULT 'Easy',

  -- Raw session metrics
  score          SMALLINT         NOT NULL DEFAULT 0 CHECK (score >= 0),
  total_items    SMALLINT         NOT NULL DEFAULT 0 CHECK (total_items > 0),
  accuracy       NUMERIC(5, 2)    NOT NULL CHECK (accuracy BETWEEN 0 AND 100),  -- percentage
  response_time  NUMERIC(8, 2)    NOT NULL CHECK (response_time >= 0),           -- seconds

  completed_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_patient     ON game_sessions (patient_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_type   ON game_sessions (game_type);
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed   ON game_sessions (completed_at DESC);
-- Composite index for caregiver weekly-aggregation queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_patient_date ON game_sessions (patient_id, completed_at DESC);

COMMENT ON TABLE  game_sessions               IS 'Individual brain-exercise sessions completed by a patient.';
COMMENT ON COLUMN game_sessions.accuracy      IS 'Percentage of correct answers (0.00 – 100.00).';
COMMENT ON COLUMN game_sessions.response_time IS 'Total seconds the patient took to complete the session.';


-- =============================================================================
-- 5. cognitive_scores
-- Periodic (daily/weekly) aggregate cognitive scores calculated from game_sessions.
-- Provides the time-series data for the caregiver performance chart.
-- =============================================================================

CREATE TABLE IF NOT EXISTS cognitive_scores (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,

  memory_score     NUMERIC(5, 2) CHECK (memory_score  BETWEEN 0 AND 100),
  attention_score  NUMERIC(5, 2) CHECK (attention_score BETWEEN 0 AND 100),
  pattern_score    NUMERIC(5, 2) CHECK (pattern_score BETWEEN 0 AND 100),
  overall_score    NUMERIC(5, 2) CHECK (overall_score BETWEEN 0 AND 100),

  recorded_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cognitive_scores_patient     ON cognitive_scores (patient_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_scores_patient_date ON cognitive_scores (patient_id, recorded_at DESC);

COMMENT ON TABLE  cognitive_scores              IS 'Aggregated daily/weekly cognitive scores derived from game_sessions.';
COMMENT ON COLUMN cognitive_scores.overall_score IS 'Weighted average of memory, attention, and pattern scores.';


-- =============================================================================
-- 6. reminders
-- Scheduled reminders (medicine, hydration, activity, appointment) for patients.
-- =============================================================================

CREATE TABLE IF NOT EXISTS reminders (
  id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID           NOT NULL REFERENCES users (id) ON DELETE CASCADE,

  type            reminder_type  NOT NULL,
  title           VARCHAR(255)   NOT NULL,
  description     TEXT,

  reminder_date   DATE           NOT NULL,
  reminder_time   TIME           NOT NULL,

  is_completed    BOOLEAN        NOT NULL DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,

  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  -- A reminder cannot be marked completed without a completed_at timestamp
  CONSTRAINT chk_completed_consistency
    CHECK (
      (is_completed = FALSE AND completed_at IS NULL) OR
      (is_completed = TRUE  AND completed_at IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_reminders_patient          ON reminders (patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_patient_date     ON reminders (patient_id, reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminders_type             ON reminders (type);
CREATE INDEX IF NOT EXISTS idx_reminders_incomplete       ON reminders (patient_id, is_completed) WHERE is_completed = FALSE;

COMMENT ON TABLE  reminders                IS 'Scheduled reminders for medicines, hydration, activities and appointments.';
COMMENT ON COLUMN reminders.reminder_time  IS 'Time of day for the reminder (wall-clock, timezone stored by the app layer).';
COMMENT ON COLUMN reminders.completed_at   IS 'Timestamp when the patient marked the reminder as done.';


-- =============================================================================
-- 7. activities
-- Immutable event log — one row per user action (game played, pill taken, etc.)
-- Used to populate the "Recent Activity" panel on the caregiver dashboard.
-- =============================================================================

CREATE TABLE IF NOT EXISTS activities (
  id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID           NOT NULL REFERENCES users (id) ON DELETE CASCADE,

  activity_type   activity_type  NOT NULL,
  title           VARCHAR(255)   NOT NULL,
  description     TEXT,

  -- Optional link back to the originating record (e.g. a game_session id or reminder id)
  reference_id    UUID,

  completed       BOOLEAN        NOT NULL DEFAULT TRUE,
  completed_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_patient      ON activities (patient_id);
CREATE INDEX IF NOT EXISTS idx_activities_patient_date ON activities (patient_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type         ON activities (activity_type);

COMMENT ON TABLE  activities               IS 'Append-only activity log. Never update or delete rows — only insert.';
COMMENT ON COLUMN activities.reference_id  IS 'Optional FK to the source record (game_sessions.id, reminders.id, etc.).';


-- =============================================================================
-- AUTO-UPDATE updated_at TRIGGER
-- Automatically sets updated_at = NOW() on any UPDATE for tables that have it.
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach to users
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Attach to patient_profiles
CREATE TRIGGER trg_patient_profiles_updated_at
  BEFORE UPDATE ON patient_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Attach to reminders
CREATE TRIGGER trg_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- =============================================================================
-- SCHEMA VALIDATION QUERY
-- Run after applying the migration to confirm all objects were created.
-- =============================================================================

-- Expected output: 7 tables + all enum types + all indexes
DO $$
DECLARE
  tbl_count INT;
BEGIN
  SELECT COUNT(*) INTO tbl_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN (
      'users', 'patient_profiles', 'caregiver_patient',
      'game_sessions', 'cognitive_scores', 'reminders', 'activities'
    );

  IF tbl_count = 7 THEN
    RAISE NOTICE '✅  Migration 001 applied successfully — % tables created.', tbl_count;
  ELSE
    RAISE WARNING '⚠️  Expected 7 tables, found %. Check for errors above.', tbl_count;
  END IF;
END $$;
