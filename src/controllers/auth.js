const bcrypt = require('bcrypt');
const randomString = require('randomstring');

const Users = require('../models/user').User;
const Chefs = require('../models/user').Chef;
const Customers = require('../models/user').Customer;
const signJWT = require('../helpers/signJWT');
const sendEmail = require('../utils/email');

const authControllers = {};
let randomstr;

const storage = require('../db/storage');
const { getFileExtension } = require('../utils/utils');

const PROFILE_IMAGE_DIR = 'avatars';
authControllers.signup = async (req, res) => {
  let role = 'customer';
  if (req.path === '/chef/signup') role = 'chef';

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

  const isExisted = async (fieldName, value, modelName = Users) => {
    const existedProperty = await modelName
      .find({})
      .where(fieldName)
      .equals(value);
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
  let user;
  if (role === 'chef') {
    const { kitchenName, kitchenDescription, bio } = req.body;
    if (await isExisted('kitchen_name', kitchenName, Chefs))
      return response('Kitchen Name', kitchenName);
    user = await Chefs.create({
      firstname,
      lastname,
      username,
      email,
      role,
      bio,
      password_hash: hashedPassword,
      phone,
      birthday,
      gender,
      kitchen_name: kitchenName,
      kitchen_description: kitchenDescription,
    });
  } else {
    user = await Customers.create({
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
  }

  signJWT(res, user);

  // Verifying the email
  randomstr = randomString.generate();
  sendEmail(user, randomstr);

  // checking the role to render the appropriate page for the user after signing up

  if (role === 'chef')
    return res.json({ message: 'new chef signed up successfully' });

  return res.json({ message: 'new customer signed up successfully' });
};

authControllers.verifyEmail = async (req, res) => {
  const { code, email } = req.query;
  if (code !== randomstr) return res.send('Please enter a correct code');

  const user = await Users.findOne({ email });
  user.email_verified = true;

  await user.save();

  return res.send('Email is verified successfully');
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

authControllers.uploadAvatarImage = async (req, res) => {
  try {
    const { username } = req.params;
    const { _id } = req.user;

    const user = await Users.findOne({ username });
    // eslint-disable-next-line no-underscore-dangle
    if (user._id.toString() !== _id)
      res
        .status(401)
        .json({ message: "you're not authorized to view this page" });

    /// / add the image to the storage of the user
    // image is optional
    // fileName imageDir/userId.extension
    if (req.file) {
      const imgUrl = await storage.uploadImage(
        req.file,
        `${PROFILE_IMAGE_DIR}/${user.id}.${getFileExtension(
          req.file.originalname
        )}`
      );
      user.avatar = imgUrl;
      await user.save();
      res.json({
        message: 'profile picture is uploaded successfully',
      });
    } else res.status(400).json({ error: 'no image provided' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = authControllers;
