(function(app) {
  const login = (form, payload) => {
    app.xhr(form.method, form.action, payload, (status, data) => {
      if (status === 200) {
        app.token.set(data);
        app.token.keepAlive();
        window.location.href = '/';
        return;
      }

      app.token.set('');
    });
  };

  const create = (form, payload) => {
    app.xhr(form.method, form.action, payload, (status) => {
      if (status === 200) {
        login(
            {method: 'post', action: 'api/token'},
            {mail: payload.mail, password: payload.password}
        );
      }
    });
  };

  app.form.subscribe('login', login);
  app.form.subscribe('create', create);
}(window.app = window.app || {}));
