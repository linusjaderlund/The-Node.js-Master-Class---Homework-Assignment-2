/**
 * CLI module
 */

// dependencies
const readline = require('readline');
const Events = require('events');
const is = require('./is');
const val = require('./val');
const responder = require('./cli-responder');

// Create and instantiate events class
class CliEvents extends Events {};
const event = new CliEvents();

const cmd = {
  EXIT: 'exit',
  MENU: 'menu',
  ORDERS: 'orders',
  ORDER_BY_ID: 'order',
  USERS: 'users',
  USER_BY_ID: 'user'
};

event.on(cmd.EXIT, responder.exit);
event.on(cmd.MENU, responder.listMenu);
event.on(cmd.ORDERS, responder.listOrders);
event.on(cmd.ORDER_BY_ID, responder.orderById);
event.on(cmd.USERS, responder.listUsers);
event.on(cmd.USER_BY_ID, responder.userById);

// Private functions/methods
const processInput = (str) => {
  str = val.def(str.trim(), is.stringAndNotEmpty, false);
  if (!str) {
    return;
  }

  for (const key of Object.keys(cmd)) {
    if (str.indexOf(cmd[key]) > -1) {
      event.emit(cmd[key], str);
      break;
    }
  }
};

// CLI object ot be exported
const cli = {};

cli.init = () => {
  console.log('\x1b[32m%s\x1b[0m', '-- Welcome to Pizza Guy CLI --');

  const cliInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

  cliInterface.prompt();

  cliInterface.on('line', (str) => {
    processInput(str);
    cliInterface.prompt();
  });

  cliInterface.on('close', responder.exit);
};

// export cli
module.exports = cli;
