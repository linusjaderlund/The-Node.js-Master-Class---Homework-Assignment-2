/**
 * Product API Lib
 */

// dependencies
const store = require('../store');
const is = require('../is');
const val = require('../val');
const keys = require('../keys');

// config
const collection = keys.collection;
const status = keys.http.status;

// user api object to be exported
const product = {};

/**
 * Handler callback `handlerCallback`
 * @callback handlerCallback
 * @param {number} statusCode HTTP status code
 * @param {object} payload Javascript object parsed from JSON or undefined
 */

/**
 * Product get method for fetching product or products
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
product.get = (data, callback) => {
  const product = val.def(data.query.product, is.stringAndNotEmpty, false);

  if (product) {
    store.read(collection.PRODUCTS, product, (err, obj) => {
      if (err || is.notObject(obj)) {
        return callback(status.NOT_FOUND, {'Error': 'Product does not exist'});
      }

      callback(status.OK, obj);
    });

    return;
  }

  store.list(collection.PRODUCTS, (err, objs) => {
    if (err || !objs) {
      return callback(status.INTERNAL_SERVER_ERROR);
    }

    callback(status.OK, objs);
  });
};

// export product
module.exports = product;
