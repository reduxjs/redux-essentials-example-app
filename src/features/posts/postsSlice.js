import { createSlice, nanoid } from '@reduxjs/toolkit'

import { client } from '../../api/client'

const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
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
    postsLoaded(state, action) {
      return action.payload
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
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

export const fetchPosts = () => async (dispatch) => {
  const response = await client.get('/fakeApi/posts')
  dispatch(postsLoaded(response.posts))
}
