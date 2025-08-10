const express = require('express');
const app = express();

const tvMazeService = require('./services/tvMazeService');
const castRoutes = require('./routes/castRoutes');

tvMazeService.startAutoRefresh();

app.use(express.json());
app.use('/api', castRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

module.exports = app;
