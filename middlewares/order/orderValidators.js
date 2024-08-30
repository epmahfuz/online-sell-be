// external imports
const { check, validationResult, body } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports

// add Order validators
const addOrderValidators = [
  // Validate 'name' field
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),

  // Validate 'image' field (optional)
  check('image')
    .optional()
    .isString()
    .withMessage('Image must be a string'),

  // Validate 'customer' field
  check('customer')
    .notEmpty()
    .withMessage('Customer ID is required'),

  // Validate 'products' field
  check('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),

  // Validate each product in 'products' array
  body('products.*.productId')
    .notEmpty()
    .withMessage('Product ID is required'),

  body('products.*.counterInCart')
    .isInt({ min: 1 })
    .withMessage('CounterInCart must be a positive integer'),

  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
    
  body('products.*.quantityType')
    .notEmpty()
    .withMessage('QuantityType is required')
    .isString()
    .withMessage('QuantityType must be a string'),

  body('products.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative float'),

  // Validate 'totalAmount' field
  check('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a non-negative float'),

  // Validate 'status' field
  check('status')
    .optional()
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid status'),
];


const addOrderValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  console.log("mappedErrors: ", mappedErrors);
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if (req && req.files && req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/orderImgs/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    // response the errors
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
    addOrderValidators,
    addOrderValidationHandler,
};
