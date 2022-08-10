const jwt = require('jsonwebtoken');

const signJWT = (response, user) => {
  const { _id, role } = user;
  const payload = { _id, role };
  const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14d',
  });
  response.cookie('token', accessToken, {
    httpOnly: true, // This Boolean parameter flags the cookie to be only used by the web server.
    maxAge: 1000 * 3600 * 24 * 14, // maxAge for the browser to handle expiration after 14 days
    signed: true,
  });
};

module.exports = signJWT;
