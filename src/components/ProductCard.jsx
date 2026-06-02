import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { addToCart } from '../redux/slices/cartSlice.js'
import { loadUser } from '../redux/slices/authSlice.js'
import toast from 'react-hot-toast'
import { getTransformedUrl } from '../utils/cloudinary.js'
import api from '../utils/api.js'
import { useEffect, useMemo, useState } from 'react'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const [wishOverride, setWishOverride] = useState(null) // null | boolean

  useEffect(() => {
    setWishOverride(null)
  }, [user?._id, product?._id])

  const isWishlisted = useMemo(() => {
    if (wishOverride !== null) return wishOverride
    return Boolean(user?.wishlist?.some(pid => String(pid) === String(product._id)))
  }, [wishOverride, user?.wishlist, product?._id])

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock <= 0) {
      toast.error('Out of stock')
      return
    }
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success(`${product.name.substring(0, 20)}... added to cart`)
  }

  const toggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('Please login to use wishlist')
      return
    }
    const next = !isWishlisted
    setWishOverride(next)
    try {
      if (next) {
        await api.post('/users/wishlist', { productId: product._id })
        toast.success('Added to wishlist')
      } else {
        await api.delete(`/users/wishlist/${product._id}`)
        toast.success('Removed from wishlist')
      }
      dispatch(loadUser())
    } catch (err) {
      setWishOverride(null)
      toast.error(err.response?.data?.message || 'Wishlist update failed')
    }
  }

  const imageUrl = product.images?.[0]?.url
    ? getTransformedUrl(product.images[0].url, { width: 400, height: 400 })
    : 'https://via.placeholder.com/400x400?text=No+Image'

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link to={`/products/${product._id}`} className="group block"> 
      <div className="glass-card overflow-hidden h-full flex flex-col border border-orange-400/30">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-fit bg-white/5 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge bg-primary-500 text-white text-xs px-2 py-0.5">
                -{discount}%
              </span>
            )}
            {product.stock <= 0 && (
              <span className="badge bg-red-500/80 text-white text-xs">
                Out of Stock
              </span>
            )}
            {product.isFeatured && (
              <span className="badge bg-yellow-500/90 text-dark-900 text-xs font-semibold">
                Featured
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
            <button
              onClick={toggleWishlist}
              className={`w-8 h-8 glass rounded-lg flex items-center justify-center transition-colors ${
                isWishlisted ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-400' : ''}`} />
            </button>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full btn-primary text-white justify-center py-2 text-sm rounded-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="text-xs text-primary-700 font-bold uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="text-slate-600 font-medium text-sm leading-snug group-hover:text-white group-hover:bg-transparent/40 truncate rounded-lg p-2 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
                  />
                ))}
              </div>
              <span className="text-slate-500 text-xs">({product.numReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto pt-2">
            <span className="text-slate-800 font-bold text-base">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-slate-500 text-sm line-through">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
