const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class UnprocessableEntityError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}

module.exports = UnprocessableEntityError;
