const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/admin/fetchUser', adminController);
router.delete('/admin/delete', adminController);

module.exports = router;
