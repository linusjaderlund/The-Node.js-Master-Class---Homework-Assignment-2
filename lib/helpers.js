/**
 * Lib of various helpers
 */

// dependencies
const crypto = require('crypto');
const is = require('./is');
const val = require('./val');
const config = require('./config');
const fs = require('fs');
const path = require('path');

// helpers object to be exported
const helpers = {};

/**
 * Method for helping converting string to JSON.
 * Catching any error thrown to prevent program to terminate
 * @param {string} str JSON string data
 * @param {Function} callback Callback with possible error and converted object
 */
helpers.parseJSON = (str, callback) => {
  try {
    const json = JSON.parse(str);
    callback(false, json);
  } catch (err) {
    callback(`Error occurred while trying to parse string to JSON: ${err}`);
  }
};

/**
 * Method for hashing string, useful for handling passwords
 * @param {string} str String to be hashed
 * @return {string} Returns hashed string
 */
helpers.hash = (str) => {
  return (is.notString(str) || is.stringAndEmpty(str)) ? false : crypto
      .createHmac('sha256', config.crypto.secret)
      .update(str)
      .digest('base64')
      // transforming to URL safe
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/**
 * Method for converting string to base64
 * @param {string} str String to be converted
 * @return {string} Returns base64 string
 */
helpers.stringToBase64 = (str) => {
  return (is.notString(str) || is.stringAndEmpty(str)) ? false :
    Buffer.from(str).toString('base64')
        // transforming to URL safe
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/**
 * Method for converting object to base64
 * @param {object} obj Object to be converted
 * @return {string} Returns base64 string
 */
helpers.objectToBase64 = (obj) => {
  return is.notObject(obj) ? false :
    helpers.stringToBase64(JSON.stringify(obj));
};

/**
 * Method for converting object to base64
 * @param {string} base64Str base64 string to be converted
 * @param {Function} callback Callback with possible error and converted object
 */
helpers.base64ToObject = (base64Str, callback) => {
  const str = Buffer.from(base64Str, 'base64').toString('utf8');
  helpers.parseJSON(str, callback);
};

/**
 * Method for creating JWT token
 * @param {object} tokenPayload Object representing token payload
 * @return {string} Returns base64 JWT token
 */
helpers.createJWT = (tokenPayload) => {
  if (is.notObject(tokenPayload)) {
    return false;
  }

  if (!tokenPayload.exp) {
    tokenPayload.exp = Date.now() + (1000 * 60 * 60);
  }

  const header = helpers.objectToBase64({
    typ: 'JWT',
    alg: 'HS256'
  });
  const payload = helpers.objectToBase64(tokenPayload);
  const signature = helpers.hash(`${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
};

/**
 * Method for creating JWT token
 * @param {object} token String passed from request header
 * @param {Function} callback Callback with possible error and JWT payload
 * @return {undefined}
 */
helpers.verifyJWT = (token, callback) => {
  const tokenParts = is.stringAndNotEmpty(token) ? token.split('.') : false;

  if (!tokenParts || tokenParts.length < 3) {
    return callback('Error: Could not break apart token');
  }

  const [header, payload, signature] = tokenParts;

  if (helpers.hash(`${header}.${payload}`) !== signature) {
    return callback('Error: Wrong signature, possible attack!');
  }

  helpers.base64ToObject(payload, (err, tokenPayload) => {
    if (err) {
      return callback(err);
    }

    if (!tokenPayload.exp || tokenPayload.exp < Date.now()) {
      return callback('Error: Token expiration is missing or token expired');
    }

    callback(false, tokenPayload);
  });
};

/**
 * Method for creating random number between given min and max
 * @param {number} min Min random number
 * @param {number} max Max random number
 * @return {string} Returns random number
 */
helpers.randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Method for creating random string of a given length
 * @param {number} length String length
 * @return {string} Returns random string
 */
helpers.randomString = (length) => {
  if (is.notNumber(length) || length <= 0) {
    return false;
  }

  const chars =
    'abcdefghijklmnopqrstuvwxyz' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    '0123456789';
  let str = '';

  for (let i = 0; i < length; i++) {
    str += chars.charAt(helpers.randomNumber(0, chars.length));
  }

  return str;
};

// render component data in template
helpers.render = (data, template) => {
  data = val.def(data, is.object, {});
  const keys = Object.keys(data);

  for (const key of keys) {
    template = template.replace(`{${key}}`, data[key]);
  }

  return template;
};

// get component files
helpers.getComponentFiles = (component, callback) => {
  const baseDir = config.client.dir.views;
  const componentFileExtensions = ['html', 'css', 'js'];
  const totalFiles = componentFileExtensions.length;
  const componentFiles = {};
  let loaded = 0;

  for (const fileExtension of componentFileExtensions) {
    fs.readFile(
        `${baseDir}/${component.view}/${component.view}.${fileExtension}`,
        'utf8',
        (err, fileString) => {
          if (!err && fileString) {
            componentFiles[fileExtension] = fileExtension === 'html' ?
                helpers.render(component.data, fileString) : fileString;
          }

          if (totalFiles === ++loaded) {
            callback(false, componentFiles);
          }
        }
    );
  }
};

helpers.getPublicResources = (resources, callback) => {
  resources.libs = resources.libs || [];
  resources.styles = resources.styles || [];

  if (!resources.libs.length && !resources.styles.length) {
    return callback(false, '');
  }

  const libsBaseDir = config.client.dir.libs;
  const stylesBaseDir = config.client.dir.styles;
  const libs = new Array(resources.libs.length);
  const styles = new Array(resources.styles.length);
  const totalFiles = resources.libs.length + resources.styles.length;
  let loaded = 0;

  for (let i = 0; i < resources.libs.length; i++) {
    const file = resources.libs[i];
    fs.readFile(`${libsBaseDir}/${file}.js`, 'utf8', (err, data) => {
      if (!err && data) {
        libs[i] = data;
      }

      if (totalFiles === ++loaded) {
        callback(false, {
          libs: libs.join('\n\n'),
          styles: styles.join('\n\n')
        });
      }
    });
  }

  for (let i = 0; i < resources.styles.length; i++) {
    const file = resources.styles[i];
    fs.readFile(`${stylesBaseDir}/${file}.css`, 'utf8', (err, data) => {
      if (!err && data) {
        styles[i] = data;
      }

      if (totalFiles === ++loaded) {
        callback(false, {
          libs: libs.join('\n\n'),
          styles: styles.join('\n\n')
        });
      }
    });
  }
};

// compile template
helpers.compile = (component, callback) => {
  const resources = config.client.resources;
  const masterComponent = {
    view: 'master',
    data: {
      title: 'Pizza Guy! - You order, we deliver~'
    }
  };

  // getting client lib scripts
  helpers.getPublicResources(resources, (err, publicResources) => {
    // getting master component
    helpers.getComponentFiles(masterComponent, (err, masterComponentFiles) => {
      // getting child component
      helpers.getComponentFiles(component, (err, componentFiles) => {
        const htmlTemplate = masterComponentFiles.html
            .replace('{view:child}', componentFiles.html)
            .replace('\{view:script\}',
                `<script type="text/javascript">
                  ${publicResources.libs}
                  ${masterComponentFiles.js || ''}
                  ${componentFiles.js || ''}
                </script>`)
            .replace('\{view:style\}',
                `<style>
                  ${publicResources.styles}
                  ${masterComponentFiles.css || ''}
                  ${componentFiles.css || ''}
                </style>`);

        callback(false, htmlTemplate);
      });
    });
  });
};

// export helpers
module.exports = helpers;
