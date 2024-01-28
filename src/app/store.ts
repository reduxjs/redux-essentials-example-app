import { configureStore } from '@reduxjs/toolkit'

import postsReducer from '@/features/posts/postsSlice'
import usersReducer from '@/features/users/usersSlice'
import notificationsReducer from '@/features/notifications/notificationsSlice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
})

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
