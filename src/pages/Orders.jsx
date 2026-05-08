import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Truck } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import { fetchMyOrders } from '../redux/slices/orderSlice.js'
import { ORDER_STATUSES } from '../styles/theme.js'

export default function Orders() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector(state => state.orders)

  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])

  return (
    <>
      <SEO title="My Orders – Sandhaikart" noindex />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="page-header mb-8">My Orders</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="glass-card h-28 animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
              <p className="text-slate-500 mb-6">Start shopping to see your orders here</p>
              <Link to="/products" className="btn-primary">Shop Now</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const status = ORDER_STATUSES[order.orderStatus] || ORDER_STATUSES.pending
                return (
                  <div key={order._id} className="glass-card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="text-white font-medium text-sm">Order #{order._id?.slice(-8).toUpperCase()}</p>
                          <span className={`badge text-xs border ${status.color}`}>{status.label}</span>
                        </div>
                        <p className="text-slate-500 text-xs">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          {' · '}{order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-xs text-primary-400 flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            AWB: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-bold">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
                      {order.orderItems?.slice(0, 4).map((item, i) => (
                        <img
                          key={i}
                          src={item.image || 'https://via.placeholder.com/60'}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0 opacity-80"
                        />
                      ))}
                      {order.orderItems?.length > 4 && (
                        <div className="w-14 h-14 rounded-lg glass flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                          +{order.orderItems.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
