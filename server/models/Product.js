const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  category:      { type: String, required: true, enum: ['men', 'women', 'kids'] },
  type:          { type: String, required: true },
  price:         { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  sizes:         [String],
  colors:        [String],
  image:         { type: String, required: true },
  rating:        { type: Number, default: 0 },
  reviews:       { type: Number, default: 0 },
  description:   String,
  featured:      { type: Boolean, default: false },
  isNew:         { type: Boolean, default: false },
}, { timestamps: true, suppressReservedKeysWarning: true })

module.exports = mongoose.model('Product', ProductSchema)
