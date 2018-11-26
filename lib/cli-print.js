const print = {};

print.center = (str) => {
  const columns = process.stdout.columns;
  const padding = Math.round(columns / 2) - Math.round(str.length / 2);
  console.log(' '.repeat(padding) + str);
};

print.line = () => {
  console.log('-'.repeat(process.stdout.columns));
};

print.empty = () => {
  console.log();
};

print.header = (str) => {
  print.empty();
  print.line();
  print.center(`~ ${str.toUpperCase()} ~`);
  print.line();
  print.empty();
};

print.columns = (padding, ...strs) => {
  let line = '';

  for (const str of strs) {
    line += str + ' '.repeat(padding - str.length);
  }

  console.log(line);
};

module.exports = print;
