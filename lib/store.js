/**
 * Store lib
 */

// dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// store object to be exported
const store = {};

// base directory for store
const baseDir = path.join(__dirname, '/../.store/');

/**
 * Store callback `storeCallback`
 * @callback storeCallback
 * @param {string|boolean} err Error message or false
 * @param {object} data Javascript object data converted from JSON or underfined
 */

/**
 * Method to created file in store
 * @param {string} dir Directory/Collection name
 * @param {string} file File name / Object Id
 * @param {object} data Javascript object to be converted to JSON and stored
 * @param {storeCallback} callback Callback function
 */
store.create = (dir, file, data, callback) => {
  fs.open(`${baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (err || !fileDescriptor) {
      return callback('Could not create new file, it might already exist!');
    }

    const stringData = JSON.stringify(data);

    fs.writeFile(fileDescriptor, stringData, (err) => {
      if (err) {
        return callback('Error writing to new file');
      }

      fs.close(fileDescriptor, (err) => {
        if (err) {
          return callback('Error closing to new file');
        }

        callback(false);
      });
    });
  });
};

/**
 * Method to read file in store, convert it to readable object and callback
 * @param {string} dir Directory/Collection name
 * @param {string} file File name / Object Id
 * @param {storeCallback} callback Callback function
 */
store.read = (dir, file, callback) => {
  fs.readFile(`${baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }

    helpers.parseJSON(data, (err, obj) => {
      if (err) {
        return callback(err);
      }

      callback(err, obj);
    });
  });
};

/**
 * Method to read files in store and convert it to readable array of objects
 * @param {string} dir Directory/Collection name
 * @param {storeCallback} callback Callback function
 */
store.list = (dir, callback) => {
  const currentDir = `${baseDir}${dir}/`;

  const read = (file, readCallback) => {
    fs.readFile(`${currentDir}${file}`, 'utf8', (err, data) => {
      if (err) {
        return readCallback(err);
      }

      helpers.parseJSON(data, (err, obj) => {
        if (err) {
          return readCallback(err);
        }

        readCallback(err, obj);
      });
    });
  };

  fs.readdir(currentDir, 'utf8', (err, files) => {
    const objs = [];
    let processed = 0;

    for (let i = 0; i < files.length; i++) {
      read(files[i], (err, obj) => {
        if (!err && obj) {
          objs.push(obj);
        }

        if (files.length == ++processed) {
          return callback(false, objs);
        }
      });
    }
  });
};

/**
 * Method to update file in store
 * @param {string} dir Directory/Collection name
 * @param {string} file File name / Object Id
 * @param {object} data Javascript object to be converted to JSON and updated
 * @param {storeCallback} callback Callback function
 */
store.update = (dir, file, data, callback) => {
  fs.open(`${baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (err || !fileDescriptor) {
      return callback('Could not open the file ' +
          'for updating, it may not exist yet!');
    }

    const stringData = JSON.stringify(data);

    fs.truncate(fileDescriptor, (err) => {
      if (err) {
        return callback('Error truncating file');
      }

      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (err) {
          return callback('Error writing to existing file');
        }

        fs.close(fileDescriptor, (err) => {
          if (err) {
            return callback('Error closing the file');
          }

          callback(false);
        });
      });
    });
  });
};

/**
 * Method to delete file in store
 * @param {string} dir Directory/Collection name
 * @param {string} file File name / Object Id
 * @param {storeCallback} callback Callback function
 */
store.delete = (dir, file, callback) => {
  fs.unlink(`${baseDir}${dir}/${file}.json`, (err) => {
    if (err) {
      return callback('Error deleting file');
    }

    callback(false);
  });
};

// export store
module.exports = store;
