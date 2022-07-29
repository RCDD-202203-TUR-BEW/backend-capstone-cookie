const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/admin/fetchUser', adminController); // fetch spesific user
router.get('/admin/fetchAllCustomer', adminController); // fetch all customer
router.get('/admin/fetchAllChef', adminController); // fetch all chefs

router.get('/admin/fetchAll', adminController); // fetch all users
router.delete('/admin/delete', adminController); // delete user
module.exports = router;
