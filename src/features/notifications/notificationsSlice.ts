import { createEntityAdapter, createSlice, createSelector } from '@reduxjs/toolkit'

import { forceGenerateNotifications } from '@/api/server'
import type { AppThunk, RootState } from '@/app/store'

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

export const apiSliceWithNotifications = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ServerNotification[], void>({
      query: () => '/notifications',
    }),
  }),
})

export const { useGetNotificationsQuery } = apiSliceWithNotifications

export const fetchNotificationsWebsocket = (): AppThunk => (dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification?.date ?? ''
  // Hardcode a call to the mock server to simulate a server push scenario over websockets
  forceGenerateNotifications(latestTimestamp)
}

const emptyNotifications: ServerNotification[] = []

export const selectNotificationsResult = apiSliceWithNotifications.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications,
)

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
