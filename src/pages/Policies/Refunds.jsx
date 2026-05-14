import PolicyLayout from './PolicyLayout.jsx'

export default function Refunds() {
  return (
    <PolicyLayout
      title="Returns, Refunds & Cancellation Policy"
      subtitle="How cancellations and refunds are handled for orders paid via Razorpay or other methods."
    >
      <p><strong>Last updated:</strong> May 13, 2026</p>

      <h2>1. Order Cancellation</h2>
      <ul>
        <li>You may request cancellation before the order is shipped.</li>
        <li>Once shipped, cancellation may not be possible and a return process may apply.</li>
      </ul>

      <h2>2. Returns</h2>
      <p>
        If a product is eligible for return, you can request a return within the return window shown on the product page/order page.
        Returned items must be unused, in original condition, and with original packaging unless the item was delivered damaged/defective.
      </p>

      <h2>3. Refunds (Razorpay)</h2>
      <p>
        Refunds for prepaid orders are processed back to the original payment method via Razorpay/payment partner after the return is approved.
        Refund timelines may vary by bank/payment provider after we initiate the refund.
      </p>

      <h2>4. Refund Timelines</h2>
      <ul>
        <li><strong>Cancellation (before shipment):</strong> typically 3–7 business days after approval</li>
        <li><strong>Return (after pickup/verification):</strong> typically 5–10 business days after approval</li>
      </ul>

      <h2>5. Non-returnable Items</h2>
      <p>Some items may be non-returnable due to hygiene, safety, or other reasons. Such items will be marked on the product page.</p>

      <h2>6. Contact</h2>
      <p>For return/refund requests, contact support via the Contact page with your order ID.</p>
    </PolicyLayout>
  )
}

