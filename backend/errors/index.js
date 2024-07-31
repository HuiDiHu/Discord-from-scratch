const CustomAPIError = require('./custom-api')
const UnauthenticatedError = require('./unauthenticated')
const NotFoundError = require('./not-found')
const BadRequestError = require('./bad-request')
const UnprocessableEntityError = require('./unprocessable_entity')
const UnauthorizedError = require('./unauthorized')

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnprocessableEntityError,
  UnauthorizedError
}
