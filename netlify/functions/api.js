const serverless = require('serverless-http')
const express = require('express')
const mongoose = require('mongoose')

let handler = null
let isConnected = false

function buildApp() {
  const app = express()
  app.use(express.json())

  app.use('/api/auth',     require('../../server/routes/auth'))
  app.use('/api/products', require('../../server/routes/products'))
  app.use('/api/cart',     require('../../server/routes/cart'))
  app.use('/api/wishlist', require('../../server/routes/wishlist'))
  app.use('/api/orders',   require('../../server/routes/orders'))

  app.use((err, req, res, _next) => {
    console.error(err.stack)
    res.status(500).json({ message: err.message || 'Server error' })
  })

  return serverless(app)
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI)
    isConnected = true
  }

  if (!handler) handler = buildApp()
  return handler(event, context)
}
