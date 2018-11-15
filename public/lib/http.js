(function(app) {
  const request = (method, url, payload, callback) => {
    const xhr = new XMLHttpRequest();
    const token = app.token.get();
    xhr.open(method.toUpperCase(), url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';

    // handle token
    if (token) {
      xhr.setRequestHeader('token', token);
      console.log('[XHR] sending request with token...');
    }

    xhr.onload = () => {
      if (typeof(callback) === 'function') {
        callback(xhr.status, xhr.response);
      }
    };

    if (payload) {
      xhr.send(JSON.stringify(payload));
      return;
    }

    xhr.send();
  };

  // public methods
  app.xhr = request;
}(window.app = window.app || {}));
