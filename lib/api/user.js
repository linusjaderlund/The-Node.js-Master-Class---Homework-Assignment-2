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
 * @return {undefined}
 */
user.get = (data, callback) => {
  store.read(collection, data.JWT.payload.mail, (err, obj) => {
    if (err || is.notObject(obj)) {
      return callback(404, {'Error': 'User does not exist'});
    }

    // cleaning sensetive data from user obj
    delete obj.password;

    callback(200, obj);
  });
};

/**
 * User put method for updating user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
user.put = (data, callback) => {
  const update = val.cleanFalseProperties({
    // note: hashing password
    password: val.def(helpers.hash(data.payload.password),
        is.stringAndNotEmpty, false),
    firstName: val.def(data.payload.firstName, is.stringAndNotEmpty, false),
    lastName: val.def(data.payload.lastName, is.stringAndNotEmpty, false),
    streetAddress: val.def(data.payload.streetAddress,
        is.stringAndNotEmpty, false),
    zipCode: val.def(data.payload.zipCode, is.stringAndNotEmpty, false),
    state: val.def(data.payload.state, is.stringAndNotEmpty, false)
  });

  if (is.objectAndEmpty(update)) {
    return callback(400, {'Error': 'Nothing to update'});
  }

  store.read(collection, data.JWT.payload.mail, (err, obj) => {
    if (err || is.notObject(obj)) {
      return callback(404, {'Error': 'User does not exist'});
    }

    const merge = {...obj, ...update};

    store.update(collection, data.JWT.payload.mail, merge, (err) => {
      if (err) {
        return callback(500);
      }

      callback(200);
    });
  });
};

/**
 * User delete method for removing user
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
user.delete = (data, callback) => {
  store.delete(collection, data.JWT.payload.mail, (err) => {
    if (err) {
      return callback(500, {'Error': 'Could not delete user'});
    }

    callback(200);
  });
};

// export user api
module.exports = user;
