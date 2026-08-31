const { Pool } = require('pg');

// Build connection config — prefer a full DATABASE_URL when available,
// otherwise fall back to individual fields.
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'mindcare',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      // Keep a small pool for development; scale up in production
      max: process.env.NODE_ENV === 'production' ? 20 : 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    };

const pool = new Pool(poolConfig);

// Emit pool-level errors so they don't crash the process silently
pool.on('error', (err) => {
  console.error('[DB] Unexpected idle client error:', err.message);
});

/**
 * Run a single parameterised query against the pool.
 * @param {string} text - SQL query string with $1, $2 … placeholders
 * @param {Array}  params - Parameter values
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Probe the database by running a trivial query.
 * Used during server startup to confirm connectivity.
 * @returns {Promise<void>}
 */
const testConnection = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW() AS now');
    console.log(`[DB] Connected to PostgreSQL — server time: ${result.rows[0].now}`);
  } finally {
    client.release();
  }
};

module.exports = { pool, query, testConnection };
