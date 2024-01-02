const express = require('express');
const router = express.Router();

// Internal imports
const Order = require('../models/Order');
const imageUpload = require("../middlewares/common/imageUpload");
const { addOrder, getAllOrder, getAOrder, removeOrder } = require('../controller/orderController');
const {addOrderValidators, addOrderValidationHandler} = require('../middlewares/order/orderValidators');
const logRequest = require('../middlewares/common/logRequest');

const customMessages = {
  addOrder: 'Received a Order request for adding - /add',
  deleteOrder: 'Received a Order request for deleting - /delete/orderId',
  getAllOrder: 'Received a Order request for getting - /getAll',
  getAOrder: 'Received a Order request for getting - /get/:orderId'
};

router.post(
  '/add', 
  logRequest(customMessages.addOrder),
  addOrderValidators, 
  addOrderValidationHandler, 
  addOrder
);

router.get(
  '/getAll',
  logRequest(customMessages.getAllOrder), 
  getAllOrder,
);

router.get(
  '/get/:orderId',
  logRequest(customMessages.getAOrder), 
  getAOrder
);

router.delete(
  "/delete/:orderId",
  logRequest(customMessages.deleteOrder),
  removeOrder
);

module.exports = router;