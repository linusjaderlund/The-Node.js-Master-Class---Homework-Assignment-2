(function(app) {
  const key = 'pizza-guy-token';
  const subs = [];
  let token = '';

  const getToken = () => token;

  const setToken = (newToken) => {
    token = newToken;
    window.sessionStorage.setItem(key, token);
    publish();
  };

  const subscribe = (sub) => {
    if (typeof(sub) === 'function') {
      subs.push(sub);
      // direct callback
      sub(token);
    }
  };

  const publish = () => {
    for (const sub of subs) {
      sub(token);
    }
  };

  const redirectLogin = () => {
    if (window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1) !== 'login') {
      window.location.replace('login');
    }
  };

  const updateToken = () => {
    // xhr module will grab token if it exist
    console.log('[JWT] updating token...');
    app.xhr('put', 'api/token', {extend: true}, (status, data) => {
      if (status === 200) {
        setToken(data);
        console.log('[JWT] new token:', data);
        return;
      }

      setToken('');
      redirectLogin();
    });
  };

  const init = () => {
    token = window.sessionStorage.getItem(key) || '';

    // check if token is still valid
    if (token) {
      console.log('[JWT] session token:', token);
      updateToken();
      return;
    }

    redirectLogin();
  };

  app.token = {};
  app.token.get = getToken;
  app.token.set = setToken;
  app.token.update = updateToken;
  app.token.subscribe = subscribe;
  app.token.redirect = redirectLogin;

  init();
}(window.app = window.app || {}));
