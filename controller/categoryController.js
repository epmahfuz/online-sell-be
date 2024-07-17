// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");
const crypto = require('crypto');

// internal imports
const Category = require("../models/Category");

//  ************ Most important - used - Start ************
async function addCategory(req, res, next) {
  let  newCategory = new Category({
    ...req.body,
    isActive: true,
    isArchived: false
  });

  if (req.files && req.files.length > 0) {
   newCategory.image = req.files[0].filename
  }

  try {
    const result = await newCategory.save();
    res.status(200).json({
      message: "Category was added successfully!",
    });
  } catch (err) {
    console.log("addCategory-controller-error: ", err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }

}
const updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    let category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = req.body.name;

    if (req.files && req.files.length > 0) {
      // remove previous uploaded files
      unlink(
        path.join(__dirname, `/../public/uploads/categoryImgs/${category.image}`),
        (err) => {
          if (err) console.log(err);
        }
      );

      // assign new image
      category.image = req.files[0].filename;
    }

    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    console.log("updateCategory-controller-error: ", err);
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
async function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex') // Convert to hexadecimal format
      .slice(0, length); // Return required number of characters
}
async function getAllCategory(req, res, next) {
  //const COOKIE_SECRET = generateRandomString(64);
  //console.log("Generated COOKIE_SECRET:", COOKIE_SECRET);

  try {
    const data = await Category.find();
    const modifiedData = data.map(item => (
      {
      image: process.env.APP_URL + "/uploads/categoryImgs/" + item.image,
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

async function getACategory(req, res, next) {
  try {
    const category = await Category.find(
      {_id : req.params.categoryId}
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const modifiedData = category.map(item => (
      {
      image: process.env.APP_URL + "/uploads/categoryImgs/" + item.image,
      name: item.name,
      _id: item._id
    }));
  
    res.json(modifiedData);

  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

// remove category
async function removeCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndDelete({
      _id: req.params.categoryId,
    });

    // remove category image if any
    if (category.image) {
      unlink(
        path.join(__dirname, `/../public/uploads/categoryImgs/${category.image}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    res.status(200).json({
      message: "Category was removed successfully!",
    });
  } catch (err) {
    console.log("removeCategory-controller-error: ", err);
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the category!",
        },
      },
    });
  }
}

module.exports = {
  getAllCategory,
  updateCategory,
  addCategory,
  getACategory,
  removeCategory,
};