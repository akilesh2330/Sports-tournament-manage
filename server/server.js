const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./utils/seed');

dotenv.config();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Connect Database
connectDB().then(() => {
  seedData();
});

// Route Handlers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/matches', require('./routes/matches'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'API Server is healthy and running', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
