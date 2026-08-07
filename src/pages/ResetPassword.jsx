import { useMemo, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldCheck } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import Button from '../components/Button.jsx'
import api from '../utils/api.js'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialEmail = searchParams.get('email') || ''
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: initialEmail,
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })

  const passwordsMatch = useMemo(
    () => !form.newPassword || !form.confirmPassword || form.newPassword === form.confirmPassword,
    [form.newPassword, form.confirmPassword]
  )

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/verify-reset-otp', {
        email: form.email,
        otp: form.otp,
      })
      toast.success('OTP verified')
      setVerified(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    if (!passwordsMatch) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      })
      toast.success('Password updated successfully')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Reset Password – Arsh Mart" noindex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="glass-card p-8">
            <h1 className="text-xl font-display font-bold text-[#2a365b] text-center mb-2">
              Reset password
            </h1>
            <p className="text-slate-500 text-sm text-center mb-6">
              Verify your OTP, then set a new password
            </p>

            <form onSubmit={verified ? handleReset : handleVerify} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    className="input-field pl-10"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">OTP</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    className="input-field pl-10 tracking-[0.5em]"
                    placeholder="123456"
                    value={form.otp}
                    onChange={(e) => setForm((f) => ({ ...f, otp: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {!verified ? (
                <Button type="button" className="w-full justify-center py-3.5" onClick={handleVerify} loading={loading}>
                  Verify OTP
                </Button>
              ) : (
                <>
                  <div>
                    <label className="label">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        className="input-field pl-10"
                        placeholder="New password"
                        value={form.newPassword}
                        onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        className="input-field pl-10"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {!passwordsMatch && (
                    <p className="text-sm text-red-400">Passwords do not match</p>
                  )}

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full justify-center py-3.5"
                    disabled={!passwordsMatch}
                  >
                    Update Password
                  </Button>
                </>
              )}
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Need a new OTP?{' '}
              <Link to="/forgot-password" className="text-primary-400 hover:text-primary-300 font-medium">
                Try again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
