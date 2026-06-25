import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const wishlisted = isInWishlist(product.id || product._id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, product.sizes[0], product.colors[0])
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product)
  }

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -7, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      <Link to={`/products/${product.id || product._id}`} className="group block">

        {/* Image container — CSS group-hover used throughout so hover state propagates from card root */}
        <div className="relative overflow-hidden bg-brand-surface aspect-[4/5] border border-brand-border/50 group-hover:border-brand-gold/40 transition-all duration-500"
          style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}>

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />

          {/* Futuristic corner accents */}
          <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-brand-gold/50 z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-brand-gold/25 z-10 pointer-events-none" />

          {/* Glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(184,120,80,0)] group-hover:shadow-[inset_0_0_30px_rgba(184,120,80,0.08)] transition-shadow duration-500 pointer-events-none" />

          {product.isNew && (
            <span className="absolute top-3 left-3 bg-brand-cream text-brand-black text-[9px] px-2.5 py-1 font-medium tracking-[0.2em] uppercase z-10">
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-brand-gold text-brand-black text-[9px] px-2.5 py-1 font-medium tracking-[0.2em] uppercase z-10">
              Sale
            </span>
          )}

          {/* Wishlist — framer-motion only on the button itself */}
          <motion.button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 bg-brand-black/60 border flex items-center justify-center z-10 transition-colors duration-200 ${
              wishlisted ? 'border-brand-cream bg-brand-cream/10' : 'border-brand-border hover:border-brand-gold'
            }`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <svg className={`w-3.5 h-3.5 ${wishlisted ? 'fill-brand-cream stroke-brand-cream' : 'fill-none stroke-brand-gold'}`} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.button>

          {/* Add-to-cart slide — pure CSS group-hover so it responds to card hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={handleAddToCart}
              className="w-full bg-brand-cream text-brand-black py-3 text-xs font-medium tracking-[0.2em] uppercase hover:bg-brand-gold transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 space-y-0.5">
          <p className="text-[9px] text-brand-gold tracking-[0.25em] uppercase">{product.category}</p>
          <h3 className="text-sm font-medium text-brand-cream group-hover:text-brand-gold transition-colors duration-300 tracking-wide leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-medium text-brand-cream">AED {product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-brand-gold/50 line-through">AED {product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className={`w-2.5 h-2.5 ${star <= Math.round(product.rating) ? 'fill-brand-gold' : 'fill-brand-border'}`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[9px] text-brand-gold/60">({product.reviews})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
