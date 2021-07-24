import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice'

const usersAdapter = createEntityAdapter()
const usersInitialState = usersAdapter.getInitialState()

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (res) => {
        return usersAdapter.setAll(usersInitialState, res.users)
      },
    }),
  }),
})

export const { useGetUsersQuery } = extendedApi

export const selectUsersResult = extendedApi.endpoints.getUsers.select()
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
)

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? usersInitialState
)
