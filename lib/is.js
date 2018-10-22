/**
 * Lib with various validators
 */

// is object to be exported
const is = {};

/**
 * Method to determine if input is a number or not
 * @param {any} input
 * @return {boolean} Returns true is input is a number
 */
is.number = (input) => {
  return typeof(input) === 'number';
};

/**
 * Method to determine if input is an object or not
 * @param {any} input
 * @return {boolean} Returns true if input is of type object,
 *    not null and not an instance of an array
 */
is.object = (input) => {
  return typeof(input) === 'object' && input !== null && !Array.isArray(input);
};

/**
 * Method to determine if input is an array or not
 * @param {any} input
 * @return {boolean} Returns true if input is an  array
 */
is.array = (input) => {
  return Array.isArray(input);
};

/**
 * Method to determine if input is an array and if the array is empty
 * @param {any} input
 * @return {boolean} Retruns true if input is an array
 *    and if said array is empty
 */
is.arrayAndEmpty = (input) => {
  return is.array(input) && input.length === 0;
};

/**
 * Method to determine if input is an array and if the array is NOT empty
 * @param {any} input
 * @return {boolean} Retruns true if input is an array
 *    and if said array is NOT empty
 */
is.arrayAndNotEmpty = (input) => {
  return is.array(input) && input.length > 0;
};

/**
 * Method to determine if input is of type string
 * @param {any} input
 * @return {boolean} Returns true if input is of type string
 */
is.string = (input) => {
  return typeof(input) === 'string';
};

// export is
module.exports = is;
