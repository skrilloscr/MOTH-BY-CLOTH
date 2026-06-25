import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-brand-black flex flex-col items-center justify-center text-center px-4">
        <svg className="w-12 h-12 text-brand-border mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 className="font-display text-brand-cream text-2xl font-bold mb-2 tracking-wider uppercase">Your wishlist is empty</h2>
        <p className="text-brand-gold text-xs tracking-widest uppercase mb-8">Save pieces you love to revisit later.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-2">Saved</p>
          <h1 className="font-display text-brand-cream text-2xl font-bold uppercase tracking-wider">
            My Wishlist <span className="text-brand-gold text-lg font-normal">({items.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {items.map((product) => (
            <div key={product.id} className="group">
              <div className="relative bg-brand-surface aspect-[4/5] overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-brand-black/60 border border-brand-border flex items-center justify-center hover:border-brand-cream transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-3.5 h-3.5 fill-brand-cream" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                    className="w-full bg-brand-cream text-brand-black py-3 text-[9px] font-medium tracking-[0.2em] uppercase hover:bg-brand-gold transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <Link to={`/products/${product.id}`}>
                  <p className="text-[9px] text-brand-gold tracking-[0.25em] uppercase">{product.category}</p>
                  <h3 className="text-sm font-medium text-brand-cream mt-0.5 hover:text-brand-gold transition-colors tracking-wide">{product.name}</h3>
                  <p className="text-sm font-medium text-brand-cream mt-1">AED {product.price}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
