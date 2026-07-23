import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa'
import { runtimeConfig } from '../utils/runtime.js'

const WhatsAppIcon = ({ className = '' }) => (
  <FaWhatsapp className={`text-3xl ${className}`} />
)

const InstagramIcon = ({ className = '' }) => (
  <FaInstagram className={`text-3xl ${className}`} />
)

const FacebookIcon = ({ className = '' }) => (
  <FaFacebookF className={`text-3xl ${className}`} />
)

export default function FloatingSocials() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(true)
  const [showInstagramTooltip, setShowInstagramTooltip] = useState(true)
  const [showFacebookTooltip, setShowFacebookTooltip] = useState(true)

  const links = useMemo(() => {
    const wa = runtimeConfig.whatsappUrl
      || (runtimeConfig.whatsappNumber ? `https://wa.me/${String(runtimeConfig.whatsappNumber).replace(/[^\d]/g, '')}` : '')

    const waWithMessage = wa ? `${wa}?text=${encodeURIComponent(runtimeConfig.whatsappMessage)}` : ''

    return { wa: waWithMessage, ig: runtimeConfig.instagramUrl || '', fb: runtimeConfig.facebookUrl || '' }
  }, [])

  if (isAdmin) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <div className="relative flex flex-col items-end">
        <a
          href={links.wa || '#'}
          onClick={(e) => {
            if (!links.wa) { e.preventDefault(); toast.error('WhatsApp link not configured'); return }
            setShowWhatsAppTooltip(false)
          }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 relative ${
            links.wa ? '' : 'opacity-50 cursor-not-allowed'
          }`}
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 8px 30px rgba(37,211,102,0.5)' }}
        >
          <WhatsAppIcon className="w-8 h-8 text-white cursor-pointer" />
          <span
            className="pointer-events-none absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: '#25D366' }}
          />
        </a>
      </div>

      <div className="relative flex flex-col items-end">
        <a
          href={links.ig || '#'}
          onClick={(e) => {
            if (!links.ig) { e.preventDefault(); toast.error('Instagram link not configured'); return }
            setShowInstagramTooltip(false)
          }}
          onMouseEnter={() => setShowInstagramTooltip(true)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Instagram"
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 relative ${
            links.ig ? '' : 'opacity-50 cursor-not-allowed'
          }`}
          style={{ background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)', boxShadow: '0 8px 30px rgba(221,42,123,0.45)' }}
        >
          <InstagramIcon className="w-8 h-8 text-white" />
          <span
            className="pointer-events-none absolute inset-0 rounded-full animate-ping opacity-25"
            style={{ background: '#dd2a7b' }}
          />
        </a>
      </div>

      <div className="relative flex flex-col items-end">
        <a
          href={links.fb || '#'}
          onClick={(e) => {
            if (!links.fb) { e.preventDefault(); toast.error('Facebook link not configured'); return }
            setShowFacebookTooltip(false)
          }}
          onMouseEnter={() => setShowFacebookTooltip(true)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Facebook"
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 relative ${
            links.fb ? '' : 'opacity-50 cursor-not-allowed'
          }`}
          style={{ background: 'linear-gradient(135deg, #1877F2, #0b5fcc)', boxShadow: '0 8px 30px rgba(24,119,242,0.45)' }}
        >
          <FacebookIcon className="w-8 h-8 text-white" />
          <span
            className="pointer-events-none absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: '#1877F2' }}
          />
        </a>
      </div>
    </div>
  )
}
