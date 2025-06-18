import { createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit'
import { selectCurrentUsername } from '../auth/authSlice'
import { client } from '@/api/client'

import { RootState } from '@/app/types'
import { createAppAsyncThunk } from '@/app/withTypes'
import { apiSlice } from '../api/apiSlice'

export interface User {
  id: string
  name: string
}

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<User[]>('/fakeApi/users')
  return response.data
})

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  },
})

// This is the _same_ reference as `apiSlice`, but this has
// the TS types updated to include the injected endpoints
export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User, string>, void>({
      query: () => '/users',
      transformResponse(res: User[]) {
        // Create a normalized state object containing all the user items
        return usersAdapter.setAll(initialState, res)
      },
    }),
  }),
})

export const { useGetUsersQuery } = apiSliceWithUsers

export const selectUsersResult = apiSliceWithUsers.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  // Fall back to the empty entity state if no response yet.
  (result) => result.data ?? initialState,
)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (currentUsername) {
    return selectUserById(state, currentUsername)
  }
}

export const usersReducer = usersSlice.reducer

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(selectUsersData)
