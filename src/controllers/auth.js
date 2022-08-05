const bcrypt = require('bcrypt');
const Users = require('../models/user');

const authControllers = {};

authControllers.signup = async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    email,
    role,
    password,
    confirmPassword,
    phone,
    birthday,
    gender,
    acceptTos,
  } = req.body;

  const isExisted = async (fieldName, value) => {
    const existedProperty = await Users.find({}).where(fieldName).equals(value);
    if (existedProperty.length !== 0) return true;
    return false;
  };

  const response = (fieldName, value) =>
    res.status(400).json({ error: `${fieldName} (${value}) already exists!` });

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
    role,
    password_hash: hashedPassword,
    phone,
    birthday,
    gender,
  });

  // checking the role to render the appropriate page for the user after signing up

  if (role === 'chef')
    return res.json({ message: 'new chef signed up successfully' });

  return res.json({ message: 'new customer signed up successfully' });
};

authControllers.signin = async (req, res) => {
  const { id, password } = req.body; // id represents what the user chooses to login with (email/username)

  const existedUser = await Users.findOne({
    $or: [{ username: id }, { email: id }],
  });
  if (!existedUser) {
    return res.status(401).json({
      error: 'invalid id or password',
    });
  }

  const hashedPassword = existedUser.password_hash;
  const validPassword = await bcrypt.compare(password, hashedPassword);
  if (!validPassword) {
    return res.status(401).json({ error: 'invalid id or password' });
  }

  // checking the role to render the appropriate page for the user after signing invalid

  if (existedUser.role === 'chef')
    return res.json({
      message: `chef: ${existedUser.username} signed in successfully`,
    });

  return res.json({
    message: `customer: ${existedUser.username} signed in successfully`,
  });
};

authControllers.signout = (req, res) => {
  // logic will be implemented after applying authentication
  res.redirect('/');
};

module.exports = authControllers;
