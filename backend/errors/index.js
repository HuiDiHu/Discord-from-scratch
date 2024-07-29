const CustomAPIError = require('./custom-api')
const UnauthenticatedError = require('./unauthenticated')
const NotFoundError = require('./not-found')
const BadRequestError = require('./bad-request')
const UnprocessableEntityError = require('./unprocessable_entity')

module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnprocessableEntityError
}
