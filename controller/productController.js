// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const Product = require("../models/Product");

//  ************ Most important - used - Start ************
async function addProduct(req, res, next) {
  let  newProduct = new Product({
    ...req.body,
    isActive: true,
    isArchived: false
  });

  if (req.files && req.files.length > 0) {
   newProduct.image = req.files[0].filename
  }

  try {
    const result = await newProduct.save();
    res.status(200).json({
      message: "Product was added successfully!",
    });
  } catch (err) {
    console.log("addProduct-controller-error: ", err);
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
async function getByCategoryId(req, res, next) {
  try {
    const data = await Product.find(
      {categoryId: req.params.categoryId}
    );
    const modifiedData = data.map(item => ({
      image: process.env.APP_URL + "/uploads/productImgs/" + item.image,
      name: item.name,
      price:item.price,
      quantity: item.quantity,
      counterInCart: 0,
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

async function getAll(req, res, next) {
  try {
    const data = await Product.find();
    const modifiedData = data.map(item => ({
      image: process.env.APP_URL + "/uploads/productImgs/" + item.image,
      name: item.name,
      price:item.price,
      quantity: item.quantity,
      counterInCart: 0,
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

async function getAProduct(req, res, next) {
  try {
    const product = await Product.find(
      {_id : req.params.productId}
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
  
    res.json(product);

  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

// remove product
async function removeProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete({
      _id: req.params.productId,
    });

    // remove product image if any
    if (product.image) {
      unlink(
        path.join(__dirname, `/../public/uploads/productImgs/${product.image}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    res.status(200).json({
      message: "Product was removed successfully!",
    });
  } catch (err) {
    console.log("removeProduct-controller-error: ", err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the product!",
        },
      },
    });
  }
}

module.exports = {
  addProduct,
  getByCategoryId,
  getAll,
  getAProduct,
  removeProduct,
};
