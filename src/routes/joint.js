const express = require('express');

const router = express.Router();
const chefController = require('../controllers/chef');
const customerController = require('../controllers/customer');
const authControllers = require('../controllers/auth');
const isAuthenticated = require('../middleware/isAuthenticated');
const thirdPartyUserController = require('../controllers/thirdPartyUser');

// router.post('/auth/signup', authControllers.signup);
// router.post('/auth/login', authControllers.signin);
// router.get('/auth/signout', isAuthenticated, authControllers.signout);

// router.get('/orders', isAuthenticated, customerController); // all orders for customers
// router.get('/orders', isAuthenticated, chefController); // all orders for chefs



module.exports = router;
