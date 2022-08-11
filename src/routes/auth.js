const express = require('express');
const authControllers = require('../controllers/auth');
const {
  usernameValidator,
  emailValidator,
  passwordValidator,
  phoneValidator,
  handleValidation,
} = require('../middleware/validation');

const router = express.Router();

router.post(
  '/customer/signup',
  usernameValidator,
  emailValidator,
  passwordValidator,
  phoneValidator,
  handleValidation,
  authControllers.signup
);
router.post(
  '/chef/signup',
  usernameValidator,
  emailValidator,
  passwordValidator,
  phoneValidator,
  handleValidation,
  authControllers.signup
);

router.post('/signin', authControllers.signin);
router.get('/signout', authControllers.signout);

module.exports = router;
