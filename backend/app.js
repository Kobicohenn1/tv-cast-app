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

// Global error handle catches next(err) and returns 500.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;
