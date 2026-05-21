const errorHandler = (err, req, res, next) => {
    console.error('[SERVER ERROR]', err);

    // If response headers have already been sent, delegate to standard Express handler
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
