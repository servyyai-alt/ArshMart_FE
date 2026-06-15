import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api.js'

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', orderData)
    return data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Order creation failed')
  }
})

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/my')
    return data.orders
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders')
  }
})

export const fetchOrderById = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`)
    return data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch order')
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    order: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrderSuccess: (state) => { state.success = false },
    clearOrderError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; state.success = true })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchMyOrders.pending, (state) => { state.loading = true })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.order = action.payload })
      .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { clearOrderSuccess, clearOrderError } = orderSlice.actions
export default orderSlice.reducer
