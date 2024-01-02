// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports

// add Product validators
const addProductValidators = [
    check("name")
      .isLength({ min: 1 })
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string")
      .trim(),
  
    check("description")
      .isLength({ min: 1 })
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be a string")
      .trim(),
  
    check("price")
      .isNumeric()
      .withMessage("Price must be a number"),
  
    check("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer"),
  ];
  

const addProductValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if (req && req.files && req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/productImgs/${filename}`),
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
    addProductValidators,
    addProductValidationHandler,
};
