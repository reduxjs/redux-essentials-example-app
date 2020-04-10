import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: 1, title: 'First Post!', content: 'Hello!' },
  { id: 2, title: 'Second Post', content: 'More text' },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    postAdded(state, action) {
      state.push(action.payload)
    },
    postsLoaded(state, action) {
      return action.payload
    },
  },
})

export const { postAdded, postsLoaded } = postsSlice.actions

export default postsSlice.reducer
