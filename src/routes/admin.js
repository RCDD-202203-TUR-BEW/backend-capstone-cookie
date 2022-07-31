const express = require('express');

const routes = express.Router();

const adminContoller = require('../controllers/admin');

routes.get('/fetch-customers', adminContoller.fetchCustomers);
routes.get('/fetch-chefs', adminContoller.fetchChefs);
routes.get('/fetch-admins', adminContoller.fetchAdmins);
routes.get('/fetch-all', adminContoller.fetchAll);

routes.delete('/delete/:id', adminContoller.deleteUser);

module.exports = routes;
