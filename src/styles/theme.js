export const theme = {
  colors: {
    primary: '#f59e0b',
    primaryDark: '#d97706',
    primaryLight: '#fbbf24',
    bgDark: '#0f172a',
    bgCard: 'rgba(255,255,255,0.05)',
    borderGlass: 'rgba(255,255,255,0.1)',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
  },
  glass: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
  },
  shadows: {
    primary: '0 8px 32px rgba(245,158,11,0.2)',
    card: '0 4px 24px rgba(0,0,0,0.3)',
  }
}

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-400/10 border-yellow-400/20' },
  processing: { label: 'Processing', color: 'text-blue-600 bg-blue-400/10 border-blue-400/20' },
  shipped: { label: 'Shipped', color: 'text-purple-600 bg-purple-400/10 border-purple-400/20' },
  delivered: { label: 'Delivered', color: 'text-green-600 bg-green-400/10 border-green-400/20' },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-400/10 border-red-400/20' },
  return_requested: { label: 'Return Requested', color: 'text-orange-600 bg-orange-400/10 border-orange-400/20' },
  returned: { label: 'Returned', color: 'text-slate-700 bg-slate-100 border-slate-200' },
  refund_pending: { label: 'Refund Pending', color: 'text-amber-800 bg-amber-100 border-amber-200' },
  refund_processed: { label: 'Refund Processed', color: 'text-emerald-800 bg-emerald-100 border-emerald-200' },
  refund_failed: { label: 'Refund Failed', color: 'text-rose-800 bg-rose-100 border-rose-200' },
}

export const PRODUCT_CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books',
  'Beauty', 'Toys', 'Automotive', 'Grocery', 'Health'
]
