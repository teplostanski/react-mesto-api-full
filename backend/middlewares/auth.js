const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
  } else {
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      next(new UnauthorizedError('Необходима авторизация'));
    }
    req.user = payload;
    next();
  }
};
