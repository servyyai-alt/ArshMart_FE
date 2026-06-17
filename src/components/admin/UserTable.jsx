import { useState } from 'react'
import { Ban, CheckCircle, Shield, User } from 'lucide-react'

export default function UserTable({ users, onUpdate, loading }) {
  return (
    <div className="glass-card1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">User</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Mobile Number</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium hidden md:table-cell">Joined</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Role</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Status</th>
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="table-row">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-400 text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium">{user.name}</p>
                      <p className="text-slate-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-slate-200 text-sm">
                    {user.phone || '-'}
                  </span>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <span className="text-slate-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={user.role}
                    onChange={e => onUpdate({ id: user._id, role: e.target.value })}
                    className={`badge border text-xs py-1 px-2.5 cursor-pointer appearance-none bg-transparent ${
                      user.role === 'admin'
                        ? 'text-primary-400 bg-primary-500/10 border-primary-500/30'
                        : 'text-slate-400 bg-white/5 border-white/20'
                    }`}
                    disabled={loading}
                  >
                    <option value="user" className="bg-dark-800 text-white">User</option>
                    <option value="admin" className="bg-dark-800 text-white">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`badge text-xs border ${user.isBlocked ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-green-400 bg-green-500/10 border-green-500/30'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => onUpdate({ id: user._id, isBlocked: !user.isBlocked })}
                    className={`btn-ghost py-1.5 px-3 text-xs ${user.isBlocked ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                    disabled={loading}
                    title={user.isBlocked ? 'Unblock user' : 'Block user'}
                  >
                    {user.isBlocked
                      ? <><CheckCircle className="w-3.5 h-3.5" /> Unblock</>
                      : <><Ban className="w-3.5 h-3.5" /> Block</>
                    }
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="text-center py-12 text-slate-500">No users found</div>}
      </div>
    </div>
  )
}
