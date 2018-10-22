/**
 * Lib of varius halpers
 */

// helpers object to be exported
const helpers = {};

/**
 * Method for helping converting string to JSON.
 * Cathing any error thrown to prevent program to terminate
 * @param {string} str JSON string data
 * @param {Function} callback Callback with possible error and converted object
 */
helpers.parseToJSON = (str, callback) => {
  try {
    const json = JSON.parse(str);
    callback(false, json);
  } catch (err) {
    callback(`Error occured while trying to parse string to JSON: ${err}`);
  }
};

// export helpers
module.exports = helpers;
