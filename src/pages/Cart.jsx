import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import { removeFromCart, updateQuantity, selectCartTotal } from '../redux/slices/cartSlice.js'
import { getTransformedUrl } from '../utils/cloudinary.js'
import api from '../utils/api.js'

export default function Cart() {
  const dispatch = useDispatch()
  const { items } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const total = useSelector(selectCartTotal)
  const [storeSettings, setStoreSettings] = useState({
    freeShippingThreshold: 499,
    shippingCharge: 49,
    freeShippingEnabled: true,
  })

  useEffect(() => {
    let mounted = true
    api.get('/settings')
      .then((res) => {
        const g = res.data?.settings?.general
        if (!mounted || !g) return
        setStoreSettings((prev) => ({
          ...prev,
          freeShippingThreshold: Number.isFinite(Number(g.freeShippingThreshold)) ? Number(g.freeShippingThreshold) : prev.freeShippingThreshold,
          shippingCharge: Number.isFinite(Number(g.shippingCharge)) ? Number(g.shippingCharge) : prev.shippingCharge,
          freeShippingEnabled: typeof g.freeShippingEnabled === 'boolean' ? g.freeShippingEnabled : prev.freeShippingEnabled,
        }))
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const shipping = useMemo(() => {
    const threshold = Number(storeSettings.freeShippingThreshold) || 0
    const charge = Number(storeSettings.shippingCharge) || 0
    if (!storeSettings.freeShippingEnabled) return charge
    if (threshold > 0 && total >= threshold) return 0
    return charge
  }, [total, storeSettings.freeShippingEnabled, storeSettings.freeShippingThreshold, storeSettings.shippingCharge])

  const tax = useMemo(() => Math.round(total * 0.18), [total])

  if (items.length === 0) return (
    <>
      <SEO title="Cart – Sandhaikart" noindex />
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <ShoppingCart className="w-20 h-20 text-slate-700 mb-6" />
        <h2 className="text-2xl font-display font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary py-4 px-8">
          Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </>
  )

  return (
    <>
      <SEO title="Cart – Sandhaikart" noindex />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="page-header mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item._id} className="glass-card p-4 flex items-center gap-4">
                  <Link to={`/products/${item._id}`}>
                    <img
                      src={item.images?.[0]?.url ? getTransformedUrl(item.images[0].url, { width: 100, height: 100 }) : 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item._id}`} className="text-white font-medium text-sm hover:text-primary-400 transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-slate-500 text-xs mt-0.5">{item.category}</p>
                    <p className="text-primary-400 font-bold mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                        className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white font-bold w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                        className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-20">
                      <p className="text-white font-bold text-sm">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</p>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="text-slate-500 hover:text-red-400 transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div className="glass-card p-6 sticky top-24">
                <h2 className="text-white font-semibold text-lg mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal ({items.length} items)</span>
                    <span className="text-slate-200">₹{total?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-slate-200'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GST (18%)</span>
                    <span className="text-slate-200">₹{tax?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-white font-bold text-lg">₹{(total + shipping + tax)?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {shipping > 0 && storeSettings.freeShippingEnabled && (Number(storeSettings.freeShippingThreshold) || 0) > 0 && (
                  <p className="text-xs text-slate-500 mt-3 glass p-2 rounded-lg text-center">
                    Add ₹{(Math.max(0, Number(storeSettings.freeShippingThreshold) - total)).toLocaleString('en-IN')} more for FREE shipping
                  </p>
                )}

                <Link
                  to={user ? '/checkout' : '/login?redirect=checkout'}
                  className="btn-primary w-full justify-center mt-6 py-4"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>

                <Link to="/products" className="btn-ghost w-full justify-center mt-3 text-sm">
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-500 text-center">🔒 Secured by Razorpay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
