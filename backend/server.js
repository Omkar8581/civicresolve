import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import complaintsRouter from './routes/complaints.js';
import authRouter from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CivicResolve Express API',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/complaints', complaintsRouter);
app.use('/api/auth', authRouter);

// Serve Frontend Static Build (Single Page Application support)
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback for React Router (e.g., /login, /citizen/dashboard, /admin/dashboard)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // 404 Handler when frontend build is not found
  app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏛️ CivicResolve API server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Ready to receive citizen complaints & admin dispatches`);
  if (fs.existsSync(distPath)) {
    console.log(`🌐 Serving frontend SPA directly from: ${distPath}`);
  }
});
