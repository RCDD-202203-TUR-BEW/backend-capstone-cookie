const express = require('express');

const router = express.Router();

const adminContoller = require('../controllers/admin');

router.get('/fetchCustomers', adminContoller.fetchCustomers);

router.get('/fetchChefs', adminContoller.fetchChefs);

router.get('/fetchAdmins', adminContoller.fetchAdmins);

router.get('/fetchAll', adminContoller.fetchAll);

router.delete('/delete/:id', adminContoller.deleteUser);

module.exports = router;
