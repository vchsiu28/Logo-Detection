class HttpError extends Error {
    constructor(statusCode, ...args) {
        super(...args);
        this.statusCode = statusCode;
    }
}

const responseHandlerFactory = successCode => {
    return response => {
        const statusCode = response.status;
        if (statusCode === successCode) {
            return response.json();
        }
        return response.json().then(response => {
            throw new HttpError(statusCode, response.message);
        });
    };
};
