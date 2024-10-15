const User = require('../model/userModel');
const { UnauthenticatedError, ConflictError } = require('../errors');
const asyncHandler = require('express-async-handler');
const { requireSession } = require('@clerk/express');
const jwt = require('jsonwebtoken');

const signup = asyncHandler(async (req, res) => {
  try {
    const { session } = req;
    const { email, id, firstName, lastName, username } = session.user;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ConflictError('User already exists');

    const newUser = new User({
      clerkId: id,
      username,
      firstName,
      lastName,
      email,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        clerkId: newUser.clerkId,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({ token });
  } catch (error) {
    throw new UnauthenticatedError('Invalid session token');
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { session } = req;
    const { email, id } = session.user;

    const user = await User.findOne({ email });
    if (!user) throw new UnauthenticatedError('User not found');
    if (user.clerkId !== id) throw new UnauthenticatedError('Invalid user session');

    const token = jwt.sign(
      {
        id: user._id,
        clerkId: user.clerkId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    throw new UnauthenticatedError('Invalid session token');
  }
});

module.exports = { signup, login };
