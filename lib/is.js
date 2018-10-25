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
 * Method to determine if input is NOT a number
 * @param {any} input
 * @return {boolean} Returns true is input is NOT a number
 */
is.notNumber = (input) => {
  return !is.number(input);
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
 * Method to determine if input is an object or array
 * @param {any} input
 * @return {boolean} Returns true if input is of type object or array
 */
is.objectOrArray = (input) => {
  return typeof(input) === 'object' && input !== null;
};

/**
 * Method to determine if input is NOT an object
 * @param {any} input
 * @return {boolean} Returns true if input is NOT an object
 */
is.notObject = (input) => {
  return !is.object(input);
};

/**
 * Method to determine if input is an object and empty
 * @param {any} input
 * @return {boolean} Returns true if input is object and empty
 */
is.objectAndEmpty = (input) => {
  return is.object(input) && Object.keys(input).length === 0;
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

/**
 * Method to determine if input is empty string
 * @param {any} input
 * @return {boolean} Returns true if input is empty string
 */
is.stringAndEmpty = (input) => {
  return is.string(input) && input === '';
};

/**
 * Method to determine if input is of type string and not empty
 * @param {any} input
 * @return {boolean} Returns true if input is of type string and not empty
 */
is.stringAndNotEmpty = (input) => {
  return is.string(input) && input.length > 0;
};

/**
 * Method to determine if input is NOT of type string
 * @param {any} input
 * @return {boolean} Returns true if input is NOT of type string
 */
is.notString = (input) => {
  return typeof(input) !== 'string';
};

/**
 * Method to determine if input is of type string and matches the mail pattern
 * @param {any} input
 * @return {boolean} Returns true if input matches the mail pattern
 */
is.mail = (input) => {
  const regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return regexp.test(input);
};

/**
 * Method to determine if input is NOT a mail address
 * @param {any} input
 * @return {boolean} Returns true if input is NOT a mail address
 */
is.notMail = (input) => {
  return !is.mail(input);
};

/**
 * Method to determine if input is a function
 * @param {any} input
 * @return {boolean} Returns true if input is a function
 */
is.function = (input) => {
  return typeof(input) === 'function';
};

/**
 * Method to determine if input is NOT a function
 * @param {any} input
 * @return {boolean} Returns true if input is NOT a function
 */
is.notFunction = (input) => {
  return !is.function(input);
};

/**
 * Method to determine if input is object with false key values
 * @param {any} input
 * @return {boolean} Returns true if object has falsy key values
 */
is.objectWithFalseValues = (input) => {
  if (is.notObject(input)) {
    return true;
  }

  const keys = Object.keys(input);
  for (let i = 0; i < keys.length; i++) {
    if (input[keys[i]] === false) {
      return true;
    }
  }

  return false;
};

// export is
module.exports = is;
