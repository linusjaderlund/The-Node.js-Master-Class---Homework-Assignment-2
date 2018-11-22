/**
 * Node.js entry point
 */

// dependencies
const server = require('./lib/server');
const cli = require('./lib/cli');

// app object
const app = {};

// initialization method of app
app.init = () => {
  // start server
  server.init();

  // start cli
  setTimeout(() => {
    cli.init();
  }, 100);
};

// app initialization
app.init();
