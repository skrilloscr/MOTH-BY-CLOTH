import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [shipping, setShipping] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName:  user?.name?.split(' ')[1] || '',
    email:     user?.email || '',
    address: '', city: '', emirate: '', zip: '', country: 'AE',
  })

  const [payment, setPayment] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' })

  const shippingCost = subtotal >= 200 ? 0 : 20
  const total = subtotal + shippingCost

  const handleShipping = (e) => setShipping((p) => ({ ...p, [e.target.name]: e.target.value }))
  const handlePayment  = (e) => setPayment((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const orderItems = items.map((i) => ({
        product:  i.product._id || i.product.id,
        name:     i.product.name,
        image:    i.product.image,
        price:    i.product.price,
        size:     i.size,
        color:    i.color,
        quantity: i.quantity,
      }))

      await api.post('/orders', { items: orderItems, shipping, subtotal, shippingCost, total })
      clearCart()
      setStep('success')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-[70vh] bg-brand-black flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 border border-brand-gold flex items-center justify-center mb-8">
          <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-4">Confirmed</p>
        <h1 className="font-display text-brand-cream text-3xl font-bold uppercase tracking-wider mb-3">Order Placed</h1>
        <p className="text-brand-gold/70 text-xs tracking-widest mb-1 uppercase">Thank you, {user?.name}</p>
        <p className="text-brand-gold/50 text-xs tracking-wider mb-10">Confirmation sent to {shipping.email}</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
          <Link to="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    )
  }

  const labelClass = 'block text-[9px] font-medium text-brand-gold tracking-[0.25em] uppercase mb-2'
  const inputClass = 'input-field text-sm'

  return (
    <div className="bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-2">Almost There</p>
          <h1 className="font-display text-brand-cream text-2xl font-bold uppercase tracking-wider">Checkout</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-800 bg-red-900/20 text-red-400 text-xs tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">

              {/* Shipping */}
              <section>
                <h2 className="text-[9px] font-semibold text-brand-cream tracking-[0.3em] uppercase mb-6 pb-3 border-b border-brand-border">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input name="firstName" required value={shipping.firstName} onChange={handleShipping} className={inputClass} placeholder="Alex" />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input name="lastName" required value={shipping.lastName} onChange={handleShipping} className={inputClass} placeholder="Smith" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Email</label>
                    <input name="email" type="email" required value={shipping.email} onChange={handleShipping} className={inputClass} placeholder="you@example.com" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Street Address</label>
                    <input name="address" required value={shipping.address} onChange={handleShipping} className={inputClass} placeholder="123 Main Street" />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input name="city" required value={shipping.city} onChange={handleShipping} className={inputClass} placeholder="New York" />
                  </div>
                  <div>
                    <label className={labelClass}>Emirate</label>
                    <select name="emirate" required value={shipping.emirate} onChange={handleShipping} className={inputClass + ' bg-brand-surface'}>
                      <option value="">Select Emirate</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                      <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                      <option value="Fujairah">Fujairah</option>
                      <option value="Umm Al Quwain">Umm Al Quwain</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>PO Box (optional)</label>
                    <input name="zip" value={shipping.zip} onChange={handleShipping} className={inputClass} placeholder="12345" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Country</label>
                    <select name="country" value={shipping.country} onChange={handleShipping} className={inputClass + ' bg-brand-surface'}>
                      <option value="AE">United Arab Emirates</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-[9px] font-semibold text-brand-cream tracking-[0.3em] uppercase mb-6 pb-3 border-b border-brand-border">
                  Payment Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Name on Card</label>
                    <input name="cardName" required value={payment.cardName} onChange={handlePayment} className={inputClass} placeholder="Alex Smith" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Card Number</label>
                    <input name="cardNumber" required value={payment.cardNumber} onChange={handlePayment} className={inputClass} placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div>
                    <label className={labelClass}>Expiry</label>
                    <input name="expiry" required value={payment.expiry} onChange={handlePayment} className={inputClass} placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div>
                    <label className={labelClass}>CVV</label>
                    <input name="cvv" required value={payment.cvv} onChange={handlePayment} className={inputClass} placeholder="123" maxLength={4} />
                  </div>
                </div>
                <p className="text-[9px] text-brand-gold/40 mt-3 tracking-wider">Demo app — no real payments are processed.</p>
              </section>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-brand-surface border border-brand-border p-6 sticky top-24">
                <h2 className="text-[9px] font-semibold text-brand-cream tracking-[0.3em] uppercase mb-5">Order Summary</h2>
                <div className="space-y-4 mb-5">
                  {items.map((item) => (
                    <div key={item.key} className="flex gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-12 object-cover bg-brand-surface2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-brand-cream truncate tracking-wide">{item.product.name}</p>
                        <p className="text-[9px] text-brand-gold/60 tracking-wider uppercase mt-0.5">{item.size} · Qty {item.quantity}</p>
                        <p className="text-xs text-brand-cream mt-0.5">AED {item.product.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-border pt-4 space-y-2 text-xs tracking-wider">
                  <div className="flex justify-between text-brand-gold">
                    <span className="uppercase tracking-[0.2em]">Subtotal</span>
                    <span>AED {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-brand-gold">
                    <span className="uppercase tracking-[0.2em]">Shipping</span>
                    <span>{shippingCost === 0 ? <span className="text-brand-cream">Free</span> : `AED ${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between text-brand-cream border-t border-brand-border pt-3 mt-1">
                    <span className="text-[9px] font-semibold tracking-[0.25em] uppercase">Total</span>
                    <span className="font-semibold">AED {total}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-4 mt-6 disabled:opacity-60">
                  {loading ? 'Processing…' : `Place Order · AED ${total}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
