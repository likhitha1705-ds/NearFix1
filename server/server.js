const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const providerRoutes = require('./routes/providerRoutes');
const requestRoutes = require('./routes/requestRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'NearFix – Local Service Finder for Mumbai',
    city: 'Mumbai, Maharashtra, India',
    database_connected: db.getIsConnected(),
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static build if built
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      project: 'NearFix – Local Service Finder for Mumbai',
      message: 'NearFix API Server is running.',
      api_health: '/api/health',
      categories: '/api/categories',
      providers: '/api/providers',
    });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[NearFix Server Error]:', err.stack || err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(` NearFix Backend API Server is running on port ${PORT}`);
  console.log(` Web Application: http://localhost:${PORT}`);
  console.log(` API Health Check: http://localhost:${PORT}/api/health`);
  console.log(` Dedicated for: Mumbai, Maharashtra, India`);
  console.log('====================================================');
});

module.exports = app;
