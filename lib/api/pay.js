/**
 * Payment API lib
 */

// dependencies
const https = require('https');
const querystring = require('querystring');
const is = require('../is');
const val = require('../val');
const keys = require('../keys');
const store = require('../store');

// config
const status = keys.http.status;
const collection = keys.collection;

// cart api object to be exported
const pay = {};

/**
 * Private function handling payment https request to external service
 * @param {object} obj Object containing information
 * @param {Function} callback Callback function
 * @return {undefined}
 */
const requestPayment = (obj, callback) => {
  const postData = querystring.stringify({
    amount: obj.amount,
    currency: 'usd',
    description: 'Example charge',
    source: 'tok_visa'
  });
  const options = {
    host: 'api.stripe.com',
    path: '/v1/charges',
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
      'Authorization': 'Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc',
    }
  };

  const req = https.request(options, (res) => {
    res.on('error', (err) => {
      callback(err);
    });
  });

  req.on('error', (err) => {
    callback(err);
  });

  req.write(postData);

  req.end(() => {
    callback(false);
  });
};

/**
 * Private function handling mail https request to external service
 * @param {object} data Parsed data from request
 * @param {object} obj Object containing information
 * @param {Function} callback Callback function
 * @return {undefined}
 */
const requestMail = (data, obj, callback) => {
  const postData = querystring.stringify({
    from: 'Pizza Gun <excited@samples.mailgun.org>',
    to: data.JWT.payload.mail,
    subject: 'New order @ Pizza Gun!',
    text: `New order of pizzas has been placed at ` +
      `Pizza Gun with the total amount of ${obj.amount} USD`
  });
  const options = {
    host: 'api.mailgun.net',
    path: '/v3/samples.mailgun.org/messages',
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length,
      'Authorization': 'Basic ' +
        Buffer.from('api:key-3ax6xnjp29jd6fds4gc373sgvjxteol0')
            .toString('base64'),
    }
  };

  const req = https.request(options, (res) => {
    res.on('error', (err) => {
      callback(err);
    });
  });

  req.on('error', (err) => {
    callback(err);
  });

  req.write(postData);

  req.end(() => {
    callback(false);
  });
};

const storeOrder = (data) => {
  store.read(collection.CARTS, data.JWT.payload.mail, (err, cart) => {
    if (err || !cart) {
      return;
    }

    const order = {
      user: null,
      products: [],
      totalAmount: 0,
      created: Date.now()
    };

    for (const product of cart) {
      order.products.push(product.product);
      order.totalAmount += (product.price.USD * product.amount);
    }

    store.read(collection.USERS, data.JWT.payload.mail, (err, user) => {
      if (err || !user) {
        return;
      }

      order.user = user;

      store.create(collection.ORDERS, Date.now(), order, () => {});
    });
  });
};

/**
 * Pay post method for requesting payment to external service
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
pay.post = (data, callback) => {
  const obj = {
    amount: val.def(parseInt(data.payload.amount), is.number, false)
  };

  if (is.objectWithFalseValues(obj)) {
    return callback(status.TEAPOT, {'Error': 'Payload data was insufficient'});
  }

  requestPayment(obj, (err) => {
    if (err) {
      return callback(status.INTERNAL_SERVER_ERROR,
          {'Error': 'Could not send payment'});
    }

    // storing payed cart as order
    storeOrder(data);

    requestMail(data, obj, (err) => {
      if (err) {
        return callback(status.INTERNAL_SERVER_ERROR,
            {'Error': 'Could not send mail'});
      }

      callback(status.OK);
    });
  });
};

// export cart object
module.exports = pay;
