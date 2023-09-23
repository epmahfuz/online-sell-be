const express = require('express');
const router = express.Router();

// Internal imports
const Category = require('../models/Category');
const categoryImgUpload = require("../middlewares/category/imageUpload");
const { addCategory, getAllCategory } = require('../controller/categoryController');
const {addCategoryValidators, addCategoryValidationHandler} = require('../middlewares/category/categoryValidators');

const customMessages = {
  addCategory: 'Received a Category request for adding - /add',
  deleteCategory: 'Received a Category request for deleting - /delete',
  getAllCategory: 'Received a Category request for getting - /getAll'
};

const logRequest = (customMessage) => (req, res, next) => {
  console.log(customMessage);
  next();
};

router.post(
  '/add', 
  logRequest(customMessages.addCategory),
  categoryImgUpload, 
  addCategoryValidators, 
  addCategoryValidationHandler, 
  addCategory
);

router.get(
  '/getAll',
  logRequest(customMessages.getAllCategory), 
  getAllCategory,
);

router.get('/get/:categoryId', logRequest, (req, res) => {
  Category.find(
    {_id : req.params.categoryId}
  ).then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
})

module.exports = router;