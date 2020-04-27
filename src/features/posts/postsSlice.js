import {
  createSlice,
  nanoid,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { client } from '../../api/client'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.posts
})

const postsAdapter = createEntityAdapter({
  // Sort chronologically
  sortComparer: (a, b) => a.date.localeCompare(b.date),
})

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
} = postsAdapter.getSelectors((state) => state.posts)

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    status: 'idle',
    error: null,
  }),
  reducers: {
    postAdded: {
      reducer: postsAdapter.addOne,
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes: 0,
            },
          },
        }
      },
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      postsAdapter.updateOne(state, { id, changes: { title, content } })
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      if (state.status === 'idle') {
        state.status = 'loading'
        state.error = null
      }
    },
    [fetchPosts.fulfilled]: (state, action) => {
      if (state.status === 'loading') {
        postsAdapter.upsertMany(state, action)
        state.status = 'succeeded'
      }
    },
    [fetchPosts.rejected]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed'
        state.error = action.payload
      }
    },
  },
})

export const {
  postAdded,
  postsLoaded,
  postUpdated,
  reactionAdded,
} = postsSlice.actions

export default postsSlice.reducer
