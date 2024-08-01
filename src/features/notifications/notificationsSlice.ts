import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { client } from '@/api/client'

import type { RootState } from '@/app/store'
import { createAppAsyncThunk } from '@/app/withTypes'

import { apiSlice } from '@/features/api/apiSlice'

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

// Replaces `ClientNotification`, since we just need these fields
export interface NotificationMetadata {
  id: string
  read: boolean
  isNew: boolean
}

export const fetchNotifications = createAppAsyncThunk('notifications/fetchNotifications', async (_unused, thunkApi) => {
  const response = await client.get<ServerNotification[]>(`/fakeApi/notifications`)
  return response.data
})

export const apiSliceWithNotifications = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ServerNotification[], void>({
      query: () => '/notifications',
    }),
  }),
})

export const { useGetNotificationsQuery } = apiSliceWithNotifications

const metadataAdapter = createEntityAdapter<NotificationMetadata>()

const initialState = metadataAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((metadata) => {
        metadata.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addMatcher(apiSliceWithNotifications.endpoints.getNotifications.matchFulfilled, (state, action) => {
      // Add client-side metadata for tracking new notifications
      const notificationsMetadata: NotificationMetadata[] = action.payload.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }))

      Object.values(state.entities).forEach((metadata) => {
        // Any notifications we've read are no longer new
        metadata.isNew = !metadata.read
      })

      metadataAdapter.upsertMany(state, notificationsMetadata)
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const { selectAll: selectAllNotificationsMetadata, selectEntities: selectMetadataEntities } =
  metadataAdapter.getSelectors((state: RootState) => state.notifications)

export const selectUnreadNotificationsCount = (state: RootState) => {
  const allMetadata = selectAllNotificationsMetadata(state)
  const unreadNotifications = allMetadata.filter((metadata) => !metadata.read)
  return unreadNotifications.length
}
