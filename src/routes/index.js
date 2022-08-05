const express = require('express');

const routes = express.Router();

const adminRoutes = require('./admin');

router.use('/admin', adminRoutes);

module.exports = router;

