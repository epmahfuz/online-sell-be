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
      image: process.env.APP_URL + "/uploads/orderImgs/" + item.image,
      name: item.name,
      _id: item._id
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

module.exports = {
  getAllOrder,
  addOrder,
  getAOrder,
  removeOrder,
};
