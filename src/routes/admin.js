const express = require('express');
const permit = require('../middleware/authorization');

const router = express.Router();

const adminContoller = require('../controllers/admin');

// creating an admin in the database needs to be handled as we won't have endpoints to create admins
router.get('/fetchCustomers', permit('admin'), adminContoller.fetchCustomers);

router.get('/fetchChefs', permit('admin'), adminContoller.fetchChefs);

router.get('/fetchAdmins', permit('admin'), adminContoller.fetchAdmins);

router.get('/fetchAll', permit('admin'), adminContoller.fetchAll);

router.delete('/delete/:id', permit('admin'), adminContoller.deleteUser);

module.exports = router;
