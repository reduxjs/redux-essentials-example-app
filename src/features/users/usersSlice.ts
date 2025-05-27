import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { selectCurrentUsername } from '../auth/authSlice'
import { client } from '@/api/client'

import { RootState } from '@/app/types'
import { createAppAsyncThunk } from '@/app/withTypes'

interface User {
  id: string
  name: string
}

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<User[]>('/fakeApi/users')
  return response.data
})

const initialState: User[] = []

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  selectors: {
    selectAllUsers: (usersState) => usersState,
    selectUserById: (usersState, userId: string) => usersState.find((user) => user.id === userId),
  },
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (_, action) => {
      return action.payload
    })
  }
})

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state) || ''

  return selectUserById(state, currentUsername)
}

export const usersReducer = usersSlice.reducer
export const { selectAllUsers, selectUserById } = usersSlice.selectors
