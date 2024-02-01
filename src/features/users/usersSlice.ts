import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit'

import type { RootState } from '@/app/store'

import { apiSlice } from '@/features/api/apiSlice'

export interface User {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User, string>, void>({
      query: () => '/users',
      transformResponse: (res: User[]) => {
        return usersAdapter.setAll(initialState, res)
      },
    }),
  }),
})

export const { useGetUsersQuery } = extendedApiSlice

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

export const selectUsersData = createSelector(selectUsersResult, (usersResult) => usersResult.data)

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(
  (state: RootState) => selectUsersData(state) ?? initialState,
)
