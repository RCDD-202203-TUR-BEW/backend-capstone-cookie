const express = require('express');

const router = express.Router();

const adminRoutes = require('./admin');
//  You will add routes here

router.use('/admin', adminRoutes);

module.exports = router;
