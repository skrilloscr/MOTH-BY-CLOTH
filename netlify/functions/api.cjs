const serverless = require('serverless-http')
const express = require('express')
const mongoose = require('mongoose')
const STATIC_PRODUCTS = require('../../server/data/products.json')

mongoose.set('bufferCommands', false)

// ── DB connection (best-effort) ───────────────────────────────────────────────
let dbReady = false

async function tryConnect() {
  if (dbReady) return true
  if (mongoose.connection.readyState === 1) { dbReady = true; return true }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    })
    // Verify with a ping
    await mongoose.connection.db.admin().ping()
    dbReady = true
    return true
  } catch {
    return false
  }
}

// ── Static product filter (mirrors the Mongoose route logic) ─────────────────
function filterProducts(qs = {}) {
  let list = [...STATIC_PRODUCTS]
  if (qs.category)        list = list.filter(p => p.category === qs.category)
  if (qs.featured === 'true') list = list.filter(p => p.featured)
  if (qs.isNew === 'true')    list = list.filter(p => p.isNew)
  if (qs.maxPrice)        list = list.filter(p => p.price <= Number(qs.maxPrice))
  if (qs.limit)           list = list.slice(0, Number(qs.limit))
  return list
}

// ── Express app ───────────────────────────────────────────────────────────────
let handler = null

function buildApp() {
  const app = express()
  app.use(express.json())

  app.get('/api/health', (req, res) => res.json({ ok: true, db: dbReady }))

  // Products — served from DB when connected, static JSON otherwise
  app.get('/api/products', async (req, res) => {
    if (dbReady) {
      return require('../../server/routes/products').handle
        ? require('../../server/routes/products')(req, res)
        : res.json(filterProducts(req.query))
    }
    res.json(filterProducts(req.query))
  })

  app.get('/api/products/:id', (req, res) => {
    const product = STATIC_PRODUCTS.find(p => p._id === req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    const related = STATIC_PRODUCTS.filter(p => p.category === product.category && p._id !== product._id)
    res.json({ product, related })
  })

  app.use('/api/auth',     require('../../server/routes/auth'))
  app.use('/api/cart',     require('../../server/routes/cart'))
  app.use('/api/wishlist', require('../../server/routes/wishlist'))
  app.use('/api/orders',   require('../../server/routes/orders'))

  app.use((err, req, res, _next) => {
    console.error(err.stack)
    res.status(500).json({ message: err.message || 'Server error' })
  })

  return serverless(app)
}

// ── Lambda entry point ────────────────────────────────────────────────────────
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  // Fire-and-forget DB connect — products will use static fallback if it fails
  tryConnect().catch(() => {})

  if (!handler) handler = buildApp()
  return handler(event, context)
}
