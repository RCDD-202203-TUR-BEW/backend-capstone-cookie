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

  const isExisted = async (property, value) => {
    const existedProperty = await Users.find({}).where(property).equals(value);
    if (existedProperty.length !== 0) return true;
    return false;
  };

  const response = (property, value) =>
    res.status(400).json({ error: `${property} (${value}) already exists!` });

  if (await isExisted('username', username))
    return response('username', username);
  if (await isExisted('email', email)) return response('email', email);
  if (await isExisted('phone', phone)) return response('phone', phone);

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

authControllers.signout = (req, res) => {
  // logic will be implemented after applying authentication
  res.redirect('/');
};

module.exports = authControllers;
