const express = require('express');

const router = express.Router();

const adminContoller = require('../controllers/admin');

router.get('/fetch-customers', adminContoller.fetchCustomers);
router.get('/fetch-chefs', adminContoller.fetchChefs);
router.get('/fetch-admins', adminContoller.fetchAdmins);
router.get('/fetch-all', adminContoller.fetchAll);

router.delete('/delete/:id', adminContoller.deleteUser);

module.exports = router;
