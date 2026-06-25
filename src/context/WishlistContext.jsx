import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (user) {
      api.get('/wishlist')
        .then((res) => setItems(res.data.items))
        .catch(() => setItems([]))
    } else {
      const saved = localStorage.getItem('wishlist_items')
      setItems(saved ? JSON.parse(saved) : [])
    }
  }, [user])

  useEffect(() => {
    if (!user) localStorage.setItem('wishlist_items', JSON.stringify(items))
  }, [items, user])

  const addToWishlist = async (product) => {
    if (user) {
      const { data } = await api.post('/wishlist', { productId: product._id || product.id })
      setItems(data.items)
    } else {
      setItems((prev) => prev.find((p) => p.id === product.id) ? prev : [...prev, product])
    }
  }

  const removeFromWishlist = async (productId) => {
    if (user) {
      const { data } = await api.delete(`/wishlist/${productId}`)
      setItems(data.items)
    } else {
      setItems((prev) => prev.filter((p) => p.id !== productId))
    }
  }

  const toggleWishlist = (product) => {
    const pid = product._id || product.id
    isInWishlist(pid) ? removeFromWishlist(pid) : addToWishlist(product)
  }

  const isInWishlist = (productId) =>
    items.some((p) => String(p._id || p.id) === String(productId))

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
