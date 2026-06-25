const mongoose = require('mongoose')

const OrderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  image:    String,
  price:    Number,
  size:     String,
  color:    String,
  quantity: Number,
})

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  shipping: {
    firstName: String, lastName: String, email: String,
    address: String, city: String, state: String, zip: String, country: String,
  },
  subtotal:     { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  total:        { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema)
