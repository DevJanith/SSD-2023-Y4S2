// middleware/logger.js
const fs = require('fs');
const morgan = require('morgan');

// Create a write stream for the log file
const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });

// Create a Morgan middleware to log requests
const loggerMiddleware = morgan('combined', { stream: accessLogStream });

module.exports = loggerMiddleware;
