const express = require('express');

const router = express.Router();


const customerRoutes = require('./customer');
const chefRoutes = require('./chef');
const adminRoutes = require('./admin');

router.get('/customer', customerRoutes); //    /api/customer
router.get('/chef', chefRoutes); //    /api/chef
router.get('/admin', adminRoutes); //    /api/admin


module.exports = router;

