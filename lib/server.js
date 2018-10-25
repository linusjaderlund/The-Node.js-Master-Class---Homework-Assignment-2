/**
 * Server module
 */

// dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./helpers');
const is = require('./is');
const val = require('./val');
const router = require('./router');
const handlers = require('./handlers');

// config
const port = 3000;

/**
 * Parse payload callback `parsePayloadCallback`
 * @callback parsePayloadCallback
 * @param {any} err Error information if there was an error else false
 * @param {object} payload Javascript object parsed from JSON
 */

/**
 * Private function that waits for buffer to be recived and then
 * parses it before calling back the result
 * @param {object} req Node.js request object
 * @param {parsePayloadCallback} callback Callback function
 */
const parsePayload = (req, callback) => {
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (chunk) => {
    buffer += decoder.write(chunk);
  });

  req.on('end', () => {
    buffer += decoder.end();

    if (!buffer) {
      return callback(false, {});
    }

    helpers.parseJSON(buffer, (err, payload) => {
      if (err) {
        return callback(err);
      }

      callback(false, payload);
    });
  });
};

/**
 * Private function handling response from server
 * @param {object} res Node.js response object
 * @param {number} statusCode HTTP status code
 * @param {object} payload Javascript object parsed from JSON
 */
const handleResponse = (res, statusCode, payload) => {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(val.def(statusCode, is.number, 200));
  res.end(
      JSON.stringify(
          val.def(payload, is.objectOrArray, {})));
};

/**
 * Private function handling incoming server requests
 * @param {object} req Node.js request object
 * @param {object} res Node.js response object
 */
const handleRequest = (req, res) => {
  parsePayload(req, (err, payload) => {
    const parsedUrl = url.parse(req.url, true);

    const data = {
      path: parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
      query: parsedUrl.query,
      method: req.method.toLowerCase(),
      headers: req.headers,
      payload: payload
    };

    // handle error if one occured during parsing else
    // look for valid route handler
    const handler = err ? handlers.invalidPayload : (
      router[data.path] ? router[data.path] : handlers.notFound
    );

    handler(data, (statusCode, payload) => {
      handleResponse(res, statusCode, payload);
    });
  });
};

// server object to be exported
const server = {};

/**
 * Public method that initializes the server and starts
 * listening for RESTful API requests
 */
server.init = () => {
  http.createServer(handleRequest)
      .listen(port, () => {
        console.log('\x1b[32m%s\x1b[0m',
            `RESTful API server is running on port ${port}`);
      });
};

// export server
module.exports = server;
