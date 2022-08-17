const express = require('express');
require('dotenv').config();
const { expressjwt: jwt } = require('express-jwt');
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');

const { UnauthorizedErrorHandler } = require('./middleware/errorHandling');

const connectToMongo = require('./db/connection');

const apiRoutes = require('./routes');
const orderRoutes = require('./routes/order');

const customerRoutes = require('./routes/customer');
//const chefRoutes = require('./routes/chef');
const jointRoutes = require('./routes/joint');

const authRoutes = require('./routes/auth');
//const passportSetup = require('./services/passport-setup');
const passport = require('passport');
const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));
app.use(passport.initialize());
const path = [
  '/api/auth/signup',
  '/api/auth/signin',
  '/api/chefs',
  '/api/chefs/:username',
  '/api/dishes',
  '/api/dishes/:dishId',
  '/api/dishes/filter',
  '/api/auth/google',
  '/api/auth/google/redirect',
  'http://localhost:3000/auth/google/redirect',
  '/api/customer/fillprofile',
  '/api/customer/fillprofile/:id',
];

app.use(
  '/api',
  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    requestProperty: 'auth', // This ensures that decoded token details will be available on req.auth else req.user is the default.
    getToken: (req) =>
      req.signedCookies.token ?? req.cookies.token ?? req.cookies['_t'],
  }).unless({
    path,
  })
);

app.use('/api', apiRoutes);
app.use('/api/customer', customerRoutes);
//app.use('/api/chef', chefRoutes);
app.use('/api/auth', authRoutes);
//the joint route is for the joint owner to view the orders
app.use('/api/joint', jointRoutes);
app.use(orderRoutes);

//app.use(UnauthorizedErrorHandler);
app.use(cookieParser(process.env.SECRET_KEY));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
