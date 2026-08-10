import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { addToCart } from '../redux/slices/cartSlice.js'
import { loadUser } from '../redux/slices/authSlice.js'
import toast from 'react-hot-toast'
import { getTransformedUrl } from '../utils/cloudinary.js'
import api from '../utils/api.js'
import { useEffect, useMemo, useState } from 'react'

export default function ProductCard({ product, to, static: isStatic = false }) {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const [wishOverride, setWishOverride] = useState(null) // null | boolean
  const linkTo = to || `/products/${product._id}`

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
    <Link to={linkTo} className="group block">
      <div className="h-full flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10 hover:ring-amber-200">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-slate-50">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge bg-amber-600 text-white text-[10px] sm:text-xs px-2 py-1 shadow-sm">
                -{discount}%
              </span>
            )}
            {product.stock <= 0 && (
              <span className="badge bg-red-500/90 text-white text-[10px] sm:text-xs">
                Out of Stock
              </span>
            )}
            {product.isFeatured && (
              <span className="badge bg-amber-400/95 text-slate-900 text-[10px] sm:text-xs font-semibold shadow-sm">
                Featured
              </span>
            )}
          </div>

          {/* Quick actions */}
          {!isStatic && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
              <button
                onClick={toggleWishlist}
                className={`w-8 h-8 rounded-xl bg-white/95 backdrop-blur shadow-sm ring-1 ring-slate-200 flex items-center justify-center transition-colors ${
                  isWishlisted ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          )}

          {/* Add to cart overlay */}
          {!isStatic && (
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full btn-primary bg-[#8bc34a] hover:bg-[#9ccc65] text-white justify-center py-2 text-xs sm:text-sm rounded-xl shadow-lg shadow-green-900/20"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">

          <h3 className="text-slate-700 font-medium text-xs sm:text-sm leading-snug group-hover:text-amber-700 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.ratings || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="text-slate-400 text-[10px] sm:text-xs">({product.numReviews || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto pt-1">
            <span className="text-slate-900 font-bold text-sm sm:text-base">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-slate-400 text-xs sm:text-sm line-through">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
