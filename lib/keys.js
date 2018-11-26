module.exports = {
  collection: {
    CARTS: 'carts',
    PRODUCTS: 'products',
    USERS: 'users',
    ORDERS: 'orders'
  },
  http: {
    status: {
      OK: 200,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      NOT_FOUND: 404,
      METHOD_NOT_ALLOWED: 405,
      TEAPOT: 418,
      INTERNAL_SERVER_ERROR: 500
    }
  },
  media: {
    mimeType: {
      JSON: 'application/json',
      HTML: 'text/html',
      CSS: 'text/css',
      JS: 'text/javascript',
      PNG: 'image/png',
      JPG: 'image/jpg',
      PLAIN: 'text/plain'
    }
  }
};
