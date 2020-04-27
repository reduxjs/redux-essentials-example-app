import { createSlice, nanoid } from '@reduxjs/toolkit'

import { client } from '../../api/client'

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
    postsLoading(state, action) {
      if (state.status === 'idle') {
        state.status = 'loading'
        state.error = null
      }
    },
    postsLoaded(state, action) {
      if (state.status === 'loading') {
        state.posts = action.payload
        state.status = 'succeeded'
      }
    },
    loadingFailed(state, action) {
      if (state.status === 'loading') {
        state.status = 'failed'
        state.error = action.payload
      }
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
})

export const {
  postAdded,
  postsLoading,
  postsLoaded,
  loadingFailed,
  postUpdated,
  reactionAdded,
} = postsSlice.actions

export default postsSlice.reducer

export const fetchPosts = () => async (dispatch) => {
  try {
    dispatch(postsLoading())
    const response = await client.get('/fakeApi/posts')
    dispatch(postsLoaded(response.posts))
  } catch (err) {
    dispatch(loadingFailed(err.message))
  }
}

export const selectAllPosts = (state) => state.posts.posts
