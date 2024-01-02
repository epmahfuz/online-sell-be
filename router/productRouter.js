const express = require('express');
const router = express.Router();

// Internal imports
const Product = require('../models/Product');
const imageUpload = require("../middlewares/common/imageUpload");
const logRequest = require('../middlewares/common/logRequest');
const {addProductValidators, addProductValidationHandler} = require('../middlewares/product/productValidators');
const { addProduct, getAll, getAProduct, removeProduct, getByCategoryId } = require('../controller/productController');

const logRequest2 = (req, res, next) => {
  console.log('Received a Product request');
  next();
};

const customMessages = {
  add: 'Received a Product request for adding - /add',
  delete: 'Received a Product request for deleting - /delete/productId',
  getAll: 'Received a Product request for getting - /getAll',
  getA: 'Received a Product request for getting - /get/:productId',
  getByCategoryId: 'Received a Product request for getting - /product/byCategoryId/:categoryId'
};

router.post(
  '/add', 
  logRequest(customMessages.add),
  imageUpload("productImgs"), 
  addProductValidators, 
  addProductValidationHandler, 
  addProduct
);

router.get(
  '/getAll',
  logRequest(customMessages.getAllCategory), 
  getAll,
);

router.get(
  '/getByCategoryId/:categoryId',
  logRequest(customMessages.getByCategoryId), 
  getByCategoryId
);

// router.get('/getByCategoryId/:categoryId', customMessages.getProductByCategoryId, (req, res) => {
//   Product.find(
//     {categoryId : req.params.categoryId}
//   ).then((data) => {
//       res.json(data);
//     })
//     .catch((error) => {
//       console.error('Error fetching data:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     });
// })
router.get('/getAll', logRequest2, (req, res) => {
  Product.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
})
module.exports = router;