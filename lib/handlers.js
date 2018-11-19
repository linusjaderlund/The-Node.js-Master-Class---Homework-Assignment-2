/**
 * Route handlers
 */

// dependencies
const user = require('./api/user');
const product = require('./api/product');
const token = require('./api/token');
const cart = require('./api/cart');
const pay = require('./api/pay');
const listCtrl = require('./controller/list');
const cartCtrl = require('./controller/cart');
const loginCtrl = require('./controller/login');
const publicCtrl = require('./controller/public');
const is = require('./is');
const helpers = require('./helpers');
const keys = require('./keys');

// config
const status = keys.http.status;

// handlers object to be exported
const handlers = {};

/**
 * Handler callback `handlerCallback`
 * @callback handlerCallback
 * @param {number} statusCode HTTP status code
 * @param {object} payload Javascript object parsed from JSON or undefined
 */

/**
 * Generic route handler for most route actions
 * @param {object} api Api lib with router methods/actions
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @param {params} protectedMethods Defines zero or more protected methods
 * @return {undefined}
 */
const handleApiAction = (api, data, callback, ...ungardedMethods) => {
  const action = api[data.method];

  if (is.notFunction(action)) {
    return callback(status.METHOD_NOT_ALLOWED);
  }

  if (ungardedMethods.includes(data.method)) {
    return action(data, callback);
  }

  helpers.verifyJWT(data.headers.token, (err, tokenPayload) => {
    if (err) {
      return callback(status.UNAUTHORIZED);
    }

    data.JWT = {
      payload: tokenPayload
    };

    action(data, callback);
  });
};

const handleViewAction = (viewHandler, data, callback, ...ungardedMethods) => {
  // const action = view[data.method];

  if (data.method !== 'get') {
    return callback(status.METHOD_NOT_ALLOWED);
  }

  if (ungardedMethods.includes(data.method)) {
    return viewHandler(data, callback);
  }

  helpers.verifyJWT(data.headers.token, (err, tokenPayload) => {
    if (err) {
      return callback(status.UNAUTHORIZED);
    }

    data.JWT = {
      payload: tokenPayload
    };

    viewHandler(data, callback);
  });
};

// API HANDLERS

/**
 * Route handler for user actions
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.user = (data, callback) => {
  handleApiAction(user, data, callback, 'post');
};

/**
 * Route handler for product actions
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.product = (data, callback) => {
  handleApiAction(product, data, callback);
};

/**
 * Route handler for cart actions
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.cart = (data, callback) => {
  handleApiAction(cart, data, callback);
};

/**
 * Route handler for token actions
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.token = (data, callback) => {
  handleApiAction(token, data, callback, 'post');
};

/**
 * Route handler for pay actions
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.pay = (data, callback) => {
  handleApiAction(pay, data, callback);
};

/**
 * Route handler for simple ping test (200)
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.ping = (data, callback) => {
  callback(status.OK, {'Pizza guy:':
    'Hello and welcome, would you like to place an order?'});
};

/**
 * Route handler for resource not found (404)
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.notFound = (data, callback) => {
  callback(status.NOT_FOUND);
};

/**
 * Route handler for request sent with invalid JSON data (400)
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
handlers.invalidPayload = (data, callback) => {
  callback(status.BAD_REQUEST, {'Error':
    'Payload sent with request could not be parsed'});
};

// VIEW HANDLERS
handlers.listView = (data, callback) => {
  handleViewAction(listCtrl, data, callback, 'get');
};

handlers.cartView = (data, callback) => {
  handleViewAction(cartCtrl, data, callback, 'get');
};

handlers.loginView = (data, callback) => {
  handleViewAction(loginCtrl, data, callback, 'get');
};

handlers.public = (data, callback) => {
  handleViewAction(publicCtrl, data, callback, 'get');
};

// export handlers
module.exports = handlers;
