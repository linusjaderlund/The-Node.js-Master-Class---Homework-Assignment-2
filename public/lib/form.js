(function(app) {
  const subs = {};

  const publish = (name, form, payload) => {
    if (Array.isArray(subs[name]) && subs[name].length) {
      for (const callback of subs[name]) {
        callback(form, payload);
      }
    }
  };

  const parse = (form, isOutsideCaller) => {
    const payload = {};

    for (const element of form) {
      if (element.tagName === 'INPUT' && element.name) {
        payload[element.name] = element.value;
      }
    }

    if (isOutsideCaller) {
      return payload;
    }

    publish(form.name, form, payload);
  };

  const bind = () => {
    const forms = document.getElementsByTagName('form');

    for (const form of forms) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        // event subscription is based on name
        if (event.target.name) {
          parse(event.target);
        }
      });
    }
  };

  bind();

  // public methods
  app.form = {};
  app.form.parse = (form) => {
    return parse(form, true);
  };

  app.form.subscribe = (name, callback) => {
    subs[name] = subs[name] || [];

    if (typeof(callback) === 'function') {
      subs[name].push(callback);
    }
  };
}(window.app = window.app || {}));
