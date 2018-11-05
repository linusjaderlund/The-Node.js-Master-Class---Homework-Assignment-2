/**
 * Token API Lib
 */

// dependencies
const store = require('../store');
const is = require('../is');
const val = require('../val');
const helpers = require('../helpers');
const keys = require('../keys');

// config
const collection = keys.collection;
const status = keys.http.status;

// token object to be exported
const token = {};

/**
 * Handler callback `handlerCallback`
 * @callback handlerCallback
 * @param {number} statusCode HTTP status code
 * @param {object} payload Javascript object parsed from JSON or undefined
 */

/**
 * Token post method for creating token
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
token.post = (data, callback) => {
  const obj = {
    mail: val.def(data.payload.mail, is.mail, false),
    password: val.def(data.payload.password, is.stringAndNotEmpty, false)
  };

  if (is.objectWithFalseValues(obj)) {
    return callback(status.TEAPOT, {'Error': 'Payload data was insufficient'});
  }

  store.read(collection.USERS, obj.mail, (err, user) => {
    if (err || !user) {
      return callback(status.BAD_REQUEST, {'Error': 'User does not exist'});
    }

    if (helpers.hash(obj.password) !== user.password) {
      return callback(status.UNAUTHORIZED);
    }

    // creating JWT token
    // const expiration = Date.now() + (1000 * 60 * 60);
    const JWT = helpers.createJWT({
      // exp: expiration,
      mail: obj.mail
    });

    if (!JWT) {
      callback(status.INTERNAL_SERVER_ERROR);
    }

    callback(status.OK, JWT);
  });
};

/**
 * Token put method for updating token
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
token.put = (data, callback) => {
  if (data.payload.extend !== true) {
    return callback(status.TEAPOT, {'Error': 'Payload data was insufficient'});
  }

  const JWT = helpers.createJWT({
    ...data.JWT.payload,
    exp: undefined
  });

  callback(status.OK, JWT);
};

// export token
module.exports = token;
