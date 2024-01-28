import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '@/api/client'

import type { RootState } from '@/app/store'

export interface Notification {
  id: string
  date: string
  message: string
  user: string
}

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  {
    state: RootState
  }
>('notifications/fetchNotifications', async (_, { getState }) => {
  const allNotifications = selectAllNotifications(getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification ? latestNotification.date : ''
  const response = await client.get<Notification[]>(
    `/fakeApi/notifications?since=${latestTimestamp}`,
  )
  return response.data
})

const initialState: Notification[] = []

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export default notificationsSlice.reducer

export const selectAllNotifications = (state: RootState) => state.notifications
