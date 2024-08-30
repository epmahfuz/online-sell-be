const express = require('express');
const router = express.Router();

// Internal imports
const Category = require('../models/Category');
const imageUpload = require("../middlewares/common/imageUpload");
const { addCategory, updateCategory, getAllCategory, getACategory, removeCategory } = require('../controller/categoryController');
const {addCategoryValidators, addCategoryValidationHandler} = require('../middlewares/category/categoryValidators');
const logRequest = require('../middlewares/common/logRequest');
const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");


const customMessages = {
  addCategory: 'Received a Category request for adding - /add',
  updateCategory: 'Received a Category request for updating - /update/categoryId',
  deleteCategory: 'Received a Category request for deleting - /delete/categoryId',
  getAllCategory: 'Received a Category request for getting - /getAll',
  getACategory: 'Received a Category request for getting - /get/:categoryId'
};


router.post(
  '/add', 
  logRequest(customMessages.addCategory),
  checkLogin,
  requireRole(["admin"]),
  imageUpload("categoryImgs"), 
  addCategoryValidators, 
  addCategoryValidationHandler, 
  addCategory
);

router.patch(
  '/update/:categoryId',
  logRequest(customMessages.updateCategory),
  checkLogin,
  requireRole(["admin"]),
  imageUpload("categoryImgs"), 
  addCategoryValidators,
  addCategoryValidationHandler,
  updateCategory
);

router.get(
  '/getAll',
  logRequest(customMessages.getAllCategory),
  getAllCategory,
);

router.get(
  '/get/:categoryId',
  logRequest(customMessages.getACategory),
  getACategory
);

router.delete(
  "/delete/:categoryId",
  logRequest(customMessages.deleteCategory),
  checkLogin,
  requireRole(["admin"]),
  removeCategory
);

module.exports = router;