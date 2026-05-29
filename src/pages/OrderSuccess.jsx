import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import { fetchOrderById } from '../redux/slices/orderSlice.js'
import { getTransformedUrl } from '../utils/cloudinary.js'

export default function OrderSuccess() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { order, loading, error } = useSelector(state => state.orders)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id))
  }, [id, dispatch])

  const paymentId = order?.paymentResult?.razorpayPaymentId || order?.paymentResult?.paymentId || ''
  const address = order?.shippingAddress

  return (
    <>
      <SEO title="Order Successful – Sandhaikart" noindex />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-primary-500/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h1 className="text-slate-900 font-display font-bold text-2xl md:text-3xl">Order Successful</h1>
                  <p className="text-slate-800 text-sm mt-1">Thanks for your purchase! 🎉</p>
                </div>
              </div>

              {loading && <div className="glass-card h-24 mt-8 animate-pulse" />}
              {!loading && error && (
                <div className="glass-card p-6 mt-8">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {!loading && order && (
                <div className="grid lg:grid-cols-3 gap-6 mt-8">
                  {/* Summary */}
                  <div className="glass-card p-6 lg:col-span-1">
                    <h2 className="text-slate-900 font-semibold mb-4">Summary</h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-800">Order ID</span><span className="text-slate-500 font-mono">{order._id?.slice(-8).toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-800">Payment</span><span className="text-slate-500">{order.isPaid ? 'Paid' : 'Pending'}</span></div>
                      {paymentId && (
                        <div className="flex justify-between"><span className="text-slate-800">Transaction ID</span><span className="text-slate-500 font-mono truncate max-w-[180px]" title={paymentId}>{paymentId}</span></div>
                      )}
                      <div className="border-t border-slate-900/10 pt-3 flex justify-between font-semibold">
                        <span className="text-slate-900">Total Paid</span>
                        <span className="text-slate-900">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <Link to="/orders" className="btn-primary text-white w-full justify-center py-3">
                        View Orders <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link to="/products" className="btn-secondary text-slate-500 hover:text-slate-900 w-full justify-center py-3">
                        Continue Shopping
                      </Link>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="glass-card p-6 lg:col-span-2 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-slate-900 font-semibold mb-3">Customer</h3>
                        <div className="text-sm text-slate-800 space-y-1">
                          <p><span className="text-slate-800">Name:</span> {user?.name || order.user?.name}</p>
                          <p><span className="text-slate-800">Email:</span> {user?.email || order.user?.email}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-slate-900 font-semibold mb-3">Shipping Address</h3>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p className="text-slate-500 font-medium">{address?.fullName}</p>
                          <p className="text-slate-600">{address?.addressLine1}{address?.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                          <p className="text-slate-600">{address?.city}, {address?.state} {address?.pincode}</p>
                          <p className="text-slate-600">{address?.country || 'India'}</p>
                          <p className="text-slate-600"><span className="text-slate-800">Phone:</span> {address?.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-slate-900 font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary-400" />
                        Items ({order.orderItems?.length || 0})
                      </h3>
                      <div className="space-y-4">
                        {order.orderItems?.map((item, i) => {
                          const img = item.image ? getTransformedUrl(item.image, { width: 80, height: 80 }) : 'https://via.placeholder.com/80'
                          return (
                            <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-900/5 last:border-b-0">
                              <img src={img} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" loading="lazy" />
                              <div className="min-w-0 flex-1">
                                <div className="text-slate-900 text-sm font-medium line-clamp-1">{item.name}</div>
                                <div className="text-xs text-slate-800 mt-1">Qty: {item.quantity}</div>
                              </div>
                              <div className="text-slate-900 font-semibold text-sm">
                                ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

