import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, ChevronDown } from 'lucide-react'
import AdminLayout from './AdminLayout.jsx'
import OrderTable from '../../components/admin/OrderTable.jsx'
import { adminFetchOrders, adminUpdateOrder } from '../../redux/slices/adminSlice.js'
import toast from 'react-hot-toast'

const STATUS_FILTERS = [
  'all',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
  'refund_pending',
  'refund_processed',
  'refund_failed',
]

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { orders, totalOrders, loading } = useSelector(s => s.admin)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(adminFetchOrders({
      page,
      status: statusFilter === 'all' ? undefined : statusFilter,
      search,
      limit: 15,
    }))
  }, [dispatch, page, statusFilter, search])

  const handleUpdateStatus = async (id, status) => {
    const result = await dispatch(adminUpdateOrder({ id, status }))
    if (adminUpdateOrder.fulfilled.match(result)) {
      toast.success('Order status updated')
    } else {
      toast.error('Failed to update')
    }
  }

  const totalPages = Math.ceil(totalOrders / 15)

  return (
    <AdminLayout title="Orders" subtitle={`${totalOrders} total orders`}>
      {/* Filters */}
      <div className="flex flex-row sm:flex-row gap-4 mb-6">
        <div className="relative flex-4 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap capitalize transition-all ${
                statusFilter === s ? 'bg-primary-500 text-white' : 'glass text-slate-400 hover:text-white'
              }`}
            >
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>
      </div>

      <OrderTable orders={orders} onUpdateStatus={handleUpdateStatus} loading={loading} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm transition-all ${page === i + 1 ? 'bg-primary-500 text-white' : 'glass text-slate-400 hover:text-white'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
