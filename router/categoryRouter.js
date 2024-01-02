const express = require('express');
const router = express.Router();

// Internal imports
const Category = require('../models/Category');
const imageUpload = require("../middlewares/common/imageUpload");
const { addCategory, getAllCategory, getACategory, removeCategory } = require('../controller/categoryController');
const {addCategoryValidators, addCategoryValidationHandler} = require('../middlewares/category/categoryValidators');
const logRequest = require('../middlewares/common/logRequest');

const customMessages = {
  addCategory: 'Received a Category request for adding - /add',
  deleteCategory: 'Received a Category request for deleting - /delete/categoryId',
  getAllCategory: 'Received a Category request for getting - /getAll',
  getACategory: 'Received a Category request for getting - /get/:categoryId'
};
 
// const logRequest = (customMessage) => (req, res, next) => {
//   console.log(customMessage);
//   next();
// };

router.post(
  '/add', 
  logRequest(customMessages.addCategory),
  imageUpload("categoryImgs"), 
  addCategoryValidators, 
  addCategoryValidationHandler, 
  addCategory
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
  removeCategory
);

module.exports = router;