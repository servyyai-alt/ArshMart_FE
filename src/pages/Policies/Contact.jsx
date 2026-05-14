import PolicyLayout from './PolicyLayout.jsx'

export default function Contact() {
  return (
    <PolicyLayout
      title="Contact Us"
      subtitle="We’re here to help with orders, returns, shipping, and payments."
    >
      <p><strong>Last updated:</strong> May 13, 2026</p>

      <h2>Support</h2>
      <ul>
        <li><strong>Email:</strong> support@sandhaikart.com</li>
        <li><strong>Phone:</strong> +91 98765 43210</li>
        <li><strong>Address:</strong> 123, Commerce Street, Chennai, Tamil Nadu 600001</li>
      </ul>

      <h2>Payments (Razorpay)</h2>
      <p>
        If you see a payment error, share your order ID and payment reference (if any). Payments are processed via Razorpay.
      </p>

      <h2>Shipping (Shiprocket)</h2>
      <p>
        For delivery and tracking issues, share your order ID and tracking number (AWB) if available. Shipping is handled via Shiprocket/courier partners.
      </p>
    </PolicyLayout>
  )
}

