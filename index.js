/**
 * Node.js entry point
 */

// dependencies
const server = require('./lib/server');

// app object
const app = {};

// initialization method of app
app.init = () => {
  // start server
  server.init();
};

// app initialization
app.init();
