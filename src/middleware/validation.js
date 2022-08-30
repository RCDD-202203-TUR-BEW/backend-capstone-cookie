const { check, validationResult } = require('express-validator');

const usernameValidator = check('username')
  .trim()
  .notEmpty()
  .withMessage('Username should not be empty')
  .matches(/^\S+$/)
  .withMessage('Username should not include spaces')
  .isAlphanumeric()
  .withMessage('Username must be alphanumeric')
  .isLength({ min: 3, max: 15 })
  .withMessage('Username character length must be in between 3 & 15 character');

const emailValidator = check('email')
  .notEmpty()
  .withMessage('Email should not be empty')
  .isEmail() // Normalize the email address by lowercasing the domain part of it.
  .withMessage('Invalid Email');

const passwordValidator = check('password')
  .notEmpty()
  .withMessage('Password should not be empty')
  .isLength({ min: 8, max: 25 })
  .withMessage('Password length must be in between 8 & 25 character')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  .withMessage('Password must contain a number, uppercase and lowercase');

const phoneValidator = check('phone')
  .notEmpty()
  .withMessage('phone number must be filled')
  .isNumeric()
  .isMobilePhone('tr-TR')
  .withMessage('wrong phone number');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

module.exports = {
  usernameValidator,
  emailValidator,
  passwordValidator,
  phoneValidator,
  handleValidation,
};
