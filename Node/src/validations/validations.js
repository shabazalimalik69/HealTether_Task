const { body } = require('express-validator');

const addValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
    body('mobile')
    .customSanitizer((value) => value.replace(/[^0-9]/g, ''))
    .matches(/^\d{10}$/)
    .withMessage('Mobile number must be a valid 10-digit number.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/\d/)
    .withMessage('Password must contain at least one number.')
    .matches(/[@$!%*?&]/)
    .withMessage('Password must contain at least one special character.'),
];


module.exports = { addValidation,};
