import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import { removeFromCart, updateQuantity, selectCartTotal } from '../redux/slices/cartSlice.js'
import { applyCoupon, clearCoupon } from '../redux/slices/cartSlice.js'
import { getTransformedUrl } from '../utils/cloudinary.js'
import api from '../utils/api.js'
import toast from 'react-hot-toast'

export default function Cart() {
  const dispatch = useDispatch()
  const { items } = useSelector(state => state.cart)
  const { coupon } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const total = useSelector(selectCartTotal)
  const [couponInput, setCouponInput] = useState(coupon?.code || '')
  const [applyingCoupon, setApplyingCoupon] = useState(false)
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

  const baseTotal = useMemo(() => total + shipping, [total, shipping])
  const discount = useMemo(() => {
    const percent = Number(coupon?.percent) || 0
    if (!coupon?.code || percent <= 0) return 0
    return Math.round((baseTotal * percent) / 100)
  }, [coupon?.code, coupon?.percent, baseTotal])
  const payableTotal = useMemo(() => Math.max(0, baseTotal - discount), [baseTotal, discount])

  const handleApplyCoupon = async () => {
    const code = String(couponInput || '').trim()
    if (!code) return toast.error('Enter a coupon code')
    if (!user) return toast.error('Please login to apply coupon')
    setApplyingCoupon(true)
    try {
      const { data } = await api.post('/coupons/apply', { code })
      const c = data?.coupon
      dispatch(applyCoupon({ code: c?.code, percent: c?.percent }))
      toast.success('Congrats! Coupon applied 🎉')
    } catch (err) {
      dispatch(clearCoupon())
      toast.error(err.response?.data?.message || 'Invalid coupon')
    } finally {
      setApplyingCoupon(false)
    }
  }

  if (items.length === 0) return (
    <>
      <SEO title="Cart – Arsh Mart" noindex />
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-slate-700 mb-6" />
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-black mb-2">Your cart is empty</h2>
        <p className="text-sm sm:text-base text-slate-500 mb-8 max-w-md">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary py-4 px-8">
          Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </>
  )

  return (
    <>
      <SEO title="Cart – Arsh Mart" noindex />
      <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-slate-500 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="page-header mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
              {items.map(item => (
                <div key={item._id} className="glass-card p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link to={`/products/${item._id}`} className="shrink-0 self-start sm:self-auto">
                      <img
                        src={item.images?.[0]?.url ? getTransformedUrl(item.images[0].url, { width: 100, height: 100 }) : 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-white rounded-xl"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item._id}`} className="text-[#2a365b] text-base sm:text-lg font-medium hover:text-primary-400 transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-slate-500 text-xs mt-1">{item.category}</p>
                      <p className="text-primary-600 font-bold mt-1 text-sm sm:text-base">₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3 sm:gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                          className="w-9 h-9 sm:w-8 sm:h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-[#2a365b] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[#2a365b] font-bold w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                          className="w-9 h-9 sm:w-8 sm:h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-[#2a365b] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <div className="text-left sm:text-right min-w-20">
                          <p className="font-bold text-primary-600 text-sm sm:text-base">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</p>
                        </div>

                        <button
                          onClick={() => dispatch(removeFromCart(item._id))}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="order-1 lg:order-2">
              <div className="glass-card p-5 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-[#2a365b] font-semibold text-lg mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-900">Subtotal ({items.length} items)</span>
                    <span className="text-slate-900">₹{total?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-900">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-slate-800'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-xs italic">GST Included</span>
                  </div>
                  {coupon?.code && discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-900">
                        Coupon <span className="font-mono text-xs">{coupon.code}</span> ({coupon.percent}%)
                      </span>
                      <span className="text-green-600 font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-[#2a365b] font-semibold">Total</span>
                    <span className="text-primary-500 font-bold text-lg">₹{payableTotal?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-xs text-slate-600 font-medium">Coupon Code</label>
                  <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <input
                      className="input-field bg-white text-slate-900 placeholder:text-slate-400"
                      placeholder="WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      disabled={applyingCoupon}
                    />
                    {coupon?.code ? (
                      <button
                        type="button"
                        className="btn-secondary bg-red-500 whitespace-nowrap justify-center"
                        onClick={() => { dispatch(clearCoupon()); toast.success('Coupon removed'); }}
                        disabled={applyingCoupon}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary text-white whitespace-nowrap justify-center"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon}
                      >
                        {applyingCoupon ? 'Applying…' : 'Apply'}
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">One-time coupon per user account.</p>
                </div>

                {shipping > 0 && storeSettings.freeShippingEnabled && (Number(storeSettings.freeShippingThreshold) || 0) > 0 && (
                  <p className="text-xs text-slate-500 mt-3 glass p-2 rounded-lg text-center">
                    Add ₹{(Math.max(0, Number(storeSettings.freeShippingThreshold) - total)).toLocaleString('en-IN')} more for FREE shipping
                  </p>
                )}

                <Link
                  to={user ? '/checkout' : '/login?redirect=checkout'}
                  className="btn-primary text-white w-full justify-center mt-6 py-4"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>

                <Link to="/products" className="btn-ghost hover:text-slate-900 w-full justify-center mt-3 text-sm">
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
