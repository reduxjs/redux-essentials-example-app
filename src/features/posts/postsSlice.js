import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'

import { client } from '../../api/client'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.posts
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    status: 'idle',
    posts: [],
    error: null,
  },
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
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
      const existingPost = state.posts.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
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
        state.posts = action.payload
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

export const selectAllPosts = (state) => state.posts.posts
