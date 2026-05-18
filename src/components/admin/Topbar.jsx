import { Menu, Bell, Search, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Topbar({ title, subtitle, onMenuToggle }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 glass-dark sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="btn-ghost p-2 rounded-lg md:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-white font-semibold text-base leading-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/"
          target="_blank"
          className="btn-ghost text-xs py-2 px-3 rounded-lg hidden sm:flex"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Store
        </Link>
        {/* <button className="btn-ghost p-2.5 rounded-xl relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full" />
        </button> */}
      </div>
    </header>
  )
}
