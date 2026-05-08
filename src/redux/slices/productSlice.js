import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api.js'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products')
  }
})

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch product')
  }
})

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/featured')
    return data.products
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured')
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    featured: [],
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    filters: {
      keyword: '',
      category: '',
      minPrice: 0,
      maxPrice: 100000,
      rating: 0,
      sort: '-createdAt',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearProduct: (state) => {
      state.product = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.totalProducts = action.payload.totalProducts
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchProduct.pending, (state) => { state.loading = true })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.product = action.payload })
      .addCase(fetchProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.featured = action.payload })
  },
})

export const { setFilters, clearProduct } = productSlice.actions
export default productSlice.reducer
