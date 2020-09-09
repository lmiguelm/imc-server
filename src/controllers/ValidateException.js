class ValidateException {
    constructor(message, status) {
        this.status = status;
        this.message = message;
    }
}

module.exports = ValidateException;