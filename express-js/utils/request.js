class BadRequestError extends Error {
    constructor(errors) {
        super("Validation failed!");
        this.errors = errors;
        this.status = 400;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        if (message) {
            super(message);
        } else {
            super("Data is Not Found!");
        }
        this.status = 404;
    }
}

class InternalServerError extends Error {
    constructor(errors) {
        super("Internal Server Error");
        this.status = 500;
        this.errors = errors;
    }
}

module.exports = {
    BadRequestError,
    NotFoundError,
    InternalServerError,
};