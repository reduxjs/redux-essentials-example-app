import {
  createAction,
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  isAnyOf,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { forceGenerateNotifications } from '../../api/server'
import { apiSlice } from '../api/apiSlice'
import { createSelector } from '@reduxjs/toolkit'
const notificationsReceived = createAction(
  'notifications/notificationsReceived'
)
export const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        const ws = new WebSocket('ws://localhost')
        try {
          await cacheDataLoaded
          const listner = (event) => {
            const message = JSON.parse(event.data)
            switch (message.type) {
              case 'notifications': {
                updateCachedData((draft) => {
                  draft.push(...message.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })
                dispatch(notificationsReceived(message.payload))
                break
              }
              default:
                break
            }
          }
          ws.addEventListener('message', listner)
        } catch (error) {}
        await cacheEntryRemoved
        ws.close()
      },
    }),
  }),
})

export const { useGetNotificationsQuery } = extendedApi

const notificationsAdapter = createEntityAdapter()
const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  extendedApi.endpoints.getNotifications.matchFulfilled
)

const emptyNotifications = []

export const selectNotificationsResult =
  extendedApi.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications
)

export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState())
  const [latestNotification] = allNotifications
  const latestTimeStamp = latestNotification?.data ?? ''
  forceGenerateNotifications(latestTimeStamp)
}
// const notificationsAdapter = createEntityAdapter({
//   sortComparer: (a, b) => b.date.localeCompare(a.date),
// })
const initialState = notificationsAdapter.getInitialState()
// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetchNotifications',
//   async (_, { getState }) => {
//     const allNotifications = selectAllNotifications(getState())
//     const [latestNotification] = allNotifications
//     const latestTimeStamp = latestNotification ? latestNotification.date : ''
//     const response = await client.get(`
//     /fakeApi/notifications?since=${latestTimeStamp}`)
//     return response.data
//   }
// )

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state, action) {
      Object.entries(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addMatcher(matchNotificationsReceived, (state, action) => {
      const notificationsMetaData = action.payload.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }))
      Object.values(state.entities).forEach((notification) => {
        notification.isNew = !notification.read
      })
      notificationsAdapter.upsertMany(state, notificationsMetaData)
    })
    // [fetchNotifications.fulfilled]: (state, action) => {
    //   Object.entries(state.entities).forEach((notification) => {
    //     notification.isNew = !notification.read
    //   })
    //   notificationsAdapter.upsertMany(state, action.payload)
    // },
  },
})
export const { allNotificationsRead } = notificationsSlice.actions
export default notificationsSlice.reducer
export const {
  selectAll: selectNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = notificationsAdapter.getSelectors((state) => state.notifications)
