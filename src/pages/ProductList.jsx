import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Pagination from '../components/Pagination.jsx'
import { fetchProducts, setFilters } from '../redux/slices/productSlice.js'
import api from '../utils/api.js'

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-ratings', label: 'Top Rated' },
]

export default function ProductList() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, loading, totalProducts, totalPages, currentPage, filters } = useSelector(state => state.products)
  const [filterOpen, setFilterOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchParams.get('keyword') || '')
  const [categories, setCategories] = useState([])

  const page = Number(searchParams.get('page')) || 1
  const category = searchParams.get('category') || ''
  const keyword = searchParams.get('keyword') || ''

  useEffect(() => {
    dispatch(fetchProducts({
      keyword,
      category,
      page,
      limit: 20,
      sort: filters.sort,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    }))
  }, [dispatch, keyword, category, page, filters.sort, filters.minPrice, filters.maxPrice])

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => setCategories([]))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (localSearch) params.set('keyword', localSearch)
    else params.delete('keyword')
    params.delete('page')
    setSearchParams(params)
  }

  const handleCategory = (cat) => {
    const params = new URLSearchParams()
    if (cat) params.set('category', cat)
    setSearchParams(params)
  }

  const handleSort = (sort) => {
    dispatch(setFilters({ sort }))
  }

  const handlePage = (p) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', p)
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <SEO
        title={`${category || 'All Products'} – Sandhaikart`}
        description={`Browse ${category || 'all products'} at Sandhaikart. Quality products with fast delivery across India.`}
      />

      <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-orange-300 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="page-header">{category || 'All Products'}</h1>
              <p className="page-subheader text-black">{totalProducts} products found</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  placeholder="Search..."
                  className="input-field border-black/20 pr-10 py-2 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-400">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Sort */}
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={e => handleSort(e.target.value)}
                  className="input-field border-black/20 py-2 text-sm pr-8 appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-dark-800">{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Filter toggle mobile */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden btn-secondary py-2 px-4 text-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={`${filterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
              <div className="glass-card p-5 space-y-6 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm">Filters</h3>
                  <button
                    onClick={() => {
                      handleCategory('')
                      dispatch(setFilters({ sort: '-createdAt', minPrice: 0, maxPrice: 100000 }))
                    }}
                    className="text-xs text-slate-600 hover:text-slate-800"
                  >
                    Clear all
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="label">Category</h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleCategory('')}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!category ? 'text-primary-400 bg-primary-500/10' : 'text-slate-700 hover:text-black hover:bg-white/5'}`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id || cat.name}
                        onClick={() => handleCategory(cat.name)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${category === cat.name ? 'text-primary-600 bg-primary-500/10' : 'text-slate-700 hover:text-black hover:bg-white/5'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="label">Price Range (₹)</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={e => dispatch(setFilters({ minPrice: Number(e.target.value) || 0 }))}
                        className="input-field py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice === 100000 ? '' : filters.maxPrice}
                        onChange={e => dispatch(setFilters({ maxPrice: Number(e.target.value) || 100000 }))}
                        className="input-field py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Active filters */}
              {(category || keyword) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {category && (
                    <span className="badge text-black/70 border border-black/20 glass text-sm gap-1.5 py-1 px-3">
                      {category}
                      <button onClick={() => handleCategory('')}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {keyword && (
                    <span className="badge text-black border border-black/20 glass text-sm gap-1.5 py-1 px-3">
                      "{keyword}"
                      <button onClick={() => { setLocalSearch(''); setSearchParams(new URLSearchParams()) }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="glass-card aspect-[3/4] animate-pulse" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                  <p className="text-slate-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                className="mt-12"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
