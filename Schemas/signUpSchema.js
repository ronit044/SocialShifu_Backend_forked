const { z } = require('zod');

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const validateSignup = (req, res, next) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = validateSignup;
