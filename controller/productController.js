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

const updateProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name;
    product.description = req.body.description;
    product.quantityType = req.body.quantityType;
    product.quantity = req.body.quantity;
    product.price = req.body.price;
    product.categoryId = req.body.categoryId;
    product.counterInCart = req.body.counterInCart;
    product.isActive = req.body.isActive;
    product.isArchived = req.body.isArchived;

    if (req.files && req.files.length > 0 && product.image) {
      // remove previous uploaded files
      unlink(
        path.join(__dirname, `/../public/uploads/productImgs/${product.image}`),
        (err) => {
          if (err) console.log(err);
        }
      );

      // assign new image
      product.image = req.files[0].filename;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.log("updateProduct-controller-error: ", err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred",
        },
      },
    });
  }
};
//  ************ Most important - used - End ************
async function getByCategoryId(req, res, next) {
  try {
    const data = await Product.find(
      {categoryId: req.params.categoryId, isActive: true, isArchived: false}
    );
    const modifiedData = data.map(item => ({
      image: process.env.APP_URL + "/uploads/productImgs/" + item.image,
      name: item.name,
      price:item.price,
      quantity: item.quantity,
      quantityType: item.quantityType,
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
    const data = await Product.find(
      {isActive: true, isArchived: false}
    );
    const modifiedData = data.map(item => ({
      image: process.env.APP_URL + "/uploads/productImgs/" + item.image,
      name: item.name,
      price:item.price,
      quantity: item.quantity,
      quantityType: item.quantityType,
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

    const modifiedData = product.map(item => ({
      image: process.env.APP_URL + "/uploads/productImgs/" + item.image,
      name: item.name,
      description: item.description,
      price:item.price,
      quantity: item.quantity,
      quantityType: item.quantityType,
      counterInCart: 0,
      categoryId: item.categoryId,
      _id: item._id
    }));
  
    res.json(modifiedData);

  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

// Archive a product
async function archivePrdouct(req, res, next) {
  const productId = req.params.productId;

  // Validate if the productId is a valid ObjectId

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { isArchived: req.body.status } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        errors: {
          common: {
            msg: 'Product not found!',
          },
        },
      });
    }

    res.status(200).json({
      message: 'Product updated successfully!',
      updatedProduct,
    });
  } catch (err) {
    console.log('updatedProduct-Controller-error: ', err);
    res.status(500).json({
      errors: {
        common: {
          msg: 'Unknown error occurred!',
        },
      },
    });
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
  updateProduct,
  getByCategoryId,
  getAll,
  getAProduct,
  removeProduct,
  archivePrdouct
};
