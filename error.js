class HttpError extends Error {
    constructor(statusCode, ...args) {
        super(...args);
        Error.captureStackTrace(this, HttpError);
        this.statusCode = statusCode;
    }
}

exports.HttpError = HttpError;
