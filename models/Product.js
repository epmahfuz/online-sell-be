const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  image: { type: String},
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  categoryId: { type: mongoose.Types.ObjectId, required: true },
  isActive: {type: Boolean, required: true},
  isArchived: {type: Boolean, required: true},
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;