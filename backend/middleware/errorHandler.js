/* ============================================================
   middleware/errorHandler.js — Central error handler
   ============================================================
   HOW MIDDLEWARE WORKS (for beginners):
   Express middleware is a function that runs BETWEEN receiving
   a request and sending a response. It receives (req, res, next).

   An ERROR-handling middleware specifically has 4 parameters:
   (err, req, res, next). Express knows it's for errors because
   of the 4 parameters.

   Any route can call next(err) to skip to this handler.
   This way we don't repeat try/catch in every single route.
   ============================================================ */

const errorHandler = (err, req, res, next) => {
    // Log the full error to the terminal (for debugging)
    console.error('❌  Error:', err.message);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose: document not found
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found with id: ${err.value}`;
    }

    // Mongoose: duplicate key (e.g. unique email)
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate value entered for field: ' + Object.keys(err.keyValue).join(', ');
    }

    // Mongoose: validation failed (required field missing, wrong enum, etc.)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join('. ');
    }

    res.status(statusCode).json({
        success: false,
        message,
        // Only send stack trace in development — never in production
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
