/**
 * Value conversion lib
 */

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

// export value
module.exports = val;
