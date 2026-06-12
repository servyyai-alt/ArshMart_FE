import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/api.js'
import { addToCart } from '../redux/slices/cartSlice.js'

const MAX_QUANTITY = 99

const parseItems = (itemsParam) => {
  if (!itemsParam) return []

  const itemMap = new Map()
  const parts = itemsParam.split(',').slice(0, 50)

  for (const part of parts) {
    const [rawId, rawQty] = part.split(':')
    const productId = (rawId || '').trim()
    const quantity = Number.parseInt(rawQty, 10)

    if (!/^[a-zA-Z0-9_-]{6,64}$/.test(productId) || !Number.isInteger(quantity) || quantity <= 0) {
      continue
    }

    const safeQuantity = Math.min(quantity, MAX_QUANTITY)
    itemMap.set(productId, (itemMap.get(productId) || 0) + safeQuantity)
  }

  return Array.from(itemMap, ([productId, quantity]) => ({
    productId,
    quantity: Math.min(quantity, MAX_QUANTITY),
  }))
}

export default function WhatsAppCart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading: authLoading } = useSelector((state) => state.auth)
  const processedRef = useRef(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (processedRef.current) return
    processedRef.current = true

    const prepareCart = async () => {
      const params = new URLSearchParams(location.search)
      const parsedItems = parseItems(params.get('items'))

      if (!parsedItems.length) {
        setError(true)
        return
      }

      let addedCount = 0

      await Promise.all(
        parsedItems.map(async ({ productId, quantity }) => {
          try {
            const { data } = await api.get(`/products/${productId}`)
            const product = data?.product
            if (!product?._id) return

            const stock = Number(product.stock)
            if (!Number.isFinite(stock) || stock <= 0) return

            dispatch(addToCart({ product, quantity: Math.min(quantity, stock) }))
            addedCount += 1
          } catch {
            // Invalid or unavailable products are ignored so one bad item does not block checkout.
          }
        })
      )

      if (addedCount === 0) {
        setError(true)
        return
      }

      navigate(user ? '/checkout' : '/login?redirect=checkout', { replace: true })
    }

    prepareCart()
  }, [authLoading, dispatch, location.search, navigate, user])

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center">
        {error ? (
          <p className="text-slate-700 font-medium">
            Unable to prepare cart. Please try again from WhatsApp.
          </p>
        ) : (
          <p className="text-slate-700 font-medium">
            Preparing your cart from WhatsApp...
          </p>
        )}
      </div>
    </div>
  )
}
