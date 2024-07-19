const express = require('express');
const router = express.Router();

// Internal imports
const Product = require('../models/Product');
const imageUpload = require("../middlewares/common/imageUpload");
const logRequest = require('../middlewares/common/logRequest');
const {addProductValidators, addProductValidationHandler} = require('../middlewares/product/productValidators');
const { addProduct, updateProduct, getAll, getAProduct, removeProduct, getByCategoryId, archivePrdouct } = require('../controller/productController');
const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");


const customMessages = {
  add: 'Received a Product request for adding - /add',
  delete: 'Received a Product request for deleting - /delete/productId',
  getAll: 'Received a Product request for getting - /getAll',
  getAProduct: 'Received a Product request for getting - /get/:productId',
  getByCategoryId: 'Received a Product request for getting - /product/byCategoryId/:categoryId',
  updateProduct: 'Received a Product request for updating - /update/productId',
  archiveAPrdouct: 'Received a Product request for archiving - /archive/productId'
};

router.post(
  '/add', 
  logRequest(customMessages.add),
  checkLogin,
  requireRole(["admin"]),
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

router.get(
  '/getAProduct/:productId',
  logRequest(customMessages.getAProduct),
  getAProduct
);

router.patch(
  '/update/:productId',
  logRequest(customMessages.updateProduct),
  checkLogin,
  requireRole(["admin"]),
  imageUpload("productImgs"), 
  addProductValidators,
  addProductValidationHandler,
  updateProduct
);

router.patch(
  '/archive/:productId',
  logRequest(customMessages.archiveAPrdouct),
  archivePrdouct
);

module.exports = router;