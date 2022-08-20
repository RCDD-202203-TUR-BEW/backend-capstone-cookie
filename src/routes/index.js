const express = require('express');

const router = express.Router();

const customerRoutes = require('./customer');
const chefRoutes = require('./chef');
const adminRoutes = require('./admin');
const authRoutes = require('./auth');
const jointRoutes = require('./joint');
// router.get('/customer', customerRoutes); //    /api/customer
// router.get('/chef', chefRoutes); //    /api/chef
// router.get('/admin', adminRoutes); //    /api/admin
router.get('/auth', authRoutes); //    /api/auth'
module.exports = router;
