/**
 * Centralised error handler middleware.
 * Must be registered LAST (after all routes) in Express.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Log full stack in development; suppress in production
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error]', err.stack || err.message);
  } else {
    console.error('[Error]', err.message);
  }

  // Respect an HTTP status set on the error object, otherwise use 500
  const statusCode = err.statusCode || err.status || 500;

  const payload = {
    success: false,
    message: err.message || 'An unexpected server error occurred.'
  };

  // Attach validation details when present (e.g. from express-validator)
  if (err.errors) {
    payload.errors = err.errors;
  }

  // Never leak internal stack traces to clients in production
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

/**
 * 404 handler — called when no route matched.
 * Call this AFTER all routes but BEFORE errorHandler.
 */
const notFoundHandler = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFoundHandler };
