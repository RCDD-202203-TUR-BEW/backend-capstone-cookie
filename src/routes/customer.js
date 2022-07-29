const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer');

router.get('/', customerController);
router.get('/profile', customerController); //profile
// router.post("/", customerController);
router.post('/signup', customerController);
router.post('/login', customerController);
router.get('/orders', customerController);
router.get('/rate', customerController); // rated dishes
router.get('/rate/:id', customerController); // rated a single dish
router.put('/profile', customerController); // update profile - or it cuts off the rest of the routes

router.put('/orders', customerController); // update orders

router.delete('/deleteorder', customerController); // delete order
router.delete('/deleteaddress', customerController); // delete address

router.delete('/deleteAccount', customerController); // delete account
router.get('/chefs', chefController); // all chefs"
router.get('/chefs/:username', chefController); // all chefs"
router.get('/dishes/dishId', chefController); // dish by id
router.get('/dishes/filter', chefController); // filter dishes
module.exports = router;
