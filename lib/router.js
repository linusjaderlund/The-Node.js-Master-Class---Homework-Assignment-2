/**
 * Router definition
 */

// dependencies
const handlers = require('./handlers');

// exporting router object
module.exports = {
  'ping': handlers.ping
};
