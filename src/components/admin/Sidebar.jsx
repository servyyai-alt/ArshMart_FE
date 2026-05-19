import { NavLink, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Image,
  RotateCcw,
  Settings,
  LogOut,
  ChevronLeft,
  Store,
} from "lucide-react";
import { logout } from "../../redux/slices/authSlice.js";
import SandhaiKart_logo from "../../assets/images/SandhaiKart_logo.jpeg";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/returns", icon: RotateCcw, label: "Returns" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/gallery", icon: Image, label: "Gallery" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-60"} flex-shrink-0 h-screen sticky top-0 flex flex-col glass-dark border-r border-white/5 transition-all duration-300 z-40`}
    >
      {/* Logo */}
      <div
        className={`flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-5"} h-16 border-b border-white/5`}
      >
        {!collapsed && (
          <div className="flex-1 flex justify-start">
            <Link to="/" className="rounded-full">
              <img
                src={SandhaiKart_logo}
                alt="Sandhaikart Logo"
                className="w-[50%] object-contain rounded-full"
              />
            </Link>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={`text-slate-500 hover:text-white transition-colors ${collapsed ? "hidden" : ""}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/5 space-y-1">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-400 text-xs font-bold">
                {user.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {user.name}
              </p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
