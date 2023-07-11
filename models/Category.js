const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Active: {type: Boolean, required: true},
  // Archived: {type: Boolean, required: true},
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;