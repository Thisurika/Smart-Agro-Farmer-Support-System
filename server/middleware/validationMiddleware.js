const { body, validationResult } = require('express-validator');

// Helper to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: errors.array()[0].msg, 
      errors: errors.array() 
    });
  }
  next();
};

// Auth Validations
const validateSignup = [
  body('firstName').trim().notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name is too long'),
  body('lastName').trim().notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name is too long'),
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Please provide a valid phone number'),
  validate
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const validateProfileUpdate = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Please provide a valid phone number'),
  validate
];

// Crop Validations
const validateCrop = [
  body('name').trim().notEmpty().withMessage('Crop name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required')
    .isIn(["Grains", "Vegetables", "Fruits", "Pulses", "Oilseeds", "Spices", "Cash Crops", "Other"])
    .withMessage('Invalid crop category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('unit').notEmpty().withMessage('Unit is required')
    .isIn(["kg", "ton", "lb", "unit"]).withMessage('Invalid unit'),
  validate
];

// Chemical Validations
const validateChemical = [
  body('name').trim().notEmpty().withMessage('Chemical name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').notEmpty().withMessage('Type is required')
    .isIn(["Fertilizer", "Pesticide", "Herbicide", "Fungicide", "Insecticide", "Growth Regulator", "Other"])
    .withMessage('Invalid chemical type'),
  body('category').trim().notEmpty().withMessage('Category is required')
    .not().matches(/\d/).withMessage('Category cannot contain numbers'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('unit').notEmpty().withMessage('Unit is required')
    .isIn(["litre", "kg", "ml", "g", "unit"]).withMessage('Invalid unit'),
  validate
];
// Weather Alert Validations
const validateWeatherAlert = [
  body('title').trim().notEmpty().withMessage('Alert title is required'),
  body('message').trim().notEmpty().withMessage('Alert message is required'),
  body('severity').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level'),
  body('affectedDistricts').isArray().withMessage('Affected districts must be an array'),
  validate
];

// Farming Tip Validations
const validateFarmingTip = [
  body('weatherCondition').notEmpty().withMessage('Weather condition is required'),
  body('tip').trim().notEmpty().withMessage('Tip content is required'),
  body('category').notEmpty().withMessage('Category is required'),
  validate
];

// Payment Validations
const validatePayment = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.item').notEmpty().withMessage('Item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.itemType').isIn(['Crop', 'Chemical']).withMessage('Invalid item type'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('billingAddress').notEmpty().withMessage('Billing address is required'),
  validate
];

// Feedback Validations
const validateFeedback = [
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 5, max: 1000 }).withMessage('Message must be between 5 and 1000 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  validate
];

module.exports = {
  validateSignup,
  validateLogin,
  validateProfileUpdate,
  validateCrop,
  validateChemical,
  validateFeedback,
  validateWeatherAlert,
  validateFarmingTip,
  validatePayment
};
