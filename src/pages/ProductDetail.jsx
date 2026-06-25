import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'

const colorMap = {
  navy: '#1e3a5f', olive: '#6b7c3c', camel: '#c19a6b', cream: '#fffdd0',
  beige: '#f5f0e8', blush: '#f4a6b0', gray: '#9ca3af', white: '#f3f4f6',
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setProduct(null)
    setRelated([])
    setSelectedSize('')
    setSelectedColor('')
    setQuantity(1)
    api.get(`/products/${id}`)
      .then((r) => { setProduct(r.data.product); setRelated(r.data.related) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-brand-black">
        <p className="text-brand-gold text-xs tracking-widest uppercase animate-pulse">Loading…</p>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-brand-black">
        <h2 className="text-2xl font-bold text-brand-cream mb-2 tracking-wider uppercase">Product Not Found</h2>
        <p className="text-brand-gold text-xs tracking-widest mb-8 uppercase">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    )
  }

  const wishlisted = isInWishlist(product._id)

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return }
    setSizeError(false)
    addToCart(product, selectedSize, selectedColor || product.colors[0], quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[9px] text-brand-gold tracking-[0.25em] uppercase mb-10">
          <Link to="/" className="hover:text-brand-cream transition-colors">Home</Link>
          <span className="text-brand-border">—</span>
          <Link to="/products" className="hover:text-brand-cream transition-colors">Products</Link>
          <span className="text-brand-border">—</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-brand-cream capitalize transition-colors">{product.category}</Link>
          <span className="text-brand-border">—</span>
          <span className="text-brand-cream">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative bg-brand-surface aspect-[4/5]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90" />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-brand-cream text-brand-black text-[9px] px-3 py-1.5 font-medium tracking-[0.2em] uppercase">New</span>
            )}
            {product.originalPrice && (
              <span className="absolute top-4 left-4 bg-brand-gold text-brand-black text-[9px] px-3 py-1.5 font-medium tracking-[0.2em] uppercase">Sale</span>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-[9px] text-brand-gold tracking-[0.35em] uppercase">{product.category} / {product.type}</p>
            <h1 className="font-display text-brand-cream text-3xl font-bold mt-3 uppercase tracking-wider">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((star) => (
                  <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'fill-brand-gold' : 'fill-brand-border'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] text-brand-gold/60 tracking-wider">{product.rating} · {product.reviews} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mt-5 pb-5 border-b border-brand-border">
              <span className="text-2xl font-semibold text-brand-cream">AED {product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-brand-gold/40 line-through">AED {product.originalPrice}</span>
                  <span className="text-xs text-brand-gold tracking-wider">Save AED {product.originalPrice - product.price}</span>
                </>
              )}
            </div>

            <p className="text-brand-gold/70 mt-5 text-sm leading-relaxed tracking-wide">{product.description}</p>

            {/* Color */}
            <div className="mt-7">
              <p className="text-[9px] font-semibold text-brand-cream tracking-[0.25em] uppercase mb-3">
                Colour {selectedColor && <span className="font-normal text-brand-gold capitalize ml-1">— {selectedColor}</span>}
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((color) => (
                  <button key={color} onClick={() => setSelectedColor(color)} title={color}
                    className={`w-7 h-7 border-2 transition-all ${selectedColor === color ? 'border-brand-cream scale-110' : 'border-brand-border hover:border-brand-gold'}`}
                    style={{ backgroundColor: colorMap[color] || color }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-7">
              <p className={`text-[9px] font-semibold tracking-[0.25em] uppercase mb-3 ${sizeError ? 'text-red-400' : 'text-brand-cream'}`}>
                Size {sizeError && <span className="font-normal ml-1">— Please select a size</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false) }}
                    className={`min-w-[2.75rem] px-3 py-2 text-[9px] font-medium border tracking-wider transition-colors ${
                      selectedSize === size
                        ? 'bg-brand-cream text-brand-black border-brand-cream'
                        : 'border-brand-border text-brand-gold hover:border-brand-cream hover:text-brand-cream'
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-7">
              <p className="text-[9px] font-semibold text-brand-cream tracking-[0.25em] uppercase mb-3">Quantity</p>
              <div className="flex items-center border border-brand-border w-fit">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-brand-gold hover:text-brand-cream hover:bg-brand-surface2 transition-colors">−</button>
                <span className="w-10 h-10 flex items-center justify-center text-sm text-brand-cream border-x border-brand-border">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-10 flex items-center justify-center text-brand-gold hover:text-brand-cream hover:bg-brand-surface2 transition-colors">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <button onClick={handleAddToCart}
                className={`flex-1 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-colors ${
                  added ? 'bg-brand-gold text-brand-black' : 'bg-brand-cream text-brand-black hover:bg-brand-gold'
                }`}>
                {added ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
              <button onClick={() => toggleWishlist(product)}
                className={`w-14 border flex items-center justify-center transition-colors ${
                  wishlisted ? 'border-brand-cream bg-brand-cream text-brand-black' : 'border-brand-border text-brand-gold hover:border-brand-cream hover:text-brand-cream'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                <svg className={`w-4 h-4 ${wishlisted ? 'fill-brand-black' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Perks */}
            <div className="mt-8 pt-6 border-t border-brand-border space-y-2.5">
              {['Free shipping across UAE on orders above AED 200', 'Free returns within 30 days', 'In stock — ships within UAE in 1–3 business days'].map((perk) => (
                <p key={perk} className="flex items-center gap-3 text-[10px] text-brand-gold/70 tracking-wider">
                  <span className="w-1 h-1 bg-brand-gold rounded-full flex-shrink-0" />{perk}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 pt-14 border-t border-brand-border">
            <div className="mb-10">
              <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-2">More Like This</p>
              <h2 className="font-display text-brand-cream text-2xl font-bold uppercase tracking-wider">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
