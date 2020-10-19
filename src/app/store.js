import { configureStore } from '@reduxjs/toolkit'
import postReducer from '../features/posts/postsSlice'
export default configureStore({
  reducer: {
    posts: postReducer,
  },
})
