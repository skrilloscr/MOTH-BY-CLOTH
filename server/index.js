require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

connectDB()

const app = express()
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true)
    else cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth',     require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/cart',     require('./routes/cart'))
app.use('/api/wishlist', require('./routes/wishlist'))
app.use('/api/orders',   require('./routes/orders'))

app.use((err, req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
