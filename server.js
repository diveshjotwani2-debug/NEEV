const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const careerRoutes = require('./routes/careers');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Fallback to SPA landing page if they request undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Neev Server Running!`);
  console.log(` Port:    ${PORT}`);
  console.log(` URL:     http://localhost:${PORT}`);
  console.log(` Env:     production`);
  console.log(`=========================================`);
});
