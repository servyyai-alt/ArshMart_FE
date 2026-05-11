import { Link } from 'react-router-dom'
import { Package, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-dark mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Sandhai<span className="text-primary-400">kart</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your premium shopping destination. Quality products, fast delivery, and exceptional service across India.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-500/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products?category=Electronics', label: 'Electronics' },
                { to: '/products?category=Fashion', label: 'Fashion' },
                { to: '/products?category=Home & Kitchen', label: 'Home & Kitchen' },
                { to: '/orders', label: 'Track Order' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-500 hover:text-primary-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              {[
                { to: '#', label: 'Help Center' },
                { to: '#', label: 'Returns & Refunds' },
                { to: '#', label: 'Shipping Policy' },
                { to: '#', label: 'Privacy Policy' },
                { to: '#', label: 'Terms of Service' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-500 hover:text-primary-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-500 text-sm">123, Commerce Street, Chennai, Tamil Nadu 600001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-slate-500 hover:text-primary-400 text-sm transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:support@sandhaikart.com" className="text-slate-500 hover:text-primary-400 text-sm transition-colors">
                  support@sandhaikart.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {currentYear} Sandhaikart. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Razorpay_logo.svg/200px-Razorpay_logo.svg.png" alt="Razorpay" className="h-5 opacity-40 hover:opacity-70 transition-opacity" />
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <span>🔒</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
