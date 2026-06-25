import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import ProductCard from '../components/ProductCard'

const ALL_COLORS = ['white', 'black', 'gray', 'navy', 'blue', 'red', 'green', 'beige', 'olive', 'pink', 'cream', 'camel']

const colorMap = {
  navy: '#1e3a5f', olive: '#6b7c3c', camel: '#c19a6b', cream: '#fffdd0',
  beige: '#f5f0e8', blush: '#f4a6b0', gray: '#9ca3af', white: '#f3f4f6',
}

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const category      = searchParams.get('category') || ''
  const sort          = searchParams.get('sort') || 'featured'
  const selectedSizes = searchParams.get('sizes') ? searchParams.get('sizes').split(',') : []
  const selectedColors = searchParams.get('colors') ? searchParams.get('colors').split(',') : []
  const maxPrice      = Number(searchParams.get('maxPrice')) || 500

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const toggleArray = (key, current, value) => {
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    setParam(key, next.join(','))
  }

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category)              params.set('category', category)
    if (sort)                  params.set('sort', sort)
    if (selectedSizes.length)  params.set('sizes', selectedSizes.join(','))
    if (selectedColors.length) params.set('colors', selectedColors.join(','))
    if (maxPrice < 500)        params.set('maxPrice', maxPrice)

    api.get(`/products?${params}`)
      .then((r) => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category, sort, searchParams.get('sizes'), searchParams.get('colors'), maxPrice])

  const clearFilters = () => setSearchParams(category ? { category } : {})
  const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0 || maxPrice < 500

  const CATS = [
    { value: '', label: 'All' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
  ]

  return (
    <div className="bg-brand-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-8"
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
        >
          <div>
            <p className="text-brand-gold text-[9px] tracking-[0.4em] uppercase mb-2 flex items-center gap-2">
              <span className="w-4 h-px bg-brand-gold/60 inline-block" />Discover
            </p>
            <h1 className="font-display text-brand-cream text-2xl font-bold tracking-wider uppercase">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection` : 'All Products'}
            </h1>
            <p className="text-brand-gold/60 text-xs mt-1 tracking-widest">{products.length} pieces</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden flex items-center gap-2 border border-brand-border text-brand-gold px-4 py-2 text-[9px] tracking-[0.25em] uppercase hover:border-brand-cream hover:text-brand-cream transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              Filters
            </motion.button>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="bg-brand-surface border border-brand-border text-brand-cream px-3 py-2 text-[10px] tracking-widest focus:outline-none focus:border-brand-gold uppercase transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex gap-2 mb-8 flex-wrap"
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          {CATS.map((cat, i) => (
            <motion.button
              key={cat.value}
              onClick={() => setParam('category', cat.value)}
              className={`px-5 py-2 text-[9px] font-medium tracking-[0.25em] uppercase border transition-colors duration-200 ${
                category === cat.value
                  ? 'bg-brand-cream text-brand-black border-brand-cream'
                  : 'border-brand-border text-brand-gold hover:border-brand-cream hover:text-brand-cream'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        <div className="flex gap-10">
          {/* Filter Sidebar */}
          <motion.aside
            className={`w-52 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden'} md:block`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[9px] font-semibold text-brand-cream tracking-[0.3em] uppercase">Filters</h2>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-[9px] text-brand-gold/60 hover:text-brand-cream tracking-wider uppercase transition-colors underline">
                      Clear
                    </button>
                  )}
                </div>

                <div className="mb-8 border-b border-brand-border pb-8">
                  <h3 className="text-[9px] font-semibold text-brand-cream tracking-[0.25em] uppercase mb-4">
                    Max Price <span className="text-brand-gold font-normal ml-1">AED {maxPrice}</span>
                  </h3>
                  <input type="range" min={0} max={500} step={25} value={maxPrice}
                    onChange={(e) => setParam('maxPrice', e.target.value)}
                    className="w-full accent-brand-gold" />
                  <div className="flex justify-between text-[9px] text-brand-gold/50 mt-1 tracking-widest">
                    <span>AED 0</span><span>AED 500</span>
                  </div>
                </div>

                <div className="mb-8 border-b border-brand-border pb-8">
                  <h3 className="text-[9px] font-semibold text-brand-cream tracking-[0.25em] uppercase mb-4">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => toggleArray('sizes', selectedSizes, size)}
                        className={`w-9 h-9 text-[9px] font-medium border tracking-wider transition-colors ${
                          selectedSizes.includes(size)
                            ? 'bg-brand-cream text-brand-black border-brand-cream'
                            : 'border-brand-border text-brand-gold hover:border-brand-cream hover:text-brand-cream'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-[9px] font-semibold text-brand-cream tracking-[0.25em] uppercase mb-4">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {ALL_COLORS.map((color) => (
                      <motion.button
                        key={color}
                        onClick={() => toggleArray('colors', selectedColors, color)}
                        title={color}
                        className={`w-7 h-7 border-2 transition-all ${
                          selectedColors.includes(color) ? 'border-brand-cream scale-110' : 'border-transparent hover:border-brand-gold'
                        }`}
                        style={{ backgroundColor: colorMap[color] || color }}
                        whileHover={{ scale: selectedColors.includes(color) ? 1.1 : 1.15 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>
          </motion.aside>

          {/* Product Grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <motion.p
                    className="text-brand-gold text-xs tracking-widest uppercase"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Loading…
                  </motion.p>
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <p className="text-brand-gold text-xs tracking-widest uppercase mb-6">No products match your filters</p>
                  <motion.button
                    onClick={clearFilters}
                    className="btn-primary text-xs py-3 px-8"
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
