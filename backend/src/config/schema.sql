-- ============================================================
-- MindCare Database Schema
-- ============================================================

-- UUID support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    email VARCHAR(255) UNIQUE,

    phone VARCHAR(20) UNIQUE,

    password_hash TEXT,

    role VARCHAR(30) NOT NULL DEFAULT 'patient',

    language VARCHAR(50) DEFAULT 'English',

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (
            role IN (
                'patient',
                'caregiver',
                'healthcare_worker',
                'admin'
            )
        )
);


-- ============================================================
-- 2. PATIENT PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    date_of_birth DATE,

    gender VARCHAR(30),

    address TEXT,

    region VARCHAR(100),

    diagnosis TEXT,

    emergency_contact_name VARCHAR(150),

    emergency_contact_phone VARCHAR(20),

    cognitive_condition VARCHAR(100),

    cognitive_level VARCHAR(50) DEFAULT 'mild',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT patient_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. CAREGIVER ↔ PATIENT RELATIONSHIP
-- ============================================================

CREATE TABLE IF NOT EXISTS caregiver_patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    caregiver_id UUID NOT NULL,

    patient_id UUID NOT NULL,

    relationship VARCHAR(100),

    is_primary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT caregiver_fk
        FOREIGN KEY (caregiver_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT caregiver_patient_patient_fk
        FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_caregiver_patient
        UNIQUE (caregiver_id, patient_id)
);


-- ============================================================
-- 4. COGNITIVE GAMES
-- ============================================================

CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    description TEXT,

    category VARCHAR(50) NOT NULL,

    difficulty VARCHAR(30) DEFAULT 'easy',

    language VARCHAR(50) DEFAULT 'English',

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT game_category_check
        CHECK (
            category IN (
                'memory',
                'attention',
                'pattern',
                'recognition',
                'routine',
                'concentration'
            )
        )
);


-- ============================================================
-- 5. GAME SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID NOT NULL,

    game_id UUID NOT NULL,

    score INTEGER DEFAULT 0,

    accuracy DECIMAL(5,2) DEFAULT 0,

    difficulty VARCHAR(30),

    duration_seconds INTEGER DEFAULT 0,

    completed BOOLEAN DEFAULT FALSE,

    mistakes INTEGER DEFAULT 0,

    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT game_session_patient_fk
        FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT game_session_game_fk
        FOREIGN KEY (game_id)
        REFERENCES games(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 6. COGNITIVE PROGRESS
-- ============================================================

CREATE TABLE IF NOT EXISTS cognitive_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID NOT NULL,

    memory_score DECIMAL(5,2) DEFAULT 0,

    attention_score DECIMAL(5,2) DEFAULT 0,

    recognition_score DECIMAL(5,2) DEFAULT 0,

    concentration_score DECIMAL(5,2) DEFAULT 0,

    overall_score DECIMAL(5,2) DEFAULT 0,

    assessment_date DATE DEFAULT CURRENT_DATE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT progress_patient_fk
        FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 7. REMINDERS
-- ============================================================

CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    reminder_type VARCHAR(50) NOT NULL,

    reminder_time TIME,

    reminder_date DATE,

    is_recurring BOOLEAN DEFAULT FALSE,

    recurrence_pattern VARCHAR(100),

    is_completed BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT reminder_patient_fk
        FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT reminder_type_check
        CHECK (
            reminder_type IN (
                'medicine',
                'hydration',
                'activity',
                'appointment',
                'general'
            )
        )
);


-- ============================================================
-- 8. MEDICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID NOT NULL,

    medicine_name VARCHAR(200) NOT NULL,

    dosage VARCHAR(100),

    instructions TEXT,

    start_date DATE,

    end_date DATE,

    reminder_time TIME,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT medication_patient_fk
        FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 9. MEDICAL APPOINTMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID NOT NULL,

    doctor_name VARCHAR(150),

    hospital_name VARCHAR(200),

    appointment_date DATE NOT NULL,

    appointment_time TIME,

    purpose TEXT,

    notes TEXT,

    status VARCHAR(30) DEFAULT 'scheduled',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT appointment_patient_fk
        FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT appointment_status_check
        CHECK (
            status IN (
                'scheduled',
                'completed',
                'cancelled'
            )
        )
);


-- ============================================================
-- 10. DAILY ROUTINE
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID NOT NULL,

    activity_name VARCHAR(200) NOT NULL,

    description TEXT,

    scheduled_time TIME,

    is_completed BOOLEAN DEFAULT FALSE,

    routine_date DATE DEFAULT CURRENT_DATE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT routine_patient_fk
        FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 11. PATIENT ACTIVITY LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patient_id UUID NOT NULL,

    activity_type VARCHAR(100) NOT NULL,

    activity_id UUID,

    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT activity_patient_fk
        FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_game_sessions_patient
ON game_sessions(patient_id);

CREATE INDEX IF NOT EXISTS idx_game_sessions_game
ON game_sessions(game_id);

CREATE INDEX IF NOT EXISTS idx_progress_patient
ON cognitive_progress(patient_id);

CREATE INDEX IF NOT EXISTS idx_reminders_patient
ON reminders(patient_id);

CREATE INDEX IF NOT EXISTS idx_medications_patient
ON medications(patient_id);

CREATE INDEX IF NOT EXISTS idx_appointments_patient
ON appointments(patient_id);

CREATE INDEX IF NOT EXISTS idx_routines_patient
ON daily_routines(patient_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_patient
ON activity_logs(patient_id);


-- ============================================================
-- DONE
-- ============================================================

SELECT 'MindCare database schema created successfully!' AS message;