/**
 * Pizza API Lib
 */

// dependencies
const store = require('../store');
const is = require('../is');
const val = require('../val');
const helpers = require('../helpers');

// config
const collection = 'pizzas';

// user api object to be exported
const pizza = {};

/**
 * Handler callback `handlerCallback`
 * @callback handlerCallback
 * @param {number} statusCode HTTP status code
 * @param {object} payload Javascript object parsed from JSON or undefined
 */

/**
 * Pizza get method for fetching pizza or pizzas
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
pizza.get = (data, callback) => {
  const name = val.def(data.query.name, is.stringAndNotEmpty, false);

  if (name) {
    store.read(collection, name, (err, obj) => {
      if (err || is.notObject(obj)) {
        return callback(404, {'Error': 'Pizza does not exist'});
      }

      callback(200, obj);
    });

    return;
  }

  store.list(collection, (err, objs) => {
    if (err || !objs) {
      return callback(500);
    }

    callback(200, objs);
  });
};

// export pizza
module.exports = pizza;
