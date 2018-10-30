/**
 * Token API Lib
 */

// dependencies
const store = require('../store');
const is = require('../is');
const val = require('../val');
const helpers = require('../helpers');

// config
// const collection = 'tokens';
const usersCollection = 'users';

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
    return callback(418, {'Error': 'Payload data was insufficient'});
  }

  store.read(usersCollection, obj.mail, (err, user) => {
    if (err || !user) {
      return callback(400, {'Error': 'User does not exist'});
    }

    if (helpers.hash(obj.password) !== user.password) {
      return callback(401);
    }

    // creating JWT token
    // const expiration = Date.now() + (1000 * 60 * 60);
    const JWT = helpers.createJWT({
      // exp: expiration,
      mail: obj.mail
    });

    if (!JWT) {
      callback(500);
    }

    callback(200, JWT);
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
    return callback(418, {'Error': 'Payload data was insufficient'});
  }

  const JWT = helpers.createJWT({
    ...data.JWT.payload,
    exp: undefined
  });

  callback(200, JWT);
};

// export token
module.exports = token;
