const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String },
        isActive: { type: Boolean, required: true },
        isArchived: { type: Boolean, required: true },
        customer: { type: Schema.Types.ObjectId, ref: 'User', required: true,},
        customerName: { type: String, required: true,},
        customerPhone: { type: String, required: true,},
        customerAddress: { type: String, required: true,},
        paymentMethod: { type: String, enum: ['CashOnDelivery', 'Bkash', 'Nagad', 'Rocket', 'Card'], default: 'CashOnDelivery',},
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, },
                name:{type:String, required: true},
                quantity: {type: Number, required: true,},
                price: { type: Number, required: true,},
            },
        ],
        subtotal:{ type: Number, required: true,},
        shippingCost: { type: Number, required: true,},
        totalAmount: { type: Number, required: true,},
        status: {type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending',}
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
