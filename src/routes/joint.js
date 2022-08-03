const express = require('express');
const router = express.Router();
const chefController = require('../controllers/chef');
const customerController = require('../controllers/customer');


/**
 * router.use((req, res, next) => {
  here we can check if the user is chef or customer then redirect to the correct page
  here we can check if the user is logged in or not and redirect to the correct page

  next()
})
 */
router.post('/signup', customerController);
router.post('/login', customerController);
router.get('/orders', customerController);

router.post('/signup', chefController);
router.post('/login', chefController);
router.get('/orders', chefController); // all orders
module.exports = router;