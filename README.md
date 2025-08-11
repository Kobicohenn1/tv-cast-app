# TV Cast App

A React + Node.js application for managing TV show cast data with caching and real-time updates.

## Features
- WebAPI service with TV Maze API integration
- 5-minute cache with auto-refresh
- React client with player list and details
- Comment system with file storage
- Real-time updates via Socket.io
- Player deletion from cache

## Setup
1. Backend: `cd backend && npm install && npm start`
2. Frontend: `cd frontend && npm install && npm run dev`

## Technologies
- Frontend: React, Socket.io-client, Axios
- Backend: Node.js, Express, Socket.io, Axios