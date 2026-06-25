const router = require('express').Router()
const Cart = require('../models/Cart')
const auth = require('../middleware/auth')

const populate = (cart) => cart.populate('items.product')

// GET /api/cart
router.get('/', auth, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product')
    res.json({ items: cart ? cart.items : [] })
  } catch (err) { next(err) }
})

// POST /api/cart — add / increment item
router.post('/', auth, async (req, res, next) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body
    let cart = await Cart.findOne({ user: req.user.id })
    if (!cart) cart = new Cart({ user: req.user.id, items: [] })

    const idx = cart.items.findIndex(
      (i) => i.product.toString() === productId && i.size === size && i.color === color
    )
    if (idx > -1) cart.items[idx].quantity += quantity
    else cart.items.push({ product: productId, size, color, quantity })

    await cart.save()
    await populate(cart)
    res.json({ items: cart.items })
  } catch (err) { next(err) }
})

// PUT /api/cart/:itemId — update quantity
router.put('/:itemId', auth, async (req, res, next) => {
  try {
    const { quantity } = req.body
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    const item = cart.items.id(req.params.itemId)
    if (!item) return res.status(404).json({ message: 'Item not found' })

    if (quantity < 1) cart.items.pull(req.params.itemId)
    else item.quantity = quantity

    await cart.save()
    await populate(cart)
    res.json({ items: cart.items })
  } catch (err) { next(err) }
})

// DELETE /api/cart/:itemId — remove one item
router.delete('/:itemId', auth, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.json({ items: [] })
    cart.items.pull(req.params.itemId)
    await cart.save()
    await populate(cart)
    res.json({ items: cart.items })
  } catch (err) { next(err) }
})

// DELETE /api/cart — clear entire cart
router.delete('/', auth, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (cart) { cart.items = []; await cart.save() }
    res.json({ items: [] })
  } catch (err) { next(err) }
})

module.exports = router
