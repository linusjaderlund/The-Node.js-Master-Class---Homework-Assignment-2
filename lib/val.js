/**
 * Value conversion lib
 */

// dependencies
const is = require('./is');

// value object to be exported
const val = {};

/**
 * Returns input if input passes assertion else returns specified default value
 * @param {any} input Input to be asserted
 * @param {Function} assert Assertion function
 * @param {any} def Fallback value if assertion fails
 * @return {any} Returns input or default value
 */
val.def = (input, assert, def) => {
  return assert(input) ? input : def;
};

/**
 * Removes properties with false values and returns a new object without them
 * @param {object} obj Input to be asserted
 * @return {any} Returns new object without false properties
 */
val.cleanFalseProperties = (obj) => {
  if (is.notObject(obj)) {
    return obj;
  }

  const keys = Object.keys(obj);
  const cleanObj = {};

  for (const key of keys) {
    if (obj[key] !== false) {
      cleanObj[key] = obj[key];
    }
  }

  return cleanObj;
};

// export value
module.exports = val;
