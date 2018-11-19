/**
 * Cart API Lib
 */

// dependencies
const store = require('../store');
const is = require('../is');
const val = require('../val');
const keys = require('../keys');

// config
const collection = keys.collection;
const status = keys.http.status;

// cart api object to be exported
const cart = {};

/**
 * Cart post method for creating empty cart for user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
cart.post = (data, callback) => {
  store.create(collection.CARTS, data.JWT.payload.mail, [], (err) => {
    if (err) {
      return callback(status.INTERNAL_SERVER_ERROR,
          {Error: 'Could not create cart, it might exist'});
    }

    callback(status.OK);
  });
};

/**
 * Cart get method for getting cart for user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
cart.get = (data, callback) => {
  store.read(collection.CARTS, data.JWT.payload.mail, (err, obj) => {
    if (err || !obj) {
      return callback(status.NOT_FOUND, {Error: 'Cart does not exist'});
    }

    callback(status.OK, obj);
  });
};

/**
 * Cart put method for updating cart for user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
cart.put = (data, callback) => {
  const obj = {
    product: val.def(data.payload.product, is.stringAndNotEmpty, false),
    amount: val.def(parseInt(data.payload.amount), is.number, false)
  };

  if (is.objectWithFalseValues(obj)) {
    return callback(status.TEAPOT, {'Error': 'Payload data was insufficient'});
  }

  store.read(collection.CARTS, data.JWT.payload.mail, (err, userCart) => {
    if (err || is.notArray(userCart)) {
      return callback(status.NOT_FOUND);
    }

    store.read(collection.PRODUCTS, obj.product, (err, product) => {
      if (err || is.notObject(product)) {
        return callback(status.INTERNAL_SERVER_ERROR);
      }

      let referenceProduct = userCart.find((item) => {
        return item.product === obj.product;
      });

      if (is.notObject(referenceProduct)) {
        userCart.push(product);
        referenceProduct = product;
      }

      referenceProduct.amount = obj.amount;

      // store modified cart
      store.update(collection.CARTS, data.JWT.payload.mail, userCart, (err) => {
        if (err) {
          return callback(status.INTERNAL_SERVER_ERROR);
        }

        callback(status.OK);
      });
    });
  });
};

/**
 * Cart delete method for deleting cart for user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
cart.delete = (data, callback) => {
  const obj = {
    product: val.def(data.payload.product, is.stringAndNotEmpty, false)
  };

  if (is.objectWithFalseValues(obj)) {
    store.delete(collection.CARTS, data.JWT.payload.mail, (err) => {
      if (err) {
        return callback(status.INTERNAL_SERVER_ERROR);
      }

      callback(status.OK);
    });

    return;
  }

  store.read(collection.CARTS, data.JWT.payload.mail, (err, userCart) => {
    if (err || is.notArray(userCart)) {
      return callback(status.INTERNAL_SERVER_ERROR);
    }

    const updatedUserCart = userCart.filter((item) => {
      return item.product !== obj.product;
    });

    store.update(collection.CARTS, data.JWT.payload.mail, updatedUserCart,
        (err) => {
          if (err) {
            return callback(status.INTERNAL_SERVER_ERROR);
          }

          callback(status.OK);
        });
  });
};

// export cart object
module.exports = cart;
