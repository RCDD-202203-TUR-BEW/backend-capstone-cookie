const UnauthorizedErrorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send("You don't have authorization to view this page");
  } else {
    next(err);
  }
};

module.exports = { UnauthorizedErrorHandler };
