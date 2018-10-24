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

// export helpers
module.exports = helpers;
