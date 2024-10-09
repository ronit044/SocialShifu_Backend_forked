const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
require('dotenv').config();
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error(error);
    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = authenticate;
