(function(app) {
  const request = (method, url, payload, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
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
