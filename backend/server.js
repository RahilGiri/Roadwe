require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { ensureAdminSeeded } = require('./controllers/authController');
const { ensureTemplatesSeeded } = require('./controllers/templateController');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Mount Central API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Initialize database and start Listening
const startServer = async () => {
  console.log('⚡ Starting Transport Management SaaS Backend...');
  await connectDB();
  
  // Ensure default demo admin account is active
  await ensureAdminSeeded();

  // Ensure 5 high-fidelity Bilty templates are seeded
  await ensureTemplatesSeeded();

  app.listen(PORT, () => {
    console.log(`🚀 Express API server running on: http://localhost:${PORT}`);
    console.log(`📡 Health check endpoints active at: http://localhost:${PORT}/health`);
  });
};

startServer();
