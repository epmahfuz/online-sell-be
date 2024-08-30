// external imports
const express = require("express");
const router = express.Router();

// internal imports
const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require("../middlewares/login/loginValidators");
const { redirectLoggedIn } = require("../middlewares/common/checkLogin");
const logRequest = require('../middlewares/common/logRequest');


const customMessages = {
  login: 'Received a access-control request - /login',
};

// set page title
const page_title = "Login";

//  ************ Most important - used - Start ************
// process login - new
router.post(
  "/login",
  logRequest(customMessages.login),
  doLoginValidators,
  doLoginValidationHandler,
  login
);
//  ************ Most important - used - End ************



// login page
router.get("/", decorateHtmlResponse(page_title), redirectLoggedIn, getLogin);

// process login
router.post(
  "/",
  decorateHtmlResponse(page_title),
  doLoginValidators,
  doLoginValidationHandler,
  login
);

// logout
router.delete("/", logout);

module.exports = router;
