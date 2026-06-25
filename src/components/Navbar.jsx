import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { itemCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/products', label: 'All' },
    { to: '/products?category=men', label: 'Men' },
    { to: '/products?category=women', label: 'Women' },
  ]

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-brand-black/90 backdrop-blur-md border-b border-brand-border/60 shadow-[0_4px_40px_rgba(0,0,0,0.4)]'
          : 'bg-brand-black border-b border-brand-border'
      }`}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center group leading-none select-none">
            <motion.span
              className="font-display text-brand-cream text-xl font-bold tracking-[0.28em] uppercase"
              whileHover={{ color: 'rgb(var(--brand-gold))' }}
              transition={{ duration: 0.2 }}
            >
              Cloth
            </motion.span>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <motion.div
                className="h-px bg-brand-gold"
                initial={{ width: 16 }}
                whileHover={{ width: 24 }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-brand-gold text-[8px] tracking-[0.35em] font-medium uppercase font-display">
                by moth
              </span>
              <motion.div
                className="h-px bg-brand-gold"
                initial={{ width: 16 }}
                whileHover={{ width: 24 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-200 relative group ${
                      isActive ? 'text-brand-cream' : 'text-brand-gold hover:text-brand-cream'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span className={`absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-brand-gold hover:text-brand-cream transition-colors duration-200"
              whileHover={{ scale: 1.15, rotate: 20 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/wishlist" className="relative p-2 text-brand-gold hover:text-brand-cream transition-colors block">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <AnimatePresence>
                  {wishlistItems.length > 0 && (
                    <motion.span
                      key="wishlist-badge"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-brand-cream text-brand-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    >
                      {wishlistItems.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/cart" className="relative p-2 text-brand-gold hover:text-brand-cream transition-colors block">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-brand-cream text-brand-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-xs font-medium text-brand-gold hover:text-brand-cream tracking-wider transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-7 h-7 border border-brand-gold text-brand-gold rounded-full flex items-center justify-center text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </motion.button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-brand-surface border border-brand-border z-10"
                    >
                      <div className="px-4 py-3 text-xs text-brand-gold border-b border-brand-border tracking-wider uppercase">
                        {user.name}
                      </div>
                      <Link to="/wishlist" onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-3 text-xs text-brand-cream hover:bg-brand-surface2 tracking-wider uppercase transition-colors">
                        My Wishlist
                      </Link>
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-xs text-brand-cream hover:bg-brand-surface2 tracking-wider uppercase transition-colors">
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-xs font-medium tracking-[0.15em] uppercase text-brand-gold hover:text-brand-cream transition-colors">
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register" className="btn-primary py-2 px-4">Register</Link>
                </motion.div>
              </div>
            )}

            <motion.button
              className="md:hidden p-2 text-brand-gold hover:text-brand-cream transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-brand-border bg-brand-surface"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link to={link.to} onClick={() => setMenuOpen(false)}
                    className="block text-xs font-medium tracking-[0.2em] uppercase text-brand-gold hover:text-brand-cream transition-colors py-1">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {!user && (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18, duration: 0.3 }}
                  className="space-y-3 pt-2"
                >
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="block text-xs font-medium tracking-[0.2em] uppercase text-brand-gold hover:text-brand-cream py-1 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}
                    className="block btn-primary text-center py-3">
                    Register
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
