import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartOff } from 'lucide-react'
import api from '../utils/api.js'
import ProductCard from '../components/ProductCard.jsx'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/users/wishlist')
      setWishlist(data.wishlist || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (productId) => {
    try {
      await api.delete(`/users/wishlist/${productId}`)
      setWishlist(prev => prev.filter(p => p._id !== productId))
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="spinner w-10 h-10" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="page-header">Wishlist</h1>
            <p className="text-slate-500 text-sm mt-1">Saved items you can buy later</p>
          </div>
          <Link to="/products" className="btn-ghost text-white text-sm">Browse products</Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
              <HeartOff className="w-7 h-7 text-primary-400" />
            </div>
            <p className="text-slate-400">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {wishlist.filter(p => p?.isActive !== false).map((product) => (
              <div key={product._id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => remove(product._id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-xl glass-dark border border-white/10 hover:border-red-500/30 text-red-400 hover:text-red-300 transition-colors flex items-center justify-center"
                  title="Remove"
                >
                  <HeartOff className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

