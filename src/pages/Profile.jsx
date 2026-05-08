import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User, Mail, Phone, Save } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import Button from '../components/Button.jsx'
import { updateProfile } from '../redux/slices/authSlice.js'
import toast from 'react-hot-toast'

export default function Profile() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(state => state.auth)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(updateProfile(form))
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated!')
    } else {
      toast.error('Update failed')
    }
  }

  return (
    <>
      <SEO title="My Profile – Sandhaikart" noindex />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="page-header mb-8">My Profile</h1>

          <div className="grid gap-6">
            {/* Avatar card */}
            <div className="glass-card p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-400 text-2xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">{user?.name}</h2>
                <p className="text-slate-400 text-sm">{user?.email}</p>
                <span className={`badge mt-1.5 ${user?.role === 'admin' ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                  {user?.role || 'user'}
                </span>
              </div>
            </div>

            {/* Edit form */}
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-5">Personal Information</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input-field" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                </div>
                <Button type="submit" loading={loading}>
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
