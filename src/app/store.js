// This is where we create the Redux store instance
import { configureStore } from '@reduxjs/toolkit'
import { postsReducer } from '../features/posts/postsSlice'

// below we have our top-level state object and we give it a field names posts. Now, all the data for state.posts gets updated by the postsReducer function when actions are dispatched. 
export default configureStore({
  reducer: {
    posts: postsReducer
  }
})
