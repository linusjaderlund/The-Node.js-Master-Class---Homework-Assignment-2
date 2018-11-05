/**
 * Router definition
 */

// dependencies
const handlers = require('./handlers');

// exporting router object
module.exports = {
  'user': handlers.user,
  'ping': handlers.ping,
  'token': handlers.token,
  'product': handlers.product,
  'cart': handlers.cart,
  'pay': handlers.pay
};
