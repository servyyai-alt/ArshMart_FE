import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, User, Search, Menu, X, Package, LogOut, LayoutDashboard } from 'lucide-react'
import { logout } from '../redux/slices/authSlice.js'
import { selectCartCount } from '../redux/slices/cartSlice.js'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)
  const cartCount = useSelector(selectCartCount)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navLinks = [
    { to: '/products', label: 'Shop' },
    { to: '/products?category=Electronics', label: 'Electronics' },
    { to: '/products?category=Fashion', label: 'Fashion' },
    { to: '/products?category=Home & Kitchen', label: 'Home' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight">
              Sandhai<span className="text-primary-400">kart</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname + location.search === link.to
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="btn-ghost p-2.5 rounded-xl"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="btn-ghost p-2.5 rounded-xl relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse-glow">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 glass px-3 py-2 rounded-xl hover:border-primary-500/30 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                    <span className="text-primary-400 text-xs font-bold">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-300 hidden sm:block max-w-20 truncate">{user.name?.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-dark rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-slide-up">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white font-medium text-sm truncate">{user.name}</p>
                      <p className="text-slate-500 text-xs truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/profile" className="sidebar-link text-xs py-2">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/orders" className="sidebar-link text-xs py-2">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="sidebar-link text-xs py-2">
                          <LayoutDashboard className="w-4 h-4" /> Admin
                        </Link>
                      )}
                      <button onClick={handleLogout} className="sidebar-link text-xs py-2 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-4 text-sm">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden btn-ghost p-2.5 rounded-xl">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4 animate-slide-up">
            <form onSubmit={handleSearch}>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-4 animate-slide-up">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="block sidebar-link mb-1">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
