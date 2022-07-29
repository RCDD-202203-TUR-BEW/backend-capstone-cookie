const express = require('express');
require('dotenv').config();
const connectToMongo = require('./db/connection');

 const router = require('./routes');
// const customerRoutes = require("./routes/customer");
// const chefRoutes = require("./routes/chef");

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(connectToMongo);

//  app.use('/', router);
// app.use("/api/customer", customerRoutes);
// app.use("/api/chef", chefRoutes);
app.use('/api', router);
app.listen(port, () => {
  //    console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
