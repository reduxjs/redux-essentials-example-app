import { createSlice, nanoid } from '@reduxjs/toolkit'

import { client } from '../../api/client'

const initialState = [
  { id: 1, title: 'First Post!', content: 'Hello!' },
  { id: 2, title: 'Second Post', content: 'More text' },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
          },
        }
      },
    },
    postsLoaded(state, action) {
      return action.payload
    },
  },
})

export const { postAdded, postsLoaded } = postsSlice.actions

export default postsSlice.reducer

export const fetchPosts = () => async (dispatch) => {
  const response = await client.get('/fakeApi/posts')
  dispatch(postsLoaded(response.posts))
}
