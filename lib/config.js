/**
 * Dynamic configuration depending on NODE_ENV variable
 */

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
    }
  }
};

module.exports = config[process.env.NODE_ENV] ?
    config[process.env.NODE_ENV] : config.dev;
