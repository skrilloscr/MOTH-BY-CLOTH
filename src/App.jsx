import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Wishlist from './pages/Wishlist'

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<PageTransition><Home /></PageTransition>} />
        <Route path="/products"  element={<PageTransition><Products /></PageTransition>} />
        <Route path="/products/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/cart"      element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout"  element={<PageTransition><ProtectedRoute><Checkout /></ProtectedRoute></PageTransition>} />
        <Route path="/login"     element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register"  element={<PageTransition><Register /></PageTransition>} />
        <Route path="/wishlist"  element={<PageTransition><Wishlist /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
