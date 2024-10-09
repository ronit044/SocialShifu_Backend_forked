const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateLoginSchema,validateSignupSchema } = require('../Schemas');

const router = express.Router();

router.post('/signup', validateSignupSchema, signup);
router.post('/login', validateLoginSchema, login);


module.exports = router;
