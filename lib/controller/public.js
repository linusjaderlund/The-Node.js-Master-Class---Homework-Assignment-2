/**
 * Public resource controller
 */

// dependencies
const path = require('path');
const fs = require('fs');
const status = require('../keys').http.status;
const mimeType = require('../keys').media.mimeType;

// public controller to be exported
const controller = (data, callback) => {
  const mimeTypeMap = {
    '.jpg': mimeType.JPG,
    '.jpeg': mimeType.JPG,
    '.png': mimeType.PNG,
    '.css': mimeType.CSS,
    '.js': mimeType.JS
  };
  const requestedMimeType =
      mimeTypeMap[data.path.substring(data.path.lastIndexOf('.'))];

  if (!requestedMimeType) {
    return callback(status.NOT_FOUND);
  }

  fs.readFile(path.join(__dirname, `../../${data.path}`),
      (err, buffer) => {
        if (err || !buffer) {
          return callback(status.NOT_FOUND);
        }

        callback(status.OK, buffer, requestedMimeType);
      }
  );
};

// exports controller
module.exports = controller;
