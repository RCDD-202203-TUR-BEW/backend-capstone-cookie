const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/fetchUser/:id', adminController); // fetch spesific user
router.get('/fetchAllCustomer', adminController); // fetch all customer
router.get('/fetchAllChef', adminController); // fetch all chefs
router.get('/fetchAllUsers', adminController); // fetch all chefs

router.get('/fetchAll', adminController); // fetch all users
router.delete('/delete/:id', adminController); // delete user
module.exports = router;
