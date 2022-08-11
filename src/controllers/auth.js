const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const Users = require('../models/user');
const signJWT = require('../helpers/signJWT');
const transporter = require('../utils/email');

const authControllers = {};
const randomstr = randomstring.generate();

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
  const user = await Users.create({
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

  // sending verification email

  const info = await transporter.sendMail({
    from: 'cookiesrecoded@outlook.com',
    to: 'cookiesreciever@outlook.com',
    subject: 'Cookiez Verification',
    html: `<h2>Welcome ${firstname}</h2>
  <p>
    We just need to verify your email address before you can access Cookiez.
    
    Verify your email address <a href="http://localhost:3000/signup/verifyemail">here</a> by entering the code below :
    <h2>${randomstr}</h2>
    Thanks! <br>
    - The Cookiez team
    </p>`,
  });

  // checking the role to render the appropriate page for the user after signing up

  if (role === 'chef')
    return res.json({ message: 'new chef signed up successfully' });

  return res.json({ message: 'new customer signed up successfully' });
};

authControllers.verifyEmail = (req, res) => {
  const { code } = req.body;
  if (code !== randomstr) return res.send('Please enter a correect code');

  return res.redirect('/');
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

  signJWT(res, existedUser);

  // checking the role to render the appropriate page for the user after signing invalid

  if (existedUser.role === 'chef')
    return res.json({
      message: `chef: ${existedUser.username} signed in successfully`,
    });

  return res.json({
    message: `customer: ${existedUser.username} signed in successfully`,
  });
};

authControllers.signout = async (req, res) => {
  const { _id } = req.user;
  const user = await Users.findOne({ _id });
  const { username } = user;
  res.clearCookie('token');
  res.json({ message: `${username} has signed out successfully` });
  // redirect to signin page once we have a view ready
};

module.exports = authControllers;
