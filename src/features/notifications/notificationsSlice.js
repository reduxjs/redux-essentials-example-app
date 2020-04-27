import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const [latestNotification] = selectAllNotifications(getState())
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.notifications
  }
)

const notificationsAdapter = createEntityAdapter({
  // Sort reverse-chronologically
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
} = notificationsAdapter.getSelectors((state) => state.notifications)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
    notificationRead(state, action) {
      const notification = state.entities[action.payload]
      if (notification) {
        notification.read = true
      }
    },
  },
  extraReducers: {
    [fetchNotifications.fulfilled]: notificationsAdapter.upsertMany,
  },
})

export const {
  notificationRead,
  allNotificationsRead,
} = notificationsSlice.actions

export default notificationsSlice.reducer
