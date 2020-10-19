const { createSlice } = require('@reduxjs/toolkit')

const initialState = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' },
]
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded(state, action) {
      return [...state, action.payload]
    },
  },
})
export const { postAdded } = postsSlice.actions

export default postsSlice.reducer
