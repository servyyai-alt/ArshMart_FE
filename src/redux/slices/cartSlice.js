import { createSlice } from '@reduxjs/toolkit'

const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('sandhaikart_cart')
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

const saveCartToStorage = (items) => {
  localStorage.setItem('sandhaikart_cart', JSON.stringify(items))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getCartFromStorage(),
    shippingAddress: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find(i => i._id === product._id)
      if (existing) {
        existing.quantity += quantity
        if (existing.quantity > product.stock) existing.quantity = product.stock
      } else {
        state.items.push({ ...product, quantity })
      }
      saveCartToStorage(state.items)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload)
      saveCartToStorage(state.items)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(i => i._id === id)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i._id !== id)
        }
      }
      saveCartToStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToStorage([])
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setShippingAddress } = cartSlice.actions

// Selectors
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)

export default cartSlice.reducer
