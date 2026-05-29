import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronLeft, Package, Truck } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import Button from '../components/Button.jsx'
import { fetchOrderById } from '../redux/slices/orderSlice.js'
import { ORDER_STATUSES } from '../styles/theme.js'
import api from '../utils/api.js'
import toast from 'react-hot-toast'

export default function OrderDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { order, loading, error } = useSelector(state => state.orders)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const [returnNotes, setReturnNotes] = useState('')
  const [returning, setReturning] = useState(false)

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id))
  }, [id, dispatch])

  const status = ORDER_STATUSES[order?.orderStatus] || ORDER_STATUSES.pending
  const cancelOptions = useMemo(() => ([
    'Ordered by mistake',
    'Found cheaper elsewhere',
    'Delivery taking too long',
    'Other',
  ]), [])

  // Show cancel only after payment is confirmed and order is confirmed (processing).
  const canCancel = Boolean(order && order.isPaid && order.orderStatus === 'processing')
  const canRequestReturn = Boolean(order && order.orderStatus === 'delivered' && !order.return?.hasReturnRequest)

  const submitReturn = async () => {
    const trimmed = String(returnReason || '').trim()
    if (!trimmed) {
      toast.error('Please enter a return reason')
      return
    }
    setReturning(true)
    try {
      const items = (order.orderItems || []).map((it) => ({
        productId: it.product,
        quantity: it.quantity,
        reasonText: trimmed,
      }))
      const { data } = await api.post('/returns', { orderId: order._id, items, reason: trimmed, notes: String(returnNotes || '').trim() })
      toast.success('Return request created')
      setReturnOpen(false)
      setReturnReason('')
      setReturnNotes('')
      dispatch(fetchOrderById(order._id))
      if (data.returnRequest?._id) {
        window.location.href = `/returns/${data.returnRequest._id}`
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create return request')
    } finally {
      setReturning(false)
    }
  }

  const confirmCancel = async () => {
    const reason = (selectedReason === 'Other' ? otherReason : selectedReason) || otherReason
    const trimmed = String(reason || '').trim()
    if (!trimmed) {
      toast.error('Please select or type a cancellation reason')
      return
    }
    setCancelling(true)
    try {
      await api.put(`/orders/${order._id}/cancel`, { reason: trimmed })
      toast.success('Order cancelled')
      setCancelOpen(false)
      setSelectedReason('')
      setOtherReason('')
      dispatch(fetchOrderById(order._id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <>
      <SEO title="Order Details – Sandhaikart" noindex />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link to="/orders" className="btn-ghost text-slate-900 text-sm">
              <ChevronLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            <div className="flex gap-2">
              {canRequestReturn && (
                <Button variant="secondary" onClick={() => setReturnOpen(true)}>
                  Request Return
                </Button>
              )}
              {canCancel && (
                <Button variant="danger" className='text-red-600' onClick={() => setCancelOpen(true)}>
                  Cancel Order
                </Button>
              )}
            </div>
          </div>

          {loading && (
            <div className="glass-card h-40 animate-pulse" />
          )}

          {!loading && error && (
            <div className="glass-card p-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && !order && (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Order not found</h2>
              <Link to="/orders" className="btn-primary">Go to Orders</Link>
            </div>
          )}

          {!loading && order && (
            <div className="space-y-6">
              {/* Header */}
              <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-slate-900 font-semibold text-lg">
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </h1>
                      <span className={`badge text-xs border ${status.color}`}>{status.label}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-xs text-primary-400 flex items-center gap-1 mt-2">
                        <Truck className="w-3 h-3" />
                        AWB: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500 text-xs">Total</div>
                    <div className="text-primary-400 font-bold text-2xl">₹{order.totalPrice?.toLocaleString('en-IN')}</div>
                    <div className="text-slate-500 text-xs mt-1">
                      Payment: {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping + Summary */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-6 md:col-span-2">
                  <h2 className="text-slate-900 font-semibold mb-4">Shipping Details</h2>
                  <div className="text-sm text-slate-500 space-y-1">
                    <p><span className="text-slate-600">Name:</span> {order.shippingAddress?.fullName}</p>
                    <p><span className="text-slate-500">Phone:</span> {order.shippingAddress?.phone}</p>
                    <p className="text-slate-500">
                      {order.shippingAddress?.addressLine1}
                      {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                    </p>
                    <p className="text-slate-500">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                    </p>
                    <p className="text-slate-500">{order.shippingAddress?.country || 'India'}</p>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h2 className="text-slate-900 font-semibold mb-4">Price Summary</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Items</span><span className="text-slate-600">₹{order.itemsPrice?.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="text-slate-600">₹{order.shippingPrice?.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Tax</span><span className="text-slate-600">₹{order.taxPrice?.toLocaleString('en-IN')}</span></div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                      <span className="text-slate-500">Total</span>
                      <span className="text-slate-600">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="glass-card p-6">
                <h2 className="text-slate-900 font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-400" />
                  Items ({order.orderItems?.length || 0})
                </h2>
                <div className="space-y-4">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-b-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <Link to={`/products/${item.product}`} className="text-slate-900 text-sm font-medium hover:text-primary-400 transition-colors line-clamp-1">
                          {item.name}
                        </Link>
                        <div className="text-xs text-slate-500 mt-1">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-white font-semibold text-sm">
                        ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {cancelOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => !cancelling && setCancelOpen(false)}
            aria-label="Close cancel modal"
          />
          <div className="relative w-full max-w-lg glass-card p-6 border border-white/10">
            <h3 className="text-white font-semibold text-lg">Cancel order?</h3>
            <p className="text-slate-500 text-sm mt-1">
              Please tell us why you want to cancel. This helps us improve.
            </p>

            <div className="mt-5 space-y-2">
              {cancelOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-3 glass px-4 py-3 rounded-xl cursor-pointer border border-white/10 hover:border-primary-500/20">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={opt}
                    checked={selectedReason === opt}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />
                  <span className="text-slate-200 text-sm">{opt}</span>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <label className="label">Reason (required)</label>
              <textarea
                className="input-field resize-none h-24"
                placeholder="Type your reason…"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Select an option above or type your own reason.
              </p>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setCancelOpen(false)} disabled={cancelling}>
                Keep Order
              </Button>
              <Button variant="danger" onClick={confirmCancel} loading={cancelling}>
                Confirm Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {returnOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => !returning && setReturnOpen(false)}
            aria-label="Close return modal"
          />
          <div className="relative w-full max-w-lg glass-card p-6 border border-white/10">
            <h3 className="text-white font-semibold text-lg">Request a return</h3>
            <p className="text-slate-500 text-sm mt-1">
              Return pickup will be arranged after eligibility checks.
            </p>

            <div className="mt-4">
              <label className="label">Reason (required)</label>
              <textarea
                className="input-field resize-none h-24"
                placeholder="Type your return reason…"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="label">Notes (optional)</label>
              <textarea
                className="input-field resize-none h-20"
                placeholder="Any additional details…"
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
              />
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setReturnOpen(false)} disabled={returning}>
                Cancel
              </Button>
              <Button onClick={submitReturn} loading={returning}>
                Submit Return
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
