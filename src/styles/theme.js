export const theme = {
  colors: {
    primary: '#f97316',
    primaryDark: '#ea580c',
    primaryLight: '#fdba74',
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
    primary: '0 8px 32px rgba(249,115,22,0.2)',
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
  returned: { label: 'Returned', color: 'text-slate-300 bg-white/5 border-white/10' },
  refund_pending: { label: 'Refund Pending', color: 'text-yellow-300 bg-yellow-300/10 border-yellow-300/20' },
  refund_processed: { label: 'Refund Processed', color: 'text-green-300 bg-green-300/10 border-green-300/20' },
  refund_failed: { label: 'Refund Failed', color: 'text-red-300 bg-red-300/10 border-red-300/20' },
}

export const PRODUCT_CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books',
  'Beauty', 'Toys', 'Automotive', 'Grocery', 'Health'
]
