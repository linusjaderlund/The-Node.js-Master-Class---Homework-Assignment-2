(function(app) {
  const key = 'pizza-guy-token';
  let token = '';

  const getToken = () => token;

  const setToken = (newToken) => {
    token = newToken;
    window.sessionStorage.setItem(key, token);
  };

  const updateToken = () => {
    // xhr module will grab token if it exist
    console.log('[JWT] updating token...');
    app.xhr('put', 'api/token', {extend: true}, (status, data) => {
      setToken(status === 200 ? data : '');
      console.log('[JWT] new token:', getToken());
    });
  };

  const init = () => {
    token = window.sessionStorage.getItem(key) || '';

    // check if token is still valid
    if (token) {
      console.log('[JWT] session token:', token);
      updateToken();
    }
  };

  app.token = {};
  app.token.get = getToken;
  app.token.set = setToken;
  app.token.update = updateToken;

  init();
}(window.app = window.app || {}));
