import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw, Star, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import Button from '../components/Button.jsx'
import { fetchProduct, clearProduct } from '../redux/slices/productSlice.js'
import { addToCart } from '../redux/slices/cartSlice.js'
import { loadUser } from '../redux/slices/authSlice.js'
import { generateProductSchema } from '../utils/seo.js'
import { getTransformedUrl } from '../utils/cloudinary.js'
import toast from 'react-hot-toast'
import api from '../utils/api.js'
import ProductCard from '../components/ProductCard.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, loading } = useSelector(state => state.products)
  const { user } = useSelector(state => state.auth)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [related, setRelated] = useState([])
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchProduct(id))
    return () => dispatch(clearProduct())
  }, [id, dispatch])

  useEffect(() => {
    let mounted = true
    api.get(`/products/${id}/related`)
      .then(res => { if (mounted) setRelated(res.data.products || []) })
      .catch(() => {})
    return () => { mounted = false }
  }, [id])

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="spinner w-10 h-10" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-xl font-bold text-white">Product not found</h2>
      <Link to="/products" className="btn-primary mt-4">Browse Products</Link>
    </div>
  )

  const handleAddToCart = () => {
    if (product.stock <= 0) { toast.error('Out of stock'); return }
    dispatch(addToCart({ product, quantity }))
    toast.success('Added to cart!')
  }

  const isWishlisted = Boolean(user?.wishlist?.some(pid => String(pid) === String(product._id)))

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to use wishlist')
      return
    }
    try {
      if (isWishlisted) {
        await api.delete(`/users/wishlist/${product._id}`)
        toast.success('Removed from wishlist')
      } else {
        await api.post('/users/wishlist', { productId: product._id })
        toast.success('Added to wishlist')
      }
      dispatch(loadUser())
    } catch (err) {
      toast.error(err.response?.data?.message || 'Wishlist update failed')
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to add a review')
      return
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a review comment')
      return
    }
    setReviewSubmitting(true)
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment.trim() })
      toast.success('Review added!')
      setReviewComment('')
      setReviewRating(5)
      setActiveTab('reviews')
      dispatch(fetchProduct(id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const mainImage = product.images?.[selectedImage]?.url
    ? getTransformedUrl(product.images[selectedImage].url, { width: 600, height: 600 })
    : 'https://via.placeholder.com/600x600?text=No+Image'

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <>
      <SEO
        title={product.name}
        description={product.description?.substring(0, 160)}
        schema={generateProductSchema(product)}
      />

      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-400 transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-primary-400 transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-40">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="glass-card p-4 aspect-square overflow-hidden rounded-2xl">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i ? 'border-primary-500' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={getTransformedUrl(img.url, { width: 80, height: 80 })}
                        alt={`View ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">{product.category}</span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1 leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.numReviews > 0 && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                      ))}
                    </div>
                    <span className="text-slate-400 text-sm">{product.ratings?.toFixed(1)} ({product.numReviews} reviews)</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="glass-card p-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">₹{product.price?.toLocaleString('en-IN')}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-slate-500 line-through text-lg">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                      <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">{discount}% OFF</span>
                    </>
                  )}
                </div>
                <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
                </p>
              </div>

              {/* Quantity */}
              <div>
                <label className="label">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-bold text-lg w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-1 justify-center py-4">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <button onClick={toggleWishlist} className="btn-secondary p-4" aria-label="Add to wishlist">
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-400 fill-red-400' : ''}`} />
                </button>
                <button className="btn-secondary p-4">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, text: 'Free Delivery over ₹499' },
                  { icon: RefreshCw, text: '7 Day Returns' },
                  { icon: Shield, text: 'Secure Payment' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="glass-card p-3 flex flex-col items-center gap-2 text-center">
                    <Icon className="w-5 h-5 text-primary-400" />
                    <span className="text-slate-400 text-xs">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex gap-1 border-b border-white/10 mb-8">
              {['description', 'specifications', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="glass-card p-6">
                {product.specifications?.length > 0 ? (
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specifications.map((spec, i) => (
                        <tr key={i} className="table-row">
                          <td className="py-3 pr-6 text-slate-400 w-1/3">{spec.key}</td>
                          <td className="py-3 text-slate-200">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-slate-500">No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {product.reviews?.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review, i) => (
                      <div key={i} className="glass-card p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                              <span className="text-primary-400 text-sm font-bold">{review.name?.[0]}</span>
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{review.name}</p>
                              <p className="text-slate-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
                )}

                <div className="mt-8 glass-card p-6">
                  <h3 className="text-white font-semibold mb-4">Write a review</h3>
                  {!user ? (
                    <p className="text-slate-500 text-sm">Please login to add a review.</p>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="label">Rating</label>
                        <select
                          className="input-field"
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                        >
                          {[5, 4, 3, 2, 1].map(v => (
                            <option key={v} value={v}>{v} Star{v > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label">Comment</label>
                        <textarea
                          className="input-field resize-none h-28"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience…"
                        />
                      </div>
                      <Button type="submit" loading={reviewSubmitting} className="justify-center">
                        Submit Review
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-16">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="section-title">Related Products</h2>
                  <p className="text-slate-500 text-sm mt-1">More in {product.category}</p>
                </div>
                <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="btn-ghost text-sm">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
