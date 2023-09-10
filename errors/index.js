const BadRequestError = require("./badRequest");
const customApiError = require("./customApiError");
const NotFoundError = require("./notFound");
const UnauthenticatedError = require("./unauthenticated");



module.exports = {
    customApiError,
    BadRequestError,
    NotFoundError,
    UnauthenticatedError

}