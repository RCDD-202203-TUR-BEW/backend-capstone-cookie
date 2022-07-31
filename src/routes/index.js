const express = require('express');

const routes = express.Router();

const adminRoutes = require('./admin');
//  You will add routes here

routes.use('/admin', adminRoutes);

module.exports = routes;
