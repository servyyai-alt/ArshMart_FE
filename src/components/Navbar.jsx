import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Package,
  LogOut,
  LayoutDashboard,
  Heart,
  Tag,
} from "lucide-react";
import { logout } from "../redux/slices/authSlice.js";
import { selectCartCount } from "../redux/slices/cartSlice.js";
import SandhaiKart_logo from "../assets/images/SandhaiKart_logo.jpeg";
import api from "../utils/api.js";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestProducts, setSuggestProducts] = useState([]);
  const [suggestCategories, setSuggestCategories] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const normalizedQuery = useMemo(() => searchQuery.trim(), [searchQuery]);

  useEffect(() => {
    if (!searchOpen) return;
    if (normalizedQuery.length < 2) {
      setSuggestProducts([]);
      setSuggestCategories([]);
      setSuggestLoading(false);
      return;
    }

    let cancelled = false;
    const t = setTimeout(async () => {
      setSuggestLoading(true);
      try {
        const { data } = await api.get("/products/suggest", {
          params: { query: normalizedQuery },
        });
        if (cancelled) return;
        setSuggestProducts(data.products || []);
        setSuggestCategories(data.categories || []);
      } catch {
        if (cancelled) return;
        setSuggestProducts([]);
        setSuggestCategories([]);
      } finally {
        if (!cancelled) setSuggestLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [normalizedQuery, searchOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    { to: "/products", label: "Shop" },
    { to: "/products?category=Electronics", label: "Electronics" },
    { to: "/products?category=Fashion", label: "Fashion" },
    { to: "/products?category=Home & Kitchen", label: "Home" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-dark shadow-xl" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Left: Logo (Takes up 1/3 to help centering) */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="rounded-full">
              <img
                src={SandhaiKart_logo}
                alt="Sandhaikart Logo"
                className="w-[80%] lg:w-[20%] mt-1 object-contain rounded-full"
              />
            </Link>
          </div>

          {/* Center: Desktop Nav Links (Perfectly Centered) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname + location.search === link.to
                    ? "text-primary-400 bg-primary-500/10"
                    : "text-white hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Actions (Takes up 1/3 to help centering) */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="p-2.5 rounded-xl relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#5bb253] text-white text-xs rounded-full flex items-center justify-center font-medium animate-bounce">
                  {cartCount > 9 ? "9+" : cartCount}
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
                  <div className="w-7 h-7 rounded-full bg-[#5bb253]/50 border border-[#5bb253]/30 flex items-center justify-center">
                    <span className="text text-xs font-bold">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-300 hidden sm:block max-w-20 truncate">
                    {user.name?.split(" ")[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-dark rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-slide-up z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white font-medium text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-slate-500 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link to="/profile" className="sidebar-link text-xs py-2">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/orders" className="sidebar-link text-xs py-2">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="sidebar-link text-xs py-2"
                      >
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      {user.role === "admin" && (
                        <Link to="/admin" className="sidebar-link text-xs py-2">
                          <LayoutDashboard className="w-4 h-4" /> Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="sidebar-link text-xs py-2 w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-white py-2 px-4 text-sm">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden btn-ghost p-2.5 rounded-xl"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4 animate-slide-up">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or categories..."
                  className="input-field bg-black/80 border border-white/20 focus:border-primary-500 text-white w-full md:w-96"
                />

                {(suggestLoading ||
                  suggestProducts.length > 0 ||
                  suggestCategories.length > 0) && (
                  <div className="absolute left-0 right-0 mt-2 glass-dark rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-50">
                    {suggestLoading && (
                      <div className="px-4 py-3 text-xs text-slate-400">
                        Searching…
                      </div>
                    )}

                    {!suggestLoading && suggestCategories.length > 0 && (
                      <div className="p-2 border-b border-white/10">
                        <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-slate-500">
                          Categories
                        </div>
                        {suggestCategories.map((c) => (
                          <button
                            key={c.category}
                            type="button"
                            onClick={() => {
                              navigate(
                                `/products?category=${encodeURIComponent(
                                  c.category,
                                )}`,
                              );
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="w-full text-left sidebar-link text-xs py-2"
                          >
                            <Tag className="w-4 h-4" /> {c.category}
                            <span className="ml-auto text-slate-500 text-[11px]">
                              {c.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {!suggestLoading && suggestProducts.length > 0 && (
                      <div className="p-2">
                        <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-slate-500">
                          Products
                        </div>
                        {suggestProducts.map((p) => (
                          <button
                            key={p._id}
                            type="button"
                            onClick={() => {
                              navigate(`/products/${p._id}`);
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="w-full text-left sidebar-link text-xs py-2"
                          >
                            <span className="truncate">{p.name}</span>
                            <span className="ml-auto text-slate-400 text-[11px]">
                              ₹{p.price?.toLocaleString("en-IN")}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {!suggestLoading &&
                      suggestProducts.length === 0 &&
                      suggestCategories.length === 0 && (
                        <div className="px-4 py-3 text-xs text-slate-500">
                          No results
                        </div>
                      )}
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-4 animate-slide-up glass-dark backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block sidebar-link mb-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
