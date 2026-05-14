import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const WhatsAppIcon = ({ className = '' }) => (
  <FaWhatsapp className={`text-3xl ${className}`} />
)

const InstagramIcon = ({ className = '' }) => (
  <FaInstagram className={`text-3xl ${className}`} />
)

export default function FloatingSocials() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(true)
  const [showInstagramTooltip, setShowInstagramTooltip] = useState(true)

  const links = useMemo(() => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER
    const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL
    const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL
    const whatsappMessage = import.meta.env.VITE_WHATSAPP_MESSAGE

    const wa = whatsappUrl
      || (whatsappNumber ? `https://wa.me/${String(whatsappNumber).replace(/[^\d]/g, '')}` : '')

    const message = whatsappMessage || 'Thank you for choosing Sandhaikart. How can I help you?'
    const waWithMessage = wa ? `${wa}?text=${encodeURIComponent(message)}` : ''

    return { wa: waWithMessage, ig: instagramUrl || '' }
  }, [])

  if (isAdmin) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* WhatsApp */}
      <div className="relative flex flex-col items-end">
        {/* {showWhatsAppTooltip && (
          <div className="absolute bottom-20 right-0 w-64 rounded-2xl p-3 shadow-2xl bg-white border border-gray-200">
            <button
              onClick={() => setShowWhatsAppTooltip(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs bg-gray-500"
              aria-label="Close WhatsApp tooltip"
            >
              ×
            </button>
            <p className="text-gray-700 text-xs font-medium leading-snug">
              Chat with us on WhatsApp.
            </p>
          </div>
        )} */}

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

      {/* Instagram */}
      <div className="relative flex flex-col items-end">
        {/* {showInstagramTooltip && (
          <div className="absolute bottom-20 right-0 w-64 rounded-2xl p-3 shadow-2xl bg-white border border-gray-200">
            <button
              onClick={() => setShowInstagramTooltip(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs bg-gray-500"
              aria-label="Close Instagram tooltip"
            >
              ×
            </button>
            <p className="text-gray-700 text-xs font-medium leading-snug">
              Follow us on Instagram.
            </p>
          </div>
        )} */}

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
    </div>
  )
}
