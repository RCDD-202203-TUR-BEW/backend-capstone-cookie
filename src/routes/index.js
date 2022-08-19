const express = require('express');

const router = express.Router();

const authRoutes = require('./auth');
const customerRoutes = require('./customer');
const dishRoutes = require('./dish');
const chefRoutes = require('./chef');
const adminRoutes = require('./admin');
const orderRoutes = require('./order');
const userRoutes = require('./user');


router.use('/auth', authRoutes);
router.use('/customer', customerRoutes); //    /api/customer
router.use('/dishes', dishRoutes);
router.use('/chefs', chefRoutes); //    /api/chefs
router.use('/admin', adminRoutes); //    /api/admin
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

module.exports = router;
