// server.js - Main server file for the MERN blog application

// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const createDbConnection = require("./config/db");
const userRoutes = require("./routes/userRoute");
const postRoutes=require("./routes/postRoute");
const categoryRoutes=require("./routes/categoryRoutes")
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
createDbConnection();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware (development)
// server.js - Use Express's default 404 handling

// ... your other imports and middleware ...

// Routes
app.use("/users", userRoutes);
app.use("/posts",postRoutes);
app.use("/categories",categoryRoutes)
// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'MERN Blog API is running',
        version: '1.0.0'
    });
});

// Express will automatically handle 404 for undefined routes
// No need for custom 404 handler

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    // For 404 errors
    if (err.status === 404 || err.message?.includes('not found')) {
        return res.status(404).json({
            success: false,
            message: `Route ${req.method} ${req.originalUrl} not found`
        });
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate field value entered',
            field: Object.keys(err.keyPattern)[0]
        });
    }
    
    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;