import { configureStore } from '@reduxjs/toolkit'

import { postsReducer } from '@/features/posts/postsSlice'
import { usersReducer } from '@/features/users/usersSlice'
import { authReducer } from '@/features/auth/authSlice'
import { notificationsReducer } from '@/features/notifications/notificationsSlice'
import { listenerMiddleware } from './listenerMiddleware'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    auth: authReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})
