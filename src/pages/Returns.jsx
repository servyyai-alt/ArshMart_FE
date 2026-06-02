import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import api from '../utils/api.js'

export default function Returns() {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/returns/my')
      .then((res) => setReturns(res.data.returns || []))
      .catch(() => setReturns([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO title="My Returns – Sandhaikart" noindex />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="page-header mb-8">My Returns</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="glass-card h-24 animate-pulse" />)}
            </div>
          ) : returns.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No returns yet</h2>
              <p className="text-slate-500">Return requests will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {returns.map((r) => (
                <Link
                  key={r._id}
                  to={`/returns/${r._id}`}
                  className="glass-card p-5 block hover:border-primary-500/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-white font-medium text-sm">
                        Return #{r._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-slate-500 text-xs">
                        Status: {r.status}
                        {r.shiprocket?.awb ? ` · AWB: ${r.shiprocket.awb}` : ''}
                      </p>
                    </div>
                    <div className="text-slate-400 text-xs">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : ''}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

