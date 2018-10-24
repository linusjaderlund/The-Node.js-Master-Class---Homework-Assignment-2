/**
 * Lib of varius halpers
 */

// dependencies
const crypto = require('crypto');
const is = require('./is');

// helpers object to be exported
const helpers = {};

/**
 * Method for helping converting string to JSON.
 * Cathing any error thrown to prevent program to terminate
 * @param {string} str JSON string data
 * @param {Function} callback Callback with possible error and converted object
 */
helpers.parseJSON = (str, callback) => {
  try {
    const json = JSON.parse(str);
    callback(false, json);
  } catch (err) {
    callback(`Error occured while trying to parse string to JSON: ${err}`);
  }
};

/**
 * Method for hashing string, useful for handling passwords
 * @param {string} str String to be hashed
 * @return {string} Returns hashed string
 */
helpers.hash = (str) => {
  return (is.notString(str) || is.stringAndEmpty(str)) ? false : crypto
      .createHmac('sha256', 'eTm&W(Y3?jsD|7bYUN$]lt;U[-UT(a')
      .update(str).digest('hex');
};

/**
 * Method for creating random number between given min and max
 * @param {number} min Min random number
 * @param {number} max Max random number
 * @return {string} Returns random number
 */
helpers.randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Method for creating random string of a given lenght
 * @param {number} length String lenght
 * @return {string} Returns random string
 */
helpers.randomString = (length) => {
  if (is.notNumber(length) || length <= 0) {
    return false;
  }

  const chars =
    'abcdefghijklmnopqrstuvwxyz' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    '0123456789';
  let str = '';

  for (let i = 0; i < length; i++) {
    str += chars.charAt(helpers.randomNumber(0, chars.length));
  }

  return str;
};

// export helpers
module.exports = helpers;
