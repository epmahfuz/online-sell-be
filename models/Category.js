const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String},
    isActive: {type: Boolean, required: true},
    isArchived: {type: Boolean, required: true},
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;