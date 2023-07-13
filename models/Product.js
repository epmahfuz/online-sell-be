const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  categoryId: { type: mongoose.Types.ObjectId, required: true },

  // Active: {type: Boolean, required: true},
  // Archived: {type: Boolean, required: true},
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;