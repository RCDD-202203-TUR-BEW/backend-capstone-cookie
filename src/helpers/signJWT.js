const jwt = require('jsonwebtoken');

const signJWT = (response, user) => {
  const { id, username, email, role, phone } = user;
  const payload = { id, username, email, role, phone };
  const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14d',
  });
  response.cookie('token', accessToken, {
    httpOnly: true,
    maxAge: 1000 * 3600 * 24 * 14,
    signed: true,
  });
};

module.exports = signJWT;
