import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

// Normalise API cart item to the shape Cart.jsx already expects
const toLocal = (item) => ({
  key: String(item._id),
  product: item.product,
  size: item.size,
  color: item.color,
  quantity: item.quantity,
})

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (user) {
      api.get('/cart')
        .then((res) => setItems(res.data.items.map(toLocal)))
        .catch(() => setItems([]))
    } else {
      const saved = localStorage.getItem('cart_items')
      setItems(saved ? JSON.parse(saved) : [])
    }
  }, [user])

  useEffect(() => {
    if (!user) localStorage.setItem('cart_items', JSON.stringify(items))
  }, [items, user])

  const addToCart = async (product, size, color, quantity = 1) => {
    if (user) {
      const { data } = await api.post('/cart', { productId: product._id || product.id, size, color, quantity })
      setItems(data.items.map(toLocal))
    } else {
      setItems((prev) => {
        const key = `${product.id}-${size}-${color}`
        const existing = prev.find((i) => i.key === key)
        if (existing) return prev.map((i) => i.key === key ? { ...i, quantity: i.quantity + quantity } : i)
        return [...prev, { key, product, size, color, quantity }]
      })
    }
  }

  const removeFromCart = async (key) => {
    if (user) {
      const { data } = await api.delete(`/cart/${key}`)
      setItems(data.items.map(toLocal))
    } else {
      setItems((prev) => prev.filter((i) => i.key !== key))
    }
  }

  const updateQuantity = async (key, quantity) => {
    if (quantity < 1) return removeFromCart(key)
    if (user) {
      const { data } = await api.put(`/cart/${key}`, { quantity })
      setItems(data.items.map(toLocal))
    } else {
      setItems((prev) => prev.map((i) => i.key === key ? { ...i, quantity } : i))
    }
  }

  const clearCart = async () => {
    if (user) await api.delete('/cart')
    setItems([])
    if (!user) localStorage.removeItem('cart_items')
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal  = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
