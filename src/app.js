const express = require('express');
require('dotenv').config();
const { expressjwt: jwt } = require('express-jwt');
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
const swaggerUi = require('swagger-ui-express');
const { UnauthorizedErrorHandler } = require('./middleware/errorHandling');
const swaggerDocument = require('./swagger.json');
const connectToMongo = require('./db/connection');

const apiRoutes = require('./routes');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

require('./services/passport-setup');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

const path = [
  '/api/auth/chef/signup',
  '/api/auth/customer/signup',
  '/api/auth/signin',
  '/api/chefs',
  '/api/chefs/nearby-chefs',
  /^\/api\/chefs\/(?:([^/]+?))\/?$/i, // equals to /api/chefs/:username
  '/api/dishes',
  '/api/dishes/filter',
  /^\/api\/dishes\/(?!nearby-dishes).*/, // (this is equivalent to "/api/chefs/dishes/:dishId")  because unless method doesn't accept express' :param path arguments syntax, but it does accept a regex
  // excluding "/nearby-dishes" as it needs authentication to know the user location first
  /^\/api\/dishes\/chef\/.*/,
  '/api/auth/google/customer',
  '/api/auth/google/customer/redirect',
  '/api/auth/google/chef',
  '/api/auth/google/chef/redirect',
];

app.use(
  '/api',
  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    requestProperty: 'user',
    getToken: (req) => req.signedCookies.token ?? req.cookies.token,
  }).unless({
    path,
  })
);

app.use('/api', apiRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(UnauthorizedErrorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    connectToMongo();
  });
}

module.exports = app;
