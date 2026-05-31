require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const filesRoute = require('./routes/files');
const mailRoute = require('./routes/mail');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/files', filesRoute);
app.use('/api/mail', mailRoute);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Google Drive Clone API is running' });
});

// Connect to PostgreSQL and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('✅ Database connected and synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });
