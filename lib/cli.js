/**
 * CLI module
 */

// dependencies
const readline = require('readline');
const Events = require('events');

// Create and instantiate events class
class CliEvents extends Events {};
const event = new CliEvents();

// Private functions/methods
const processInput = (str) => {};

// CLI object ot be exported
const cli = {};

cli.init = () => {
  console.log('\x1b[32m%s\x1b[0m', '-- Welcome to Pizza Guy CLI --');

  const cliInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '$ '
  });

  cliInterface.prompt();

  cliInterface.on('line', (str) => {
    processInput(str);
    cliInterface.prompt();
  });

  cliInterface.on('close', () => {
    console.log('-- Exiting Pizza Guy CLI --');
    process.exit(0);
  });
};

// export cli
module.exports = cli;
