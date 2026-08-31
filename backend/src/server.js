'use strict';

// ── Load environment variables first ─────────────────────────────────────────
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes/index');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { testConnection } = require('./config/database');

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow both localhost and 127.0.0.1 during development.
// This prevents browser requests from failing when Vite uses either address.
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (curl, Postman, mobile apps, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Allow known frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);

      return callback(
        new Error(`CORS: Origin '${origin}' is not allowed`)
      );
    },

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],

    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ── Request logger ────────────────────────────────────────────────────────────
if (NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );

    next();
  });
}

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ── Root route ────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'MindCare Backend API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const startServer = async () => {
  // Test PostgreSQL connection before starting the server.
  // The server will still start if the database is temporarily unavailable.
  try {
    await testConnection();

    console.log('[DB] Connected to PostgreSQL');
  } catch (err) {
    console.warn(
      `[DB] Could not connect to PostgreSQL: ${err.message}\n` +
      `     Update DB_* variables in backend/.env and restart.`
    );
  }

  app.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log(`  ║  MindCare API  ·  ${NODE_ENV.padEnd(11)}           ║`);
    console.log(`  ║  Listening on  http://localhost:${PORT}    ║`);
    console.log('  ║  Health check: /api/health               ║');
    console.log('  ╚══════════════════════════════════════════╝');
    console.log('');
  });
};

// ── Start application ─────────────────────────────────────────────────────────
startServer();