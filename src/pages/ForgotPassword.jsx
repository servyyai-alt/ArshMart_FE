import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import Button from '../components/Button.jsx'
import api from '../utils/api.js'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      toast.success('OTP sent to your email')
      navigate(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Forgot Password – Sandhaikart" noindex />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="glass-card p-8">
            <h1 className="text-xl font-display font-bold text-[#2a365b] text-center mb-2">
              Forgot password
            </h1>
            <p className="text-slate-500 text-sm text-center mb-6">
              Enter your email to receive an OTP
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full justify-center py-3.5">
                Send OTP
              </Button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Remembered it?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
