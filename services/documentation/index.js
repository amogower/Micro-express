const express = require('express');
const winston = require('winston');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const port = 3500;

const externalHost = process.env.EXTERNAL_HOST || 'http://localhost';
const externalPort = process.env.EXTERNAL_PORT || 9898;

/**
 * Configure winston
 */
winston.add(new winston.transports.Console({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
}));

/**
 * Disable the "try it out" button in swagger
 */
const DisableTryItOutPlugin = () => ({
  statePlugins: {
    spec: {
      wrapSelectors: {
        allowTryItOutFor: () => () => false,
      },
    },
  },
});

/**
 * Swagger options
 */
const options = {
  explorer: true,
  swaggerOptions: {
    plugins: [
      DisableTryItOutPlugin,
    ],
    urls: [
      {
        url: `${externalHost}:${externalPort}/article-swagger.json`,
        name: 'Article',
      },
      {
        url: `${externalHost}:${externalPort}/cart-swagger.json`,
        name: 'Cart',
      },
      {
        url: `${externalHost}:${externalPort}/auth-swagger.json`,
        name: 'Auth',
      },
      {
        url: `${externalHost}:${externalPort}/user-swagger.json`,
        name: 'User',
      },
    ],
  },
  customCss: '.swagger-ui .topbar .link { display: none }',
};

/**
 * Swagger documentation
 */
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(null, options));

/**
 * Expose swagger static files
 */
app.use(express.static('swagger'));

/**
 * Start the server
 */
app.listen(port, () => {
  winston.info(`Server is running on: http://localhost:${port}`);
});
