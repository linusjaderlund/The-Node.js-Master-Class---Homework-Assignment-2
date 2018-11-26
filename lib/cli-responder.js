const store = require('./store');
const keys = require('./keys');
const print = require('./cli-print');
const val = require('./val');
const is = require('./is');

const collection = keys.collection;

const responder = {};

responder.listMenu = (str) => {
  store.list(collection.PRODUCTS, (err, objs) => {
    if (err || !objs) {
      return;
    }

    print.header('menu');

    for (const product of objs) {
      print.center(`~ ${product.product} ~`);
      print.center(product.ingredients);
      print.center(`$${product.price.USD}`);
      print.empty();
    }

    print.line();
    print.empty();
  });
};

responder.listOrders = (str) => {
  console.log('List orders responder');
};

responder.orderById = (str) => {
  console.log('Order by id responder');
};

responder.listUsers = (str) => {
  store.list(collection.USERS, (err, objs) => {
    if (err || !objs) {
      return;
    }

    // getting timestamp from 24h back
    const minTimestamp = Date.now() - (1000 * 60 * 60 * 24);
    const padding = 35;
    const users = objs.filter((user) => {return user.created > minTimestamp;});


    print.header('Users created last 24h');
    print.columns(padding, 'Name', 'Mail', 'Created');

    for (const user of users) {
      print.columns(
        padding,
        `${user.firstName} ${user.lastName}`,
        user.mail,
        user.created
      );
    }

    print.empty();
    print.line();
    print.empty();
  });
};

responder.userById = (str) => {
  let mail;

  try {
    mail = val.def(str.split('--')[1].trim(), is.stringAndNotEmpty, false);
  } catch (e) {
    console.log('--- No such user');
    return;
  }

  if (!mail) {
    console.log('--- No such user');
    return;
  }

  store.read(collection.USERS, mail, (err, user) => {
    if (err || !user) {
      console.log('--- No such user');
      return;
    }

    delete user.password;

    print.header(`${user.firstName} ${user.lastName}`);
    console.dir(user, {colors: true});
    print.empty();
    print.line();
    print.empty();
  });
};

module.exports = responder;
