import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DollarSign, Package, ShoppingBag, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import StatsCard from '../../components/admin/StatsCard.jsx'
import { adminFetchAnalytics, adminFetchOrders } from '../../redux/slices/adminSlice.js'
import { ORDER_STATUSES } from '../../styles/theme.js'

export default function DashboardHome() {
  const dispatch = useDispatch()
  const { analytics, orders, loading } = useSelector(s => s.admin)

  useEffect(() => {
    dispatch(adminFetchAnalytics())
    dispatch(adminFetchOrders({ limit: 5, sort: '-createdAt' }))
  }, [dispatch])

  const stats = [
    { title: 'Total Revenue', value: analytics ? `₹${(analytics.totalRevenue / 100000).toFixed(1)}L` : '—', change: analytics?.revenueChange, icon: DollarSign, color: 'primary' },
    { title: 'Total Orders', value: analytics?.totalOrders ?? '—', change: analytics?.ordersChange, icon: ShoppingBag, color: 'blue' },
    { title: 'Total Products', value: analytics?.totalProducts ?? '—', icon: Package, color: 'green' },
    { title: 'Total Users', value: analytics?.totalUsers ?? '—', change: analytics?.usersChange, icon: Users, color: 'purple' },
  ]

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your store">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => <StatsCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="btn-ghost text-xs py-1.5 px-3">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-1">
            {loading && !orders.length ? (
              [...Array(5)].map((_, i) => <div key={i} className="h-12 glass rounded-xl animate-pulse" />)
            ) : orders.slice(0, 5).map(order => {
              const status = ORDER_STATUSES[order.orderStatus] || ORDER_STATUSES.pending
              return (
                <div key={order._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <span className="text-primary-400 text-xs font-bold">{order.user?.name?.[0]?.toUpperCase() || 'G'}</span>
                    </div>
                    <div>
                      <p className="text-slate-200 text-sm font-medium">{order.user?.name || 'Guest'}</p>
                      <p className="text-slate-500 text-xs font-mono">#{order._id?.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge text-xs border ${status.color}`}>{status.label}</span>
                    <span className="text-white font-medium text-sm">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">Order Status</h3>
            <div className="space-y-3">
              {Object.entries(ORDER_STATUSES).map(([key, { label, color }]) => {
                const count = analytics?.ordersByStatus?.[key] || 0
                const total = analytics?.totalOrders || 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-slate-300">{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/admin/products" className="sidebar-link text-sm">
                <Package className="w-4 h-4" /> Add Product
              </Link>
              <Link to="/admin/orders" className="sidebar-link text-sm">
                <ShoppingBag className="w-4 h-4" /> Manage Orders
              </Link>
              <Link to="/admin/users" className="sidebar-link text-sm">
                <Users className="w-4 h-4" /> View Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
