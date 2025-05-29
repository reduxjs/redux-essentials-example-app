import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/withTypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  username: string | null
}

const initialState: AuthState = {
  // fake simple auth
  username: null,
}

export const login = createAppAsyncThunk(
  'auth/login',
  async (username: string) => {
    await client.post('/fakeApi/login', { username })
    return username
  }
)

export const logout = createAppAsyncThunk('auth/logout', async () => {
  await client.post('/fakeApi/logout', {})
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.username = action.payload
      })
      .addCase(logout.fulfilled, state => {
        state.username = null
      })
  },
  selectors: { selectCurrentUsername: (state) => state.username },
})

export const authReducer = authSlice.reducer
export const { selectCurrentUsername } = authSlice.selectors
