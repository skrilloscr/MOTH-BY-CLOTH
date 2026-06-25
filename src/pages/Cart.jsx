import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart()

  const shipping = subtotal >= 200 ? 0 : 20
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-brand-black flex flex-col items-center justify-center text-center px-4">
        <svg className="w-12 h-12 text-brand-border mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="font-display text-brand-cream text-2xl font-bold mb-2 tracking-wider uppercase">Your cart is empty</h2>
        <p className="text-brand-gold text-xs tracking-widest uppercase mb-8">Add some pieces to get started.</p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-2">Review</p>
          <h1 className="font-display text-brand-cream text-2xl font-bold uppercase tracking-wider">
            Shopping Cart <span className="text-brand-gold text-lg font-normal">({items.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-px">
            {items.map((item) => (
              <div key={item.key} className="flex gap-5 bg-brand-surface border border-brand-border p-5">
                <Link to={`/products/${item.product._id || item.product.id}`} className="flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover bg-brand-surface2 opacity-90"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[9px] text-brand-gold tracking-[0.25em] uppercase">{item.product.category}</p>
                      <Link to={`/products/${item.product._id || item.product.id}`} className="text-sm font-medium text-brand-cream hover:text-brand-gold transition-colors tracking-wide mt-0.5 block">
                        {item.product.name}
                      </Link>
                      <p className="text-[9px] text-brand-gold/60 tracking-widest mt-1 uppercase">
                        Size: {item.size} · <span className="capitalize">{item.color}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-brand-border hover:text-brand-gold flex-shrink-0 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-brand-border">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-brand-gold hover:text-brand-cream hover:bg-brand-surface2 transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-xs text-brand-cream border-x border-brand-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-brand-gold hover:text-brand-cream hover:bg-brand-surface2 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-medium text-brand-cream">
                      AED {item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <button onClick={clearCart} className="text-[9px] text-brand-gold/60 hover:text-brand-gold tracking-[0.25em] uppercase transition-colors underline">
                Clear Cart
              </button>
              <Link to="/products" className="text-[9px] text-brand-gold/60 hover:text-brand-gold tracking-[0.25em] uppercase transition-colors underline">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-brand-surface border border-brand-border p-6 sticky top-24">
              <h2 className="text-[9px] font-semibold text-brand-cream tracking-[0.3em] uppercase mb-6">Order Summary</h2>

              <div className="space-y-3 text-xs tracking-wider">
                <div className="flex justify-between text-brand-gold">
                  <span className="uppercase tracking-[0.2em]">Subtotal</span>
                  <span>AED {subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-gold">
                  <span className="uppercase tracking-[0.2em]">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-brand-cream">Free</span> : `AED ${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[9px] text-brand-gold/50 tracking-wider">
                    Add AED {200 - subtotal} more for free shipping
                  </p>
                )}
                <div className="border-t border-brand-border pt-4 mt-2 flex justify-between text-brand-cream">
                  <span className="text-[9px] font-semibold tracking-[0.25em] uppercase">Total</span>
                  <span className="font-semibold">AED {total}</span>
                </div>
              </div>

              <Link to="/checkout" className="block btn-primary text-center mt-7 py-4">
                Proceed to Checkout
              </Link>

              <div className="mt-5 flex items-center justify-center gap-2 text-[9px] text-brand-gold/40 tracking-widest uppercase">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
