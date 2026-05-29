import { useState } from 'react'
import { ChevronDown, Truck, Eye } from 'lucide-react'
import { ORDER_STATUSES } from '../../styles/theme.js'

const STATUS_OPTIONS = Object.entries(ORDER_STATUSES).map(([value, { label }]) => ({ value, label }))

export default function OrderTable({ orders, onUpdateStatus, loading }) {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <div className="glass-card1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Order ID</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Customer</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium hidden md:table-cell">Date</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Total</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Status</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const status = ORDER_STATUSES[order.orderStatus] || ORDER_STATUSES.pending
              return (
                <>
                  <tr key={order._id} className="table-row">
                    <td className="px-5 py-3.5">
                      <span className="text-slate-300 font-mono text-xs">#{order._id?.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-slate-200 font-medium">{order.user?.name || 'Guest'}</p>
                        <p className="text-slate-500 text-xs">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-slate-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-white font-medium">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="relative inline-block">
                        <select
                          value={order.orderStatus}
                          onChange={e => onUpdateStatus(order._id, e.target.value)}
                          className={`badge border text-xs py-1 px-2.5 cursor-pointer appearance-none pr-6 ${status.color} bg-transparent`}
                          disabled={loading}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-dark-800 text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                        className="btn-ghost py-1 px-2.5 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                  {expandedId === order._id && (
                    <tr key={`${order._id}-expanded`} className="bg-white/2">
                      <td colSpan={6} className="px-5 py-4">
                        <div className="grid sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-slate-400 mb-2 font-medium">Items</p>
                            {order.orderItems?.map((item, i) => (
                              <div key={i} className="flex justify-between py-1 border-b border-white/5">
                                <span className="text-slate-300">{item.name} ×{item.quantity}</span>
                                <span className="text-slate-400">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-slate-400 mb-2 font-medium">Shipping Address</p>
                            {order.shippingAddress && (
                              <div className="text-slate-300 space-y-0.5">
                                <p>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                                <p className="text-primary-400 flex items-center gap-1 mt-1">
                                  <Truck className="w-3 h-3" />
                                  {order.trackingNumber || 'Not yet shipped'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12 text-slate-500">No orders found</div>
        )}
      </div>
    </div>
  )
}
