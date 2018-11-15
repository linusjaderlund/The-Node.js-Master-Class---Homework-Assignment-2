(function(app) {
  let lastToken = null;

  const render = (token) => {
    const body = document.getElementsByTagName('body')[0];
    const authorized = 'authorized';
    const unauthorized = 'unauthorized';

    if (token) {
      body.classList.add(authorized);
      body.classList.remove(unauthorized);
      return;
    }

    body.classList.add(unauthorized);
    body.classList.remove(authorized);
  };

  const init = () => {
    const logoutButton = document.getElementsByClassName('js-logout-button')[0];
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      app.token.set('');
      app.token.redirect();
    });
  };

  app.token.subscribe((token) => {
    if (token !== lastToken) {
      lastToken = token;
      render(token);
    }
  });

  init();
}(window.app = window.app || {}));
