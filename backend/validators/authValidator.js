const Joi = require('joi');

// Validation schema for user registration
const userValidationSchema = Joi.object({
 
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'password should be at least 8 characters long',
    'any.required': 'password is required',
  }),
 
  
});


// Validation schema for login
const loginValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'password is required',
    })
  });



// Middleware for login validation
exports.validateLogin = (req, res, next) => {
    const { error } = loginValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ errors });
    }
    next();
  };

// Middleware for validation
exports.validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({ errors });
  }
  next();
};


