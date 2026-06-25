import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex flex-col mb-5">
              <span className="font-display text-brand-cream text-lg font-bold tracking-[0.28em] uppercase">Cloth</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-px w-4 bg-brand-gold" />
                <span className="text-brand-gold text-[8px] tracking-[0.35em] font-medium uppercase font-display">by moth</span>
                <div className="h-px w-4 bg-brand-gold" />
              </div>
            </div>
            <p className="text-xs text-brand-gold/70 leading-relaxed tracking-wide">
              Minimal. Timeless. Refined.<br />Mysterious.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-brand-cream text-xs font-semibold tracking-[0.25em] uppercase mb-5">Shop</h3>
            <ul className="space-y-3 text-xs tracking-wider">
              <li><Link to="/products?category=men" className="text-brand-gold hover:text-brand-cream transition-colors">Men</Link></li>
              <li><Link to="/products?category=women" className="text-brand-gold hover:text-brand-cream transition-colors">Women</Link></li>
              <li><Link to="/products?category=kids" className="text-brand-gold hover:text-brand-cream transition-colors">Kids</Link></li>
              <li><Link to="/products?sort=newest" className="text-brand-gold hover:text-brand-cream transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-brand-cream text-xs font-semibold tracking-[0.25em] uppercase mb-5">Help</h3>
            <ul className="space-y-3 text-xs tracking-wider">
              {['Sizing Guide', 'Shipping & Returns', 'FAQ', 'Contact Us'].map((item) => (
                <li key={item}>
                  <span className="text-brand-gold hover:text-brand-cream transition-colors cursor-default">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-1 text-[10px] text-brand-gold/50 tracking-wider">
              <p>Free delivery within UAE</p>
              <p>Orders above AED 200</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-brand-cream text-xs font-semibold tracking-[0.25em] uppercase mb-5">Stay in the Loop</h3>
            <p className="text-xs text-brand-gold/70 leading-relaxed mb-4 tracking-wide">
              New drops, limited editions, and early access — straight to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-brand-surface2 border border-brand-border text-brand-cream text-xs px-3 py-2.5 focus:outline-none focus:border-brand-gold transition-colors placeholder-brand-gold/30"
              />
              <button className="bg-brand-cream text-brand-black px-4 py-2.5 text-xs font-medium tracking-widest uppercase hover:bg-brand-gold transition-colors">
                Join
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              {['IG', 'TW', 'FB'].map((s) => (
                <span key={s} className="w-8 h-8 border border-brand-border flex items-center justify-center text-[9px] text-brand-gold tracking-widest hover:border-brand-cream hover:text-brand-cream transition-colors cursor-pointer font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-brand-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-brand-gold/50 tracking-widest uppercase">
          <p>&copy; 2026 Cloth by Moth. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-brand-gold transition-colors cursor-default">Privacy Policy</span>
            <span className="hover:text-brand-gold transition-colors cursor-default">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
