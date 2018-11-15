/**
 * List view controller
 */

// dependencies
const status = require('../keys').http.status;
const mimeType = require('../keys').media.mimeType;
const helpers = require('../helpers');

// list view controller to be exported
const handler = (data, callback) => {
  const component = {
    view: 'list',
    data: {}
  };

  helpers.compile(component, (err, compiledTemplate) => {
    if (err) {
      return callback(status.INTERNAL_SERVER_ERROR);
    }

    callback(status.OK, compiledTemplate, mimeType.HTML);
  });
};

// export controller
module.exports = handler;
