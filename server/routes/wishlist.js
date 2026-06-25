const router = require('express').Router()
const Wishlist = require('../models/Wishlist')
const auth = require('../middleware/auth')

// GET /api/wishlist
router.get('/', auth, async (req, res, next) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user.id }).populate('products')
    res.json({ items: wl ? wl.products : [] })
  } catch (err) { next(err) }
})

// POST /api/wishlist — add product
router.post('/', auth, async (req, res, next) => {
  try {
    const { productId } = req.body
    let wl = await Wishlist.findOne({ user: req.user.id })
    if (!wl) wl = new Wishlist({ user: req.user.id, products: [] })

    if (!wl.products.some((p) => p.toString() === productId)) {
      wl.products.push(productId)
      await wl.save()
    }
    await wl.populate('products')
    res.json({ items: wl.products })
  } catch (err) { next(err) }
})

// DELETE /api/wishlist/:productId — remove product
router.delete('/:productId', auth, async (req, res, next) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user.id })
    if (!wl) return res.json({ items: [] })
    wl.products = wl.products.filter((p) => p.toString() !== req.params.productId)
    await wl.save()
    await wl.populate('products')
    res.json({ items: wl.products })
  } catch (err) { next(err) }
})

module.exports = router
