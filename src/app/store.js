import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice.js';
import usersReducer from '../features/users/usersSlice.js';
import notificationsSlice from '../features/notifications/notificationsSlice.js';

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsSlice,
  },
})
