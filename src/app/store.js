import { configureStore } from "@reduxjs/toolkit";
import postSlice from "../features/posts/postSlice";
import logger from "redux-logger";
import usersSlice from "../features/users/userSlice";
import notifications from "../features/notifications/notifications";

export default configureStore({
  reducer: {
    posts: postSlice,
    users: usersSlice,
    notifications: notifications
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});
