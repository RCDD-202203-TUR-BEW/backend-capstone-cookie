const express = require('express');
require('dotenv').config();
const { expressjwt: jwt } = require('express-jwt');
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');

const { UnauthorizedErrorHandler } = require('./middleware/errorHandling');

const connectToMongo = require('./db/connection');

const apiRoutes = require('./routes');
const orderRoutes = require('./routes/order');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

const path = [
  '/api/auth/signup',
  '/api/auth/signin',
  '/api/chefs',
  '/api/chefs/:username',
  '/api/dishes',
  '/api/dishes/:dishId',
  '/api/dishes/filter',
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
app.use(orderRoutes);

app.use(UnauthorizedErrorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
