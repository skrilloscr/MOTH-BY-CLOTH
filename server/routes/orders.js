const router = require('express').Router()
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const auth = require('../middleware/auth')

// POST /api/orders — place order
router.post('/', auth, async (req, res, next) => {
  try {
    const { items, shipping, subtotal, shippingCost, total } = req.body
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' })

    const order = await Order.create({
      user: req.user.id,
      items,
      shipping,
      subtotal,
      shippingCost,
      total,
    })

    // Clear the user's cart after order is placed
    const cart = await Cart.findOne({ user: req.user.id })
    if (cart) { cart.items = []; await cart.save() }

    res.status(201).json({ order })
  } catch (err) { next(err) }
})

// GET /api/orders — user's order history
router.get('/', auth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json({ orders })
  } catch (err) { next(err) }
})

// GET /api/orders/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ order })
  } catch (err) { next(err) }
})

module.exports = router
