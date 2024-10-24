const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:8080';

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'access.log'),
    { flags: 'a' }
);

// Ensure logs directory exists
if (!fs.existsSync(path.join(__dirname, 'logs'))) {
    fs.mkdirSync(path.join(__dirname, 'logs'));
}

// Setup request logging
// Log to console in development format
app.use(morgan('dev'));
// Log to file in combined format
app.use(morgan('combined', { stream: accessLogStream }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Custom logging middleware for API requests
app.use((req, res, next) => {
    const startTime = new Date();
    res.on('finish', () => {
        const duration = new Date() - startTime;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// Proxy middleware configuration
const apiProxy = createProxyMiddleware('/api', {
    target: API_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding
    },
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${API_URL}${proxyReq.path}`);
    }
});

// Use proxy middleware for /api routes
app.use('/api', apiProxy);

// Handle SPA routing by serving index.html for non-api routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error logging middleware
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});