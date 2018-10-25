/**
 * Route handlers
 */

// dependencies
const user = require('./api/user');
const pizza = require('./api/pizza');
const token = require('./api/token');
const is = require('./is');

// handlers object to be exported
const handlers = {};

/**
 * Handler callback `handlerCallback`
 * @callback handlerCallback
 * @param {number} statusCode HTTP status code
 * @param {object} payload Javascript object parsed from JSON or undefined
 */

/**
 * Route handler for user actions
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
handlers.user = (data, callback) => {
  const protectedMethods = ['get', 'put', 'delete'];
  const action = user[data.method];

  if (is.notFunction(action)) {
    return callback(405);
  }

  if (protectedMethods.includes(data.method)) {
    token.verify(data, (verified) => {
      if (!verified) {
        return callback(401);
      }

      action(data, callback);
    });

    return;
  }

  action(data, callback);
};

/**
 * Route handler for pizza actions
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
handlers.pizza = (data, callback) => {
  const protectedMethods = ['post', 'put', 'delete'];
  const action = pizza[data.method];

  if (is.notFunction(action)) {
    return callback(405);
  }

  if (protectedMethods.includes(data.method)) {
    token.verify(data, (verified) => {
      if (!verified) {
        return callback(401);
      }

      action(data, callback);
    });

    return;
  }

  action(data, callback);
};

/**
 * Route handler for token actions
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
handlers.token = (data, callback) => {
  const action = token[data.method];
  if (is.notFunction(action)) {
    return callback(405);
  }

  action(data, callback);
};

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
