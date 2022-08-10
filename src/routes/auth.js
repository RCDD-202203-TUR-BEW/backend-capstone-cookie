const express = require('express');
const authControllers = require('../controllers/auth');

const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/signin', authControllers.signin);
router.get('/signout', authControllers.signout);
router.get('/fetchall', authControllers.fetchAll);

module.exports = router;
