const bcrypt = require('bcrypt');
const Users = require('../models/user');

const authControllers = {};

authControllers.signup = async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    confirmPassword,
    phone,
    birthday,
    gender,
    acceptTos,
  } = req.body;

  const existedUser = await Users.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    return res.status(400).json({
      error: `${
        username ? `username: ${username}` : `email: ${email}`
      } already existed!`,
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match" });
  }
  if (!acceptTos) {
    return res
      .status(400)
      .json({ error: 'You need to accept terms of service' });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await Users.create({
    firstname,
    lastname,
    username,
    email,
    password_hash: hashedPassword,
    phone,
    birthday,
    gender,
  });
  return res.redirect('/');
};

authControllers.signin = async (req, res) => {
  const { username, email, password } = req.body;
  const errorMessage = `invalid ${username ? 'username' : 'email'} or password`;
  const existedUser = await Users.findOne({ $or: [{ username }, { email }] });
  if (!existedUser) {
    return res.status(401).json({
      error: errorMessage,
    });
  }
  const hashedPassword = existedUser.password_hash;
  const validPassword = await bcrypt.compare(password, hashedPassword);
  if (!validPassword) {
    return res.status(401).json({ error: errorMessage });
  }

  return res.redirect('/');
};

module.exports = authControllers;
