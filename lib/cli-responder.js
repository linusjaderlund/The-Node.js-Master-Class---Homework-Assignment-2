const store = require('./store');
const keys = require('./keys');
const print = require('./cli-print');
const val = require('./val');
const is = require('./is');

const collection = keys.collection;

const responder = {};

responder.exit = () => {
  print.header('Thank you, welcome back anytime!');
  process.exit(0);
};

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
  store.list(collection.ORDERS, (err, objs) => {
    if (err || !objs) {
      return;
    }

    // getting timestamp from 24h back
    const minTimestamp = Date.now() - (1000 * 60 * 60 * 24);
    const padding = 25;
    const orders = objs.filter((order) => {
      return order.created > minTimestamp;
    });


    print.header('Orders placed last 24h');
    print.columns(
        padding,
        'Order ID',
        'Customer',
        '# of pizzas',
        'Total payed amount');

    for (const order of orders) {
      print.columns(
          padding,
          order.created.toString(),
          `${order.user.firstName} ${order.user.lastName}`,
          order.products.length.toString(),
          `$${order.totalAmount.toFixed(2)}`
      );
    }

    print.empty();
    print.line();
    print.empty();
  });
};

responder.orderById = (str) => {
  let id;

  try {
    id = val.def(str.split('--')[1].trim(), is.stringAndNotEmpty, false);
  } catch (e) {
    console.log('--- No such order');
    return;
  }

  if (!id) {
    console.log('--- No such order');
    return;
  }


  store.read(collection.ORDERS, id, (err, order) => {
    if (err || !order) {
      console.log('--- No such order');
      return;
    }

    print.header(`Order ${id}`);

    print.center('~ Pizzas to make ~');
    for (const product of order.products) {
      print.center(product.toUpperCase());
    }

    print.empty();
    print.center('~ Deliver to ~');
    print.center(`${order.user.firstName} ${order.user.lastName}`);
    print.center(order.user.streetAddress);
    print.center(`${order.user.zipCode} ${order.user.state}`);

    print.empty();
    print.center('~ Delivery paid for ~');
    print.center(`$${order.totalAmount.toFixed(2)}`);

    print.empty();
    print.line();
    print.empty();
  });
};

responder.listUsers = (str) => {
  store.list(collection.USERS, (err, objs) => {
    if (err || !objs) {
      return;
    }

    // getting timestamp from 24h back
    const minTimestamp = Date.now() - (1000 * 60 * 60 * 24);
    const padding = 35;
    const users = objs.filter((user) => {
      return user.created > minTimestamp;
    });


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
