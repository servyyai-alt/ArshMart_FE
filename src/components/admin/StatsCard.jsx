import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ title, value, change, changeLabel, icon: Icon, color = 'primary' }) {
  const colors = {
    primary: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  }

  const isPositive = change >= 0

  return (
    <div className="glass-card1 p-6 flex flex-col gap-3 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white font-display">{value}</p>
        <p className="text-slate-400 text-sm">{title}</p>
        {changeLabel && <p className="text-slate-600 text-xs mt-0.5">{changeLabel}</p>}
      </div>
    </div>
  )
}
