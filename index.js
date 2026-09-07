const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('../backend/Database/db'); 
const productRoutes = require('./routes/ProductRoutes');
const userRoutes = require('./routes/UserRoutes');
const AdminRoutes = require('./routes/AdminRoutes');
const ContactRoutes = require('./routes/ContactRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const app = express();
connectDB();
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use("/api",AdminRoutes);
app.use("/api",ContactRoutes);
// Register API Routes
app.use('/api', orderRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});
const PORT = process.env.PORT || 5000;

// -------------------------------------------------------------
// 1. 404 Handler (Triggers for any route that isn't defined above)
// -------------------------------------------------------------
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error to the global handler below
});

// -------------------------------------------------------------
// 2. Global Error Handling Middleware (Must have 4 arguments: err, req, res, next)
// -------------------------------------------------------------
app.use((err, req, res, next) => {
  // If status code is 200, default to 500 Server Error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Show stack trace only in development mode for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


