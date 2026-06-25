const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

const signToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })
    if (await User.findOne({ email })) return res.status(400).json({ message: 'An account with this email already exists.' })

    const user = await User.create({ name, email, password })
    res.status(201).json({ user, token: signToken(user) })
  } catch (err) { next(err) }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    res.json({ user, token: signToken(user) })
  } catch (err) { next(err) }
})

// GET /api/auth/me
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) { next(err) }
})

module.exports = router
