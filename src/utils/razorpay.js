import api from './api.js'

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const initiatePayment = async ({ amount, orderId, user, onSuccess, onFailure }) => {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    onFailure?.('Failed to load Razorpay SDK')
    return
  }

  try {
    // Create Razorpay order via backend
    const { data } = await api.post('/payment/create-order', {
      amount,
      orderId,
      currency: 'INR',
    })

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'Sandhaikart',
      description: 'Purchase at Sandhaikart',
      image: '/logo.svg',
      order_id: data.razorpayOrderId,
      handler: async (response) => {
        try {
          // Verify payment
          const verifyRes = await api.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          })
          onSuccess?.(verifyRes.data)
        } catch (err) {
          onFailure?.(err.message)
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone,
      },
      theme: {
        color: '#f97316',
      },
      modal: {
        ondismiss: () => onFailure?.('Payment cancelled'),
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  } catch (err) {
    onFailure?.(err.response?.data?.message || 'Payment initiation failed')
  }
}
