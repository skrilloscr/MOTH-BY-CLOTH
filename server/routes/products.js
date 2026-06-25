const router = require('express').Router()
const Product = require('../models/Product')

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { category, sort, sizes, colors, maxPrice, featured, isNew, limit } = req.query
    const query = {}

    if (category)        query.category = category
    if (featured === 'true') query.featured = true
    if (isNew === 'true')    query.isNew = true
    if (maxPrice)        query.price = { $lte: Number(maxPrice) }
    if (sizes)           query.sizes = { $in: sizes.split(',') }
    if (colors)          query.colors = { $in: colors.split(',') }

    let q = Product.find(query)

    if (sort === 'price-asc')  q = q.sort({ price: 1 })
    else if (sort === 'price-desc') q = q.sort({ price: -1 })
    else if (sort === 'rating')     q = q.sort({ rating: -1 })
    else if (sort === 'newest')     q = q.sort({ isNew: -1, createdAt: -1 })
    else q = q.sort({ featured: -1, createdAt: -1 })

    if (limit) q = q.limit(Number(limit))

    res.json(await q)
  } catch (err) { next(err) }
})

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4)
    res.json({ product, related })
  } catch (err) { next(err) }
})

module.exports = router
