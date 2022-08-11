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

// app.use('/api', router);
// app.use(orderRoutes);

app.listen(port, () => {
  //  console.log(`Server listening on port ${port}`);
  // connectToMongo();
});

module.exports = app;
