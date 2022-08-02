const express = require('express');

const routes = express.Router();

const orderRoutes = require('./order');
//  You will add routes here

routes.use(orderRoutes);

module.exports = routes;
