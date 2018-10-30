/**
 * Token API Lib
 */

// dependencies
const store = require('../store');
const is = require('../is');
const val = require('../val');
const helpers = require('../helpers');

// config
const collection = 'tokens';
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

    const tokenObject = {
      mail: obj.mail,
      id: helpers.randomString(30),
      expires: Date.now() + (1000 * 60 * 60)
    };

    store.create(collection, tokenObject.id, tokenObject, (err) => {
      if (err) {
        return callback(500, {'Error': 'Could not create token, my bad!'});
      }

      callback(200, tokenObject);
    });
  });
};

/**
 * Token get method for fetching token
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
token.get = (data, callback) => {
  const id = val.def(data.query.id.trim(), is.stringAndNotEmpty, false);

  if (!id) {
    return callback(418, {'Error': 'Payload data was insufficient'});
  }

  store.read(collection, id, (err, obj) => {
    if (err || !obj) {
      return callback(404);
    }

    callback(200, obj);
  });
};

/**
 * Token put method for updating token
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
token.put = (data, callback) => {
  const id = val.def(data.payload.id.trim(), is.stringAndNotEmpty, false);

  if (!id) {
    return callback(418, {'Error': 'Payload data was insufficient'});
  }

  store.read(collection, id, (err, obj) => {
    if (err || !obj) {
      return callback(404);
    }

    if (obj.expires < Date.now()) {
      return callback(400, {'Error': 'Token expired'});
    }

    obj.expires = Date.now() + (1000 * 60 * 60);

    store.update(collection, id, obj, (err) => {
      if (err) {
        return callback(500, {'Error': 'Could not update token, my bad!'});
      }

      callback(200);
    });
  });
};

/**
 * Token delete method for removing token
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
token.delete = (data, callback) => {
  const id = val.def(data.query.id.trim(), is.stringAndNotEmpty, false);

  if (!id) {
    return callback(418, {'Error': 'Payload data was insufficient'});
  }

  store.delete(collection, id, (err) => {
    if (err) {
      return callback(404);
    }

    callback(200);
  });
};

/**
 * Token delete method for removing token
 * @param {object} data Parsed data from request
 * @param {Function} callback Callback function passing verified boolean
 * @return {undefined}
 */
token.verify = (data, callback) => {
  const id = val.def(data.headers.token, is.stringAndNotEmpty, false);
  // const payloadSource = {
  //   post: 'payload',
  //   get: 'query',
  //   put: 'payload',
  //   delete: 'query'
  // };
  // const payload = payloadSource[data.method];

  if (!id) {
    return callback(false);
  }

  store.read(collection, id, (err, obj) => {
    if (err || !obj) {
      return callback(false);
    }

    // const mail = val.def(data[payload].mail, is.mail, false);

    // if (is.notMail(mail) || obj.mail !== mail || obj.expires < Date.now()) {
    if (obj.expires < Date.now()) {
      return callback(false);
    }

    callback(true);
  });
};

// export token
module.exports = token;
