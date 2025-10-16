import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import CartApi from '@/api/CartApi'

interface CartState {
  count: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: CartState = {
  count: 0,
  status: 'idle',
}

export const fetchCartCount = createAsyncThunk<number, void>(
  'cart/fetchCartCount',
  async () => {
    const token = Cookies.get('token')
    const userId = Cookies.get('id')
    if (!token || !userId) return 0
    const api = new CartApi(token)
    const count = await api.getCartCount(Number(userId))
    return count
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCount(state, action: PayloadAction<number>) {
      state.count = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartCount.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCartCount.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.count = action.payload
      })
      .addCase(fetchCartCount.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { setCount } = cartSlice.actions
export default cartSlice.reducer
