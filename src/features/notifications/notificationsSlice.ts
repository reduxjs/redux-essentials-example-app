import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '@/api/client'

import type { RootState } from '@/app/store'

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

export interface Notification extends ServerNotification {
  read: boolean
  isNew: boolean
}

export const fetchNotifications = createAsyncThunk<
  ServerNotification[],
  void,
  {
    state: RootState
  }
>('notifications/fetchNotifications', async (_, { getState }) => {
  const allNotifications = selectAllNotifications(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification ? latestNotification.date : ''
  const response = await client.get<ServerNotification[]>(
    `/fakeApi/notifications?since=${latestTimestamp}`,
  )
  return response.data
})

const initialState: Notification[] = []

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      state.forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      // Add client-side metadata for tracking new notifications
      const notificationsWithMetadata: Notification[] = action.payload.map(
        (notification) => ({
          ...notification,
          read: false,
          isNew: true,
        }),
      )

      state.forEach((notification) => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })

      state.push(...notificationsWithMetadata)
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectAllNotifications = (state: RootState) => state.notifications
