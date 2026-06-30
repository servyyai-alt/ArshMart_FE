import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ChevronDown, RefreshCw, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout.jsx'
import OrderTable from '../../components/admin/OrderTable.jsx'
import Pagination from '../../components/Pagination.jsx'
import api from '../../utils/api.js'
import { adminUpdateOrder } from '../../redux/slices/adminSlice.js'

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

const PAGE_SIZE_OPTIONS = [15, 30, 50]

export default function AdminOrders() {
  const dispatch = useDispatch()
  const [orders, setOrders] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [razorpayRevenue, setRazorpayRevenue] = useState(0)
  const [razorpayOrdersCount, setRazorpayOrdersCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)

  const abortRef = useRef(null)
  const requestSeqRef = useRef(0)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1)
      setSearchQuery(searchInput.trim())
    }, 500)

    return () => window.clearTimeout(timer)
  }, [searchInput])

  const requestParams = useMemo(() => {
    const params = {
      page,
      limit,
    }

    if (statusFilter !== 'all') params.status = statusFilter
    if (searchQuery) params.search = searchQuery

    return params
  }, [page, limit, statusFilter, searchQuery])

  const fetchOrders = useCallback(async () => {
    const requestSeq = requestSeqRef.current + 1
    requestSeqRef.current = requestSeq

    abortRef.current?.abort()

    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)

    try {
      const { data } = await api.get('/admin/orders', {
        params: requestParams,
        signal: controller.signal,
      })

      if (requestSeq !== requestSeqRef.current || controller.signal.aborted) return

      if (!mountedRef.current) return

      setOrders(data.orders || [])
      setTotalOrders(data.total || 0)
      setRazorpayRevenue(data.razorpayRevenue || 0)
      setRazorpayOrdersCount(data.razorpayOrdersCount || 0)
    } catch (err) {
      if (controller.signal.aborted || err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError') {
        return
      }

      if (!mountedRef.current) return

      toast.error(err?.response?.data?.message || 'Failed to load orders')
    } finally {
      if (mountedRef.current && requestSeq === requestSeqRef.current) {
        setLoading(false)
      }
    }
  }, [requestParams])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleUpdateStatus = useCallback(async (id, status) => {
    const result = await dispatch(adminUpdateOrder({ id, status }))

    if (adminUpdateOrder.fulfilled.match(result)) {
      toast.success('Order status updated')
      await fetchOrders()
      return
    }

    toast.error(result.payload || 'Failed to update')
  }, [dispatch, fetchOrders])

  const handleStatusFilterChange = useCallback((nextStatus) => {
    setStatusFilter(nextStatus)
    setPage(1)
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearchInput(e.target.value)
  }, [])

  const handleLimitChange = useCallback((e) => {
    setLimit(Number(e.target.value))
    setPage(1)
  }, [])

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage)
  }, [])

  const handleRefresh = useCallback(() => {
    if (!loading) fetchOrders()
  }, [fetchOrders, loading])

  const totalPages = useMemo(() => Math.ceil((totalOrders || 0) / limit), [totalOrders, limit])

  return (
    <AdminLayout title="Orders" subtitle={`${totalOrders} total orders`}>
      <div className="flex flex-col xl:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex flex-col gap-4 w-full xl:flex-1">
          <div className="flex flex-col lg:flex-row gap-4 w-full overflow-hidden">
            <div className="relative flex-none w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by customer or order ID..."
                value={searchInput}
                onChange={handleSearchChange}
                className="input-field pl-10 py-2.5 text-sm w-full"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {STATUS_FILTERS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusFilterChange(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap capitalize transition-all ${
                    statusFilter === s ? 'bg-primary-500 text-white' : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  {s === 'all' ? 'All Orders' : s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-36">
              <select
                value={limit}
                onChange={handleLimitChange}
                className="input-field py-2.5 pl-3 pr-9 text-sm w-full appearance-none"
              >
                {PAGE_SIZE_OPTIONS.map(size => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 glass-card p-3 px-5 border border-blue-500/20 bg-blue-500/5 rounded-xl text-right w-full xl:w-auto">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Razorpay Revenue</p>
          <p className="text-white text-xl font-semibold">Rs{(razorpayRevenue || 0).toLocaleString('en-IN')}</p>
          {razorpayOrdersCount > 0 && (
            <p className="text-slate-500 text-[10px] mt-0.5">Successful Razorpay Orders: {razorpayOrdersCount}</p>
          )}
        </div>
      </div>

      <OrderTable orders={orders} onUpdateStatus={handleUpdateStatus} loading={loading} />

      <Pagination
        className="mt-6"
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </AdminLayout>
  )
}
