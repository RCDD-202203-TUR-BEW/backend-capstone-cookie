const UnauthorizedErrorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  } else {
    next(err);
  }
};

module.exports = { UnauthorizedErrorHandler };
