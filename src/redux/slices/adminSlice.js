import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api.js'

// Products
export const adminFetchProducts = createAsyncThunk('admin/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/products', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const adminCreateProduct = createAsyncThunk('admin/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/admin/products', productData)
    return data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const adminUpdateProduct = createAsyncThunk('admin/updateProduct', async ({ id, ...productData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/products/${id}`, productData)
    return data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const adminDeleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/products/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

// Categories
export const adminFetchCategories = createAsyncThunk('admin/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/categories')
    return data.categories
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const adminCreateCategory = createAsyncThunk('admin/createCategory', async (categoryData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/admin/categories', categoryData)
    return data.category
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const adminUpdateCategory = createAsyncThunk('admin/updateCategory', async ({ id, ...categoryData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/categories/${id}`, categoryData)
    return data.category
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const adminDeleteCategory = createAsyncThunk('admin/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/categories/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

// Orders
export const adminFetchOrders = createAsyncThunk('admin/fetchOrders', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/orders', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const adminUpdateOrder = createAsyncThunk('admin/updateOrder', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/orders/${id}`, { status })
    return data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

// Users
export const adminFetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/users')
    return data.users
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const adminUpdateUser = createAsyncThunk('admin/updateUser', async ({ id, ...userData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/users/${id}`, userData)
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

// Analytics
export const adminFetchAnalytics = createAsyncThunk('admin/fetchAnalytics', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/analytics')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    products: [],
    categories: [],
    orders: [],
    users: [],
    analytics: null,
    totalProducts: 0,
    totalOrders: 0,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearAdminState: (state) => {
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(adminFetchProducts.pending, pending)
      .addCase(adminFetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.totalProducts = action.payload.total
      })
      .addCase(adminFetchProducts.rejected, rejected)

      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload)
        state.success = true
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex(p => p._id === action.payload._id)
        if (idx !== -1) state.products[idx] = action.payload
        state.success = true
      })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload)
      })

      .addCase(adminFetchCategories.fulfilled, (state, action) => { state.categories = action.payload })
      .addCase(adminCreateCategory.fulfilled, (state, action) => { state.categories.unshift(action.payload) })
      .addCase(adminUpdateCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex(c => c._id === action.payload._id)
        if (idx !== -1) state.categories[idx] = action.payload
      })
      .addCase(adminDeleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload)
      })

      .addCase(adminFetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders
        state.totalOrders = action.payload.total
        state.loading = false
      })
      .addCase(adminUpdateOrder.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id)
        if (idx !== -1) state.orders[idx] = action.payload
      })

      .addCase(adminFetchUsers.fulfilled, (state, action) => { state.users = action.payload })
      .addCase(adminUpdateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u._id === action.payload._id)
        if (idx !== -1) state.users[idx] = action.payload
      })

      .addCase(adminFetchAnalytics.fulfilled, (state, action) => { state.analytics = action.payload })
  },
})

export const { clearAdminState } = adminSlice.actions
export default adminSlice.reducer
