const express = require('express');
require('dotenv').config();
const connectToMongo = require('./db/connection');

const apiRoutes = require('./routes');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(connectToMongo);

app.use('/api', apiRoutes);

app.listen(port, () => {
  //    console.log(s`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
