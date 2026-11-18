import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/config.js';
import { initSocket } from './services/socketService.js';
import apiRouter from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with permissive CORS for frontend dev
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});
initSocket(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (Government IDs, Certificates, etc.)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    platform: 'GoBeyond Travels API Server',
    version: '1.0.0',
    modules: [
      'Auth & RBAC',
      'Database (Prisma)',
      'Guide Verification',
      'Booking Management',
      'Real-Time Crowd Density (Socket.io)',
      'Recommendation Engine',
      'Maps & Route Optimization',
      'Review & Trust Formula',
      'Payments Engine',
      'Notification Service',
      'Admin Dashboard',
      'AI Travel Assistant'
    ]
  });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`   GOBEYOND TRAVELS — BACKEND API & SOCKET.IO SERVER`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`=======================================================`);
});

export default app;
