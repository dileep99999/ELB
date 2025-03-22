const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());

// Configure CORS properly to handle preflight requests
// Must be before any route handlers
app.use(cors({
  origin: ['https://dileep99999.github.io', 'http://localhost:5173'], // Explicitly allow GitHub Pages domain and local dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // Cache preflight response for 24 hours
}));

// Add explicit OPTIONS handling for preflight requests
app.options('*', cors());

// Define MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/elbs';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));

// Add a simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ELBS API is running' });
});

// Root path for API
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ELBS API Server',
    endpoints: [
      '/api/auth/login',
      '/api/bookings',
      '/api/bookings/stats',
      '/health'
    ]
  });
});

// Only serve static assets in a local development environment
// We're hosting the frontend on GitHub Pages
if (process.env.NODE_ENV === 'production' && !process.env.RENDER) {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));