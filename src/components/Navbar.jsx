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
  RotateCcw,
  Tag,
  Sparkles,
  ChevronDown,
  Truck,
  BadgePercent,
  ShieldCheck,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import SearchInputBox from "./navbar/SearchInputBox.jsx";
import { logout } from "../redux/slices/authSlice.js";
import { selectCartCount } from "../redux/slices/cartSlice.js";
import Logo from "./Logo.jsx";
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
  const [navCategories, setNavCategories] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setNavCategories(res.data.categories || []))
      .catch(() => setNavCategories([]));
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
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    ...navCategories.slice(0, 3).map((c) => ({
      to: `/products?category=${encodeURIComponent(c.name)}`,
      label: c.name,
    })),
    { to: "/products?sort=discount", label: "Deals" },
  ];

  const announcementItems = [
    "Free delivery on orders above ₹499",
    "Use code AREMBI10 for 10% off your first order",
    "New premium arrivals every week",
    "Easy 7-day returns & refunds",
    "Cash on delivery available",
  ];

  const isActiveLink = (to) => {
    const [path, query] = to.split("?");
    if (!query) return location.pathname === path;
    return location.pathname + location.search === to;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-amber-900/5"
          : "bg-white/85 backdrop-blur-xl border-b border-amber-100"
      }`}
    >
      {/* Announcement marquee */}
      <div
        className={`overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white transition-all duration-500 ${
          scrolled ? "hidden" : "block"
        }`}
      >
        <div className="flex whitespace-nowrap animate-ticker w-max">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center gap-8 py-2 pr-8">
              {announcementItems.map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 text-[11px] font-semibold tracking-wide"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-100" />
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 h-[68px]">
          {/* Left: Logo */}
          <div className="flex justify-start">
            <Logo className="scale-100" />
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="hidden lg:flex items-center justify-center gap-0.5 min-w-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`group relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap rounded-xl ${
                  isActiveLink(link.to)
                    ? "text-amber-700"
                    : "text-slate-600 hover:text-amber-700"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-3.5 right-3.5 -bottom-0.5 h-[3px] rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-transform duration-200 ${
                    isActiveLink(link.to)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-1.5 w-full">
            <SearchInputBox
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              categories={navCategories}
              onPickCategory={(c) => {
                navigate(`/products?category=${encodeURIComponent(c.name)}`);
                setSearchQuery("");
              }}
            />

            {/* Mobile Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/products"
              aria-label="Shop"
              title="Shop"
              className={`p-2.5 hidden sm:flex rounded-xl transition-all duration-200 ${
                location.pathname.startsWith("/products")
                  ? "text-amber-700 bg-amber-50"
                  : "text-slate-700 hover:text-amber-700 hover:bg-amber-50"
              }`}
            >
              <Package className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              title="Wishlist"
              className={`p-2.5 hidden sm:flex rounded-xl transition-all duration-200 ${
                location.pathname === "/wishlist"
                  ? "text-amber-700 bg-amber-50"
                  : "text-slate-700 hover:text-amber-700 hover:bg-amber-50"
              }`}
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              title="Cart"
              className="p-2.5 rounded-xl relative text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md shadow-amber-500/40">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-xl hover:bg-amber-50 transition-colors border border-transparent"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white shadow-md shadow-amber-500/30 flex items-center justify-center text-white">
                    <span className="text-xs font-bold">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block max-w-24 truncate text-slate-700">
                    {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 hidden sm:block text-slate-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-2xl shadow-amber-900/10 overflow-hidden border border-amber-100 animate-slide-up z-50">
                    <div className="px-4 py-3.5 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                      <p className="text-slate-900 font-semibold text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-slate-400 text-xs truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link
                        to="/returns"
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" /> My Returns
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin
                        </Link>
                      )}
                      <div className="my-1.5 h-px bg-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium w-full text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-white min-w-fit py-2.5 px-4 text-sm"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search bar */}
        {searchOpen && (
          <div className="pb-4 animate-slide-up">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or categories..."
                  className="w-full bg-white border border-amber-200 rounded-xl pl-10 pr-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 lg:hidden shadow-sm"
                />

                {(suggestLoading ||
                  suggestProducts.length > 0 ||
                  suggestCategories.length > 0) && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-2xl shadow-amber-900/10 z-50">
                    {suggestLoading && (
                      <div className="px-4 py-3 text-xs text-slate-400">
                        Searching…
                      </div>
                    )}

                    {!suggestLoading && suggestCategories.length > 0 && (
                      <div className="p-1.5 border-b border-slate-100">
                        <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-amber-600 font-semibold">
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
                            className="w-full text-left flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700"
                          >
                            <Tag className="w-4 h-4 text-amber-400" />{" "}
                            {c.category}
                            <span className="ml-auto text-slate-400 text-[11px]">
                              {c.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {!suggestLoading && suggestProducts.length > 0 && (
                      <div className="p-1.5">
                        <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-amber-600 font-semibold">
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
                            className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700"
                          >
                            <span className="truncate">{p.name}</span>
                            <span className="ml-auto text-slate-400 text-[11px] font-medium">
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
          <div className="lg:hidden pb-4 border-t border-amber-100 pt-3 animate-slide-up">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
              {[
                { icon: Truck, label: "Free Delivery", sub: "on ₹499+" },
                { icon: RefreshCw, label: "7-day", sub: "easy returns" },
                { icon: BadgePercent, label: "Deals", sub: "up to 50% off" },
                { icon: CreditCard, label: "COD & Cards", sub: "secure pay" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl bg-amber-50/70 ring-1 ring-amber-100 px-3 py-2.5"
                >
                  <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-slate-800">
                      {label}
                    </p>
                    <p className="text-[11px] text-slate-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Link
                to="/"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Home
                </span>
              </Link>
              <Link
                to="/products"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700"
              >
                <span className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-amber-600" /> Shop All
                </span>
                <Tag className="w-4 h-4 text-slate-300" />
              </Link>
              <div className="overflow-y-auto max-h-64">
                {navCategories.map((c) => (
                  <Link
                    key={c._id || c.name}
                    to={`/products?category=${encodeURIComponent(c.name)}`}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500/70" />
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            {!user && (
              <Link
                to="/login"
                className="btn-primary text-white w-full mt-3 justify-center"
              >
                <User className="w-4 h-4" /> Sign In / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
