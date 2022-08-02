const express = require('express');
require('dotenv').config();
const connectToMongo = require('./db/connection');

const router = require('./routes');
const orderRoutes = require('./routes/order');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(connectToMongo);

// USING ENDPOINTS
app.use(router);

app.use(orderRoutes);

app.listen(port, () => {
  //    console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
