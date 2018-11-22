const store = require('./store');
const keys = require('./keys');
const print = require('./cli-print');

const collection = keys.collection;

const responder = {};

responder.listMenu = (str) => {
  store.list(collection.PRODUCTS, (err, objs) => {
    if (err || !objs) {
      return;
    }

    // console.dir(objs, {colors: true});
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
  console.log('List users responder');
};

responder.userById = (str) => {
  console.log('User by id responder');
};

module.exports = responder;
