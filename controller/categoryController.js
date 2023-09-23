// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const Category = require("../models/Category");

//  ************ Most important - used - Start ************
async function addCategory(req, res, next) {
  let  newCategory = new Category({
    ...req.body,
    active: true,
    archived: false
  });

  if (req.files && req.files.length > 0) {
   newCategory.avatar = req.files[0].filename
  }

  try {
    const result = await newCategory.save();
    res.status(200).json({
      message: "Category was added successfully!",
    });
  } catch (err) {
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

async function getAllCategory(req, res, next) {
  try {
    const data = await Category.find();
    res.json({
      Data: data,
      TotalCount: data.length,
      PageNumber: 0,
      PageSize: 100
    });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}
// remove category
async function removeCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndDelete({
      _id: req.params.id,
    });

    // remove category avatar if any
    if (category.avatar) {
      unlink(
        path.join(__dirname, `/../public/uploads/categoryImgs/${category.avatar}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    res.status(200).json({
      message: "Category was removed successfully!",
    });
  } catch (err) {
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
  addCategory,
  removeCategory,
};
