/**
 * Router definition
 */

// dependencies
const handlers = require('./handlers');

// exporting router object
module.exports = {
  // VIEW HANDLERS
  '': handlers.listView,
  'login': handlers.loginView,
  'public': handlers.public,
  // API HANDLERS
  'api/user': handlers.user,
  'api/ping': handlers.ping,
  'api/token': handlers.token,
  'api/product': handlers.product,
  'api/cart': handlers.cart,
  'api/pay': handlers.pay
};
