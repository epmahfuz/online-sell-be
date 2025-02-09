// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");
const validator = require('validator');

// internal imports
const User = require("../../models/People");

// add user
const addUserValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),
  check("email")
    .optional()
    .trim()
    .custom(async (value, { req }) => {
      if (value) {
        if (!validator.isEmail(value)) {
          throw createError("Invalid email address");
        }
        try {
          const user = await User.findOne({ email: value });
          if (user) {
            throw createError("Email already is in use!");
          }
        } catch (err) {
          throw createError(err.message);
        }
      }
    }),
  check("mobile")
    .isNumeric()
    .withMessage("Enter a valid Bangladeshi mobile number")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    // .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)
    // .withMessage('Password must contain at least 1 alphabet, 1 number, and 1 symbol')
];

const addUserValidationHandler = function (req, res, next) {

  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if (req && req.files && req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${filename}`),
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
  addUserValidators,
  addUserValidationHandler,
};
