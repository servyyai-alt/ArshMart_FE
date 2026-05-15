import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, Package, CheckCircle } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import Button from '../components/Button.jsx'
import { selectCartTotal, clearCart } from '../redux/slices/cartSlice.js'
import { createOrder } from '../redux/slices/orderSlice.js'
import { initiatePayment } from '../utils/razorpay.js'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'confirm', label: 'Confirm', icon: CheckCircle },
]

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const { loading } = useSelector(state => state.orders)
  const subtotal = useSelector(selectCartTotal)
  const shipping = subtotal >= 499 ? 0 : 49
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  const [step, setStep] = useState('address')
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  })

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode']
    const missing = required.find(field => !address[field])
    if (missing) { toast.error('Please fill all required fields'); return }
    setStep('payment')
  }

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        orderItems: items.map(item => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0]?.url,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod: 'razorpay',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      }

      const resultAction = await dispatch(createOrder(orderData))
      if (createOrder.fulfilled.match(resultAction)) {
        const order = resultAction.payload
        initiatePayment({
          amount: total * 100,
          orderId: order._id,
          user,
          onSuccess: () => {
            dispatch(clearCart())
            toast.success('Order placed successfully! 🎉')
            navigate(`/orders`)
          },
          onFailure: (err) => {
            toast.error(err || 'Payment failed')
          },
        })
      }
    } catch (err) {
      toast.error('Failed to place order')
    }
  }

  return (
    <>
      <SEO title="Checkout – Sandhaikart" noindex />
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="page-header mb-8">Checkout</h1>

          {/* Progress */}
          <div className="flex items-center gap-4 mb-10">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  step === s.id
                    ? 'bg-primary-500 text-white'
                    : STEPS.findIndex(x => x.id === step) > i
                    ? 'glass text-green-400 border-green-500/30'
                    : 'glass text-slate-500'
                }`}>
                  <s.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className="h-px w-8 bg-white/10" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 'address' && (
                <div className="glass-card p-6 animate-fade-in">
                  <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-400" />
                    Delivery Address
                  </h2>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name *</label>
                        <input className="input-field" value={address.fullName} onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="label">Phone *</label>
                        <input className="input-field" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} required />
                      </div>
                    </div>
                    <div>
                      <label className="label">Address Line 1 *</label>
                      <input className="input-field" value={address.addressLine1} onChange={e => setAddress(a => ({ ...a, addressLine1: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="label">Address Line 2</label>
                      <input className="input-field" value={address.addressLine2} onChange={e => setAddress(a => ({ ...a, addressLine2: e.target.value }))} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="label">City *</label>
                        <input className="input-field" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="label">State *</label>
                        <input className="input-field" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="label">Pincode *</label>
                        <input className="input-field" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} required />
                      </div>
                    </div>
                    <Button type="submit" className="w-full justify-center py-4 mt-2">
                      Continue to Payment
                    </Button>
                  </form>
                </div>
              )}

              {step === 'payment' && (
                <div className="glass-card p-6 animate-fade-in">
                  <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-400" />
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <div className="glass-card p-4 border border-primary-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Pay via Razorpay</p>
                          <p className="text-slate-500 text-xs">UPI, Cards, Netbanking, Wallets</p>
                        </div>
                        <img src="https://w7.pngwing.com/pngs/93/992/png-transparent-razorpay-logo-tech-companies.png" alt="Razorpay" className="h-8 w-39 ml-auto opacity-60" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep('address')} className="btn-secondary flex-1 justify-center py-3">
                      Back
                    </button>
                    <Button onClick={() => setStep('confirm')} className="flex-1 justify-center py-3">
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {step === 'confirm' && (
                <div className="glass-card p-6 animate-fade-in">
                  <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-400" />
                    Order Review
                  </h2>

                  <div className="space-y-3 mb-6">
                    {items.map(item => (
                      <div key={item._id} className="flex items-center gap-3 py-2 border-b border-white/5">
                        <span className="text-slate-400 text-sm flex-1 line-clamp-1">{item.name}</span>
                        <span className="text-slate-400 text-sm">×{item.quantity}</span>
                        <span className="text-white font-medium text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="glass p-4 rounded-xl mb-6 text-sm">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Delivering to</p>
                    <p className="text-white">{address.fullName} · {address.phone}</p>
                    <p className="text-slate-400 text-sm">{address.addressLine1}, {address.city}, {address.state} {address.pincode}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('payment')} className="btn-secondary flex-1 justify-center py-3">
                      Back
                    </button>
                    <Button onClick={handlePlaceOrder} loading={loading} className="flex-1 justify-center py-3">
                      Pay ₹{total.toLocaleString('en-IN')}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="glass-card p-5 sticky top-24">
                <h3 className="text-white font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span className="text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Shipping</span><span className={shipping === 0 ? 'text-green-400' : 'text-slate-200'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">GST (18%)</span><span className="text-slate-200">₹{tax.toLocaleString('en-IN')}</span></div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white text-base">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
