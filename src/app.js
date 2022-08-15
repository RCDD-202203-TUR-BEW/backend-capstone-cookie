const express = require('express');
require('dotenv').config();
// const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectToMongo = require('./db/connection');
const router = require('./routes');
const orderRoutes = require('./routes/order');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(connectToMongo);


app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

const path = [
  '/api/auth/chef/signup',
  '/api/auth/customer/signup',
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

app.use('/api', router);
app.use(orderRoutes);

app.use(UnauthorizedErrorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    connectToMongo();
  });
}


module.exports = app;
