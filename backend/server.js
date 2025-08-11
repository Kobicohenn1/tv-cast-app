const app = require('./app');
const { PORT } = require('./config/default');
const http = require('http');

const server = http.createServer(app);

//Attach Socket.IO to the HTTP server
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

//Log when a client connects/disconnects to help with debugging
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

//Our in-memory cache module can emit Socket.IO events, we pass the io instance to the cache so it can emit
const cache = require('./cache/cache');
cache.setIO(io);

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
