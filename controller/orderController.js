// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const Order = require("../models/Order");

//  ************ Most important - used - Start ************
async function addOrder(req, res, next) {
  let  newOrder = new Order({
    ...req.body,
    isActive: true,
    isArchived: false
  });

  if (req.files && req.files.length > 0) {
   newOrder.image = req.files[0].filename
  }

  try {
    const result = await newOrder.save();
    res.status(200).json({
      message: "Order was added successfully!",
    });
  } catch (err) {
    console.log("addOrder-Controller-error: ", err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }

}
//  ************ Most important - used - End ************

async function getAllOrder(req, res, next) {
  
  try {
    const data = await Order.find();
    const modifiedData = data.map(item => (
      {
        _id: item._id,
        status: item.status,
        customer: item.customer,
        customerName: item.customerName,
        customerPhone: item.customerPhone,
        customerAddress: item.customerAddress,
        products: item.products,
        subtotal: item.subtotal,
        shippingCost: item.shippingCost,
        totalAmount: item.totalAmount,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    }));
    
    res.json({
      Data: modifiedData,
      TotalCount: data.length,
      PageNumber: 0,
      PageSize: 100
    });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAOrder(req, res, next) {
  try {
    const order = await Order.find(
      {_id : req.params.orderId}
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
  
    res.json(order);

  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

// remove order
async function removeOrder(req, res, next) {
  try {
    const order = await Order.findByIdAndDelete({
      _id: req.params.orderId,
    });

    // remove order image if any
    if (order.image) {
      unlink(
        path.join(__dirname, `/../public/uploads/orderImgs/${order.image}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    res.status(200).json({
      message: "Order was removed successfully!",
    });
  } catch (err) {
    console.log("removeOrder-controller-error: ", err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the order!",
        },
      },
    });
  }
}
// update order
async function updateOrder(req, res, next) {
  const orderId = req.params.orderId;

  // Validate if the orderId is a valid ObjectId

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status: req.body.status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        errors: {
          common: {
            msg: 'Order not found!',
          },
        },
      });
    }

    res.status(200).json({
      message: 'Order updated successfully!',
      updatedOrder,
    });
  } catch (err) {
    console.log('updateOrder-Controller-error: ', err);
    res.status(500).json({
      errors: {
        common: {
          msg: 'Unknown error occurred!',
        },
      },
    });
  }
}


module.exports = {
  getAllOrder,
  addOrder,
  getAOrder,
  removeOrder,
  updateOrder,
};
