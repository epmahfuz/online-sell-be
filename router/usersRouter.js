// external imports
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

// internal imports
const {
  getUsers,
  addUser,
  removeUser,
} = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidators");
const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");
const logRequest = require('../middlewares/common/logRequest');

const customMessages = {
  addAnonymousUser: 'Received a User request for adding - /addAnonymousUser',
  addUser: 'Received a User request for adding - /add',
  deleteUser: 'Received a User request for deleting - /delete/userId',
  getAllUser: 'Received a User request for getting - /getAll',
  getAUser: 'Received a User request for getting - /get/:userId',
  updateUser: 'Received a User request for updating - /update/:userId'
};

//  ************ Most important - used - Start ************

// add anonymous user
router.post(
  "/addAnonymousUser",
  logRequest(customMessages.addAnonymousUser),
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

//  ************ Most important - used - End ************

// users page
router.get(
  "/",
  decorateHtmlResponse("Users"),
  checkLogin,
  requireRole(["admin"]),
  getUsers
);

// add user
router.post(
  "/",
  checkLogin,
  requireRole(["admin"]),
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

// remove user
router.delete("/:id", checkLogin, requireRole(["admin"]), removeUser);

module.exports = router;
