/**
 * Payment API lib
 */

// dependencies
const https = require('https');
const querystring = require('querystring');
const is = require('../is');
const val = require('../val');
const keys = require('../keys');

// config
const status = keys.http.status;

// cart api object to be exported
const pay = {};

/**
 * Pay post method for requesting payment to external service
 * @param {object} data Parsed data from request
 * @param {handlerCallback} callback Callback function
 * @return {undefined}
 */
pay.post = (data, callback) => {
  const obj = {
    amount: val.def(data.payload.amount, is.number, false)
  };

  if (is.objectWithFalseValues(obj)) {
    return callback(status.TEAPOT, {'Error': 'Payload data was insufficient'});
  }

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
      callback(status.INTERNAL_SERVER_ERROR, err);
    });
  });

  req.on('error', (err) => {
    callback(status.INTERNAL_SERVER_ERROR, err);
  });

  req.write(postData);
  req.end(() => {
    callback(status.OK);
  });
};

// export cart object
module.exports = pay;
