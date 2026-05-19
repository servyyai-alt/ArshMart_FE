import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Truck } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import Button from '../components/Button.jsx'
import api from '../utils/api.js'
import toast from 'react-hot-toast'

export default function ReturnDetail() {
  const { id } = useParams()
  const [returnRequest, setReturnRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tracking, setTracking] = useState(null)
  const [trackingLoading, setTrackingLoading] = useState(false)

  useEffect(() => {
    api.get(`/returns/${id}`)
      .then((res) => setReturnRequest(res.data.returnRequest))
      .catch(() => setReturnRequest(null))
      .finally(() => setLoading(false))
  }, [id])

  const loadTracking = async () => {
    setTrackingLoading(true)
    try {
      const { data } = await api.get(`/returns/${id}/track`)
      setTracking(data.tracking)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tracking')
    } finally {
      setTrackingLoading(false)
    }
  }

  return (
    <>
      <SEO title="Return Details – Sandhaikart" noindex />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/returns" className="btn-ghost text-sm mb-6 inline-flex">
            <ChevronLeft className="w-4 h-4" />
            Back to Returns
          </Link>

          {loading ? (
            <div className="glass-card h-40 animate-pulse" />
          ) : !returnRequest ? (
            <div className="glass-card p-6">
              <p className="text-slate-400 text-sm">Return not found</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h1 className="text-white font-semibold text-lg">
                  Return #{returnRequest._id?.slice(-8).toUpperCase()}
                </h1>
                <p className="text-slate-500 text-sm mt-1">Status: {returnRequest.status}</p>
                {returnRequest.shiprocket?.awb && (
                  <p className="text-xs text-primary-400 flex items-center gap-1 mt-3">
                    <Truck className="w-3 h-3" />
                    AWB: {returnRequest.shiprocket.awb}
                  </p>
                )}

                <div className="mt-4 flex gap-3">
                  <Button variant="secondary" onClick={loadTracking} loading={trackingLoading} disabled={!returnRequest.shiprocket?.awb}>
                    Track Pickup
                  </Button>
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-3">Shiprocket</h2>
                <div className="text-xs text-slate-300 space-y-1">
                  <div><span className="text-slate-500">Return Order ID:</span> {returnRequest.shiprocket?.returnOrderId || '-'}</div>
                  <div><span className="text-slate-500">Shipment ID:</span> {returnRequest.shiprocket?.shipmentId || '-'}</div>
                  <div><span className="text-slate-500">AWB:</span> {returnRequest.shiprocket?.awb || '-'}</div>
                  <div><span className="text-slate-500">Courier:</span> {returnRequest.shiprocket?.courierName || '-'}</div>
                </div>
              </div>

              {tracking && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-semibold mb-3">Tracking</h2>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap break-words">
                    {JSON.stringify(tracking, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
