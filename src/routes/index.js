const express = require('express');

const router = express.Router();

const adminRoutes = require('./admin');

router.use('/admin', adminRoutes);

module.exports = router;

