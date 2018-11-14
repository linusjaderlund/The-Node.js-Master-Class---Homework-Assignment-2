/**
 * Dynamic configuration depending on NODE_ENV variable
 */

// dependencies
const path = require('path');

const config = {
  dev: {
    environment: 'development',
    http: {
      port: 3000
    },
    https: {
      port: 4000
    },
    crypto: {
      secret: 'eTm&W(Y3?jsD|7bYUN$]lt;U[-UT(a'
    },
    client: {
      dir: {
        views: path.join(__dirname, '../views'),
        libs: path.join(__dirname, '../public/lib'),
        styles: path.join(__dirname, '../public/style')
      },
      resources: {
        libs: ['http', 'form'],
        styles: ['reset', 'main']
      }
    }
  },
  prod: {
    environment: 'production',
    http: {
      port: 80
    },
    https: {
      port: 443
    },
    crypto: {
      secret: 'eXm&A(Y1?jsY|7cBAN$]lt;U[-XAS|tta'
    },
    client: {
      dir: {
        views: path.join(__dirname, '../views'),
        libs: path.join(__dirname, '../public/lib'),
        styles: path.join(__dirname, '../public/style')
      },
      resources: {
        libs: ['http', 'form'],
        styles: ['reset', 'main']
      }
    }
  }
};

module.exports = config[process.env.NODE_ENV] ?
    config[process.env.NODE_ENV] : config.dev;
