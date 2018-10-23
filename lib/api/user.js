/**
 * User API Lib
 */

// dependencies
const store = require('../store');
const is = require('../is');
const val = require('../val');
const helpers = require('../helpers');

// config
const collection = 'users';

// user api object to be exported
const user = {};

/**
 * Handler callback `handlerCallback`
 * @callback handlerCallback
 * @param {number} statusCode HTTP status code
 * @param {object} payload Javascript object parsed from JSON or undefined
 */

/**
 * User post method for creating user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
user.post = (data, callback) => {
  const obj = {
    mail: val.def(data.payload.mail, is.mail, false),
    password: val.def(data.payload.password, is.stringAndNotEmpty, false),
    firstName: val.def(data.payload.firstName, is.stringAndNotEmpty, false),
    lastName: val.def(data.payload.lastName, is.stringAndNotEmpty, false),
    streetAddress: val.def(data.payload.streetAddress,
        is.stringAndNotEmpty, false),
    zipCode: val.def(data.payload.zipCode, is.stringAndNotEmpty, false),
    state: val.def(data.payload.state, is.stringAndNotEmpty, false)
  };

  if (is.objectWithFalseValues(obj)) {
    return callback(418, {'Error': 'Payload data was insufficient'});
  }

  store.read(collection, obj.mail, (err) => {
    if (!err) {
      return callback(400, {'Error': 'User already exist'});
    }

    obj.password = helpers.hash(obj.password);

    if (!obj.password) {
      return callback(500, {'Error': 'Could not hash password, my bad!'});
    }

    store.create(collection, obj.mail, obj, (err) => {
      if (err) {
        return callback(500, {'Error': 'Could not create user, my bad!'});
      }

      callback(200);
    });
  });
};

/**
 * User get method for fetching user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
// user.get = (data, callback) => {};

/**
 * User put method for updating user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
// user.put = (data, callback) => {};

/**
 * User delete method for removing user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 */
// user.delete = (data, callback) => {};

// export user api
module.exports = user;
