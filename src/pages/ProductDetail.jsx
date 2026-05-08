import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw, Star, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import Button from '../components/Button.jsx'
import { fetchProduct, clearProduct } from '../redux/slices/productSlice.js'
import { addToCart } from '../redux/slices/cartSlice.js'
import { generateProductSchema } from '../utils/seo.js'
import { getTransformedUrl } from '../utils/cloudinary.js'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, loading } = useSelector(state => state.products)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    dispatch(fetchProduct(id))
    return () => dispatch(clearProduct())
  }, [id, dispatch])

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
                <button className="btn-secondary p-4">
                  <Heart className="w-5 h-5" />
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
