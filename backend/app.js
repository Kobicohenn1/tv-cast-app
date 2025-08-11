const express = require('express');
const cors = require('cors');
const app = express();

const tvMazeService = require('./services/tvMazeService');
const castRoutes = require('./routes/castRoutes');

app.use(cors()); //Enable CORS for local dev

// Start background auto-refresh of the cache (uses TTL from config).
// Runs async does not block server startup.
tvMazeService.startAutoRefresh();

//Parse JSON bodies
app.use(express.json());
app.use('/api', castRoutes);

// Global error handler catches next(err) and returns appropriate status code.
app.use((err, req, res, next) => {
  // Handle custom error objects with status and message
  if (err.status && err.message) {
    console.error(`Error ${err.status}: ${err.message}`);
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Handle standard Error objects
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  console.error(err.stack);
  res.status(statusCode).json({
    message: message,
  });
});

module.exports = app;
