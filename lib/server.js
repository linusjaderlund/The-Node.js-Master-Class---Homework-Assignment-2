/**
 * Server module
 */

// dependencies
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./helpers');
const is = require('./is');
const val = require('./val');
const router = require('./router');
const handlers = require('./handlers');
const config = require('./config');
const status = require('./keys').http.status;
const media = require('./keys').media;

// https server options
const httpsOptions = {
  key: fs.readFileSync('./.https/key.pem'),
  cert: fs.readFileSync('./.https/cert.pem'),
};

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
 * @param {string} mimeType Javascript object parsed from JSON
 */
const handleResponse = (res, statusCode, payload, mimeType) => {
  const payloadString = mimeType === media.mimeType.JSON ?
      JSON.stringify(val.def(payload, is.defined, {})) :
      val.def(payload, is.defined, '');

  // defaulting
  mimeType = mimeType || media.mimeType.JSON;

  res.setHeader('Content-Type', mimeType);
  res.writeHead(val.def(statusCode, is.number, 200));
  res.end(payloadString);
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

    handler(data, (statusCode, payload, mimeType) => {
      handleResponse(res, statusCode, payload, mimeType);
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
  // starting HTTP server
  http.createServer((req, res) => {
    handleResponse(res, status.BAD_REQUEST,
        {'Error': 'HTTP Protocol not supported, please use HTTPS instead'});
  })
      .listen(config.http.port, () => {
        console.log('\x1b[32m%s\x1b[0m',
            `RESTful http API server is running on port ` +
            `${config.http.port} in ${config.environment} mode`);
      });

  // starting HTTPS server
  https.createServer(httpsOptions, handleRequest)
      .listen(config.https.port, () => {
        console.log('\x1b[32m%s\x1b[0m',
            `RESTful https API server is running on port ` +
            `${config.https.port} in ${config.environment} mode`);
      });
};

// export server
module.exports = server;
