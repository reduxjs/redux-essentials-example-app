import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'

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

const notificationsAdapter = createEntityAdapter<Notification>({
  // Sort with newest first
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = notificationsAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
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

      Object.values(state.entities).forEach((notification) => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })

      notificationsAdapter.upsertMany(state, notificationsWithMetadata)
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state: RootState) => state.notifications)
