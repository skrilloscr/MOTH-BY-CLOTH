import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import api from '../utils/api'
import ProductCard from '../components/ProductCard'
import HeroCanvas from '../components/HeroCanvas'

const categories = [
  { id: 'men',   label: 'Men',   sub: "Men's Collection",   image: '/images/category-men.png' },
  { id: 'women', label: 'Women', sub: "Women's Collection", image: '/images/category-women.png' },
]

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, 80])

  useEffect(() => {
    api.get('/products?featured=true&limit=4').then((r) => setFeatured(r.data))
    api.get('/products?isNew=true&limit=4').then((r) => setNewArrivals(r.data))
  }, [])

  return (
    <div className="bg-brand-black">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[620px] flex items-center overflow-hidden">

        {/* Three.js canvas */}
        <HeroCanvas />

        {/* Atmospheric gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/65 to-transparent z-[1] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent z-[1] pointer-events-none" />

        {/* Scan-line texture */}
        <div className="scanlines absolute inset-0 z-[2] pointer-events-none" />

        {/* Horizontal rule accents */}
        <motion.div
          className="absolute left-0 right-0 top-[28%] z-[2] pointer-events-none"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
        </motion.div>
        <motion.div
          className="absolute left-0 right-0 top-[72%] z-[2] pointer-events-none"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 1.4, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'right' }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent" />
        </motion.div>

        {/* Hero content — parallax on scroll */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.div variants={stagger} initial="hidden" animate="visible">

            <motion.p variants={heroItem} className="text-brand-gold text-[10px] tracking-[0.55em] uppercase mb-5 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-brand-gold/60" />
              New Collection 2026
            </motion.p>

            <motion.h1
              variants={heroItem}
              className="font-display text-brand-cream text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight max-w-xl uppercase"
            >
              Cloth<br />
              <span className="text-shimmer">By Moth</span>
            </motion.h1>

            <motion.p variants={heroItem} className="text-brand-gold/75 mt-6 text-xs tracking-[0.35em] max-w-xs leading-relaxed uppercase">
              Minimal · Timeless · Refined · Mysterious
            </motion.p>

            <motion.div variants={heroItem} className="mt-10 flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/products" className="btn-primary px-8 py-4 text-xs animate-glow-pulse inline-block">
                  Shop Now
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              variants={heroItem}
              className="mt-16 flex items-center gap-3"
            >
              <div className="flex flex-col gap-1">
                <motion.div
                  className="w-px h-8 bg-brand-gold/40 mx-auto"
                  animate={{ scaleY: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <span className="text-brand-gold/40 text-[8px] tracking-[0.4em] uppercase">Scroll</span>
            </motion.div>

          </motion.div>
        </motion.div>

        {/* Corner bracket — top right */}
        <motion.div
          className="absolute top-8 right-8 w-12 h-12 z-10 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-full h-px bg-brand-gold/30" />
          <div className="absolute top-0 right-0 w-px h-full bg-brand-gold/30" />
        </motion.div>
        <motion.div
          className="absolute bottom-8 left-8 w-12 h-12 z-10 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.6 }}
        >
          <div className="absolute bottom-0 left-0 w-full h-px bg-brand-gold/20" />
          <div className="absolute bottom-0 left-0 w-px h-full bg-brand-gold/20" />
        </motion.div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────────── */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-2 flex items-center gap-2">
              <span className="w-4 h-px bg-brand-gold/60 inline-block" />Explore
            </p>
            <h2 className="font-display text-brand-cream text-2xl font-bold tracking-wider uppercase">
              Shop by Category
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.01 }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="group relative overflow-hidden aspect-[3/4] bg-brand-surface block"
                style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)' }}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
                {/* Grid overlay */}
                <div className="absolute inset-0 grid-bg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/20 to-transparent" />

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-8 h-8">
                  <div className="absolute top-0 right-0 w-full h-px bg-brand-gold/50 group-hover:bg-brand-gold/80 transition-colors duration-300" />
                  <div className="absolute top-0 right-0 w-px h-full bg-brand-gold/50 group-hover:bg-brand-gold/80 transition-colors duration-300" />
                </div>

                <div className="absolute bottom-8 left-8">
                  <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-1 opacity-70">{cat.sub}</p>
                  <h3 className="font-display text-brand-cream text-4xl font-bold uppercase tracking-wider">
                    {cat.label}
                  </h3>
                  <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <div className="h-px w-6 bg-brand-gold" />
                    <span className="text-brand-gold text-[9px] tracking-[0.35em] uppercase">Shop Now</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Featured Products ──────────────────────────────────────────────────── */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-2 flex items-center gap-2">
              <span className="w-4 h-px bg-brand-gold/60 inline-block" />Curated
            </p>
            <h2 className="font-display text-brand-cream text-2xl font-bold tracking-wider uppercase">
              Featured Pieces
            </h2>
          </div>
          <Link to="/products" className="text-[9px] text-brand-gold hover:text-brand-cream tracking-[0.3em] uppercase transition-colors border-b border-brand-gold/50 hover:border-brand-cream pb-0.5">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {featured.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      </motion.section>

      {/* ── Promo Banner ──────────────────────────────────────────────────────── */}
      <motion.section
        className="relative border-t border-b border-brand-border py-24 bg-brand-surface overflow-hidden"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        {/* Animated glow orbs */}
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-gold/5 blur-3xl animate-glow-pulse pointer-events-none" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-brand-gold/5 blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold text-[9px] tracking-[0.5em] uppercase mb-4">Limited Time</p>
          <h2 className="font-display text-brand-cream text-4xl md:text-6xl font-bold uppercase tracking-wide mb-4">
            Launch Drop
          </h2>
          <p className="text-brand-gold/70 text-xs tracking-[0.3em] uppercase mb-10">
            Free delivery across UAE on orders above AED 200
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/products" className="btn-primary px-10 py-4 inline-block">Shop the Edit</Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ── New Arrivals ──────────────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <motion.section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-2 flex items-center gap-2">
                <span className="w-4 h-px bg-brand-gold/60 inline-block" />Just In
              </p>
              <h2 className="font-display text-brand-cream text-2xl font-bold tracking-wider uppercase">
                New Arrivals
              </h2>
            </div>
            <Link to="/products?sort=newest" className="text-[9px] text-brand-gold hover:text-brand-cream tracking-[0.3em] uppercase transition-colors border-b border-brand-gold/50 hover:border-brand-cream pb-0.5">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {newArrivals.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Trust Badges ──────────────────────────────────────────────────────── */}
      <motion.section
        className="relative border-t border-brand-border py-14 bg-brand-surface overflow-hidden"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Free Shipping', sub: 'On orders over AED 200' },
              { label: 'Easy Returns',  sub: '30-day return policy' },
              { label: 'Secure Checkout', sub: 'SSL encrypted payments' },
              { label: '24/7 Support', sub: 'Always here for you' },
            ].map((badge, i) => (
              <motion.div
                key={badge.label}
                className="group border-glow p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <h3 className="text-[9px] font-medium tracking-[0.3em] uppercase text-brand-cream mb-2 group-hover:text-brand-gold transition-colors duration-300">
                  {badge.label}
                </h3>
                <p className="text-[10px] text-brand-gold/60 tracking-wider">{badge.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

    </div>
  )
}
