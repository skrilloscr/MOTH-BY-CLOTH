const serverless = require('serverless-http')
const express = require('express')
const mongoose = require('mongoose')

mongoose.set('bufferCommands', false)

let handler = null

async function connectDB() {
  if (mongoose.connection.readyState === 1) return
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  })
}

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
  try {
    await connectDB()
  } catch (err) {
    console.error('DB connect error:', err.message)
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) }
  }
  if (!handler) handler = buildApp()
  return handler(event, context)
}
