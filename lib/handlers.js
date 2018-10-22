/**
 * Route handlers
 */

// handlers object to be exported
const handlers = {};

/**
 * Handler callback `handlerCallback`
 * @callback handlerCallback
 * @param {number} statusCode HTTP status code
 * @param {object} payload Javascript object parsed from JSON or undefined
 */

/**
 * Route handler for simple ping test (200)
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.ping = (data, callback) => {
  callback(200, {'Pizza guy:':
    'Hello and welcome, would you like to place an order?'});
};

/**
 * Route handler for resource not found (404)
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.notFound = (data, callback) => {
  callback(404);
};

/**
 * Route handler for request sent with invalid JSON data (400)
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.invalidPayload = (data, callback) => {
  callback(400, {'400 Bad Request':
    'Payload sent with request could not be parsed'});
};

// export handlers
module.exports = handlers;
