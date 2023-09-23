const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  avatar: { type: String},
  active: {type: Boolean, required: true},
  archived: {type: Boolean, required: true},
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;