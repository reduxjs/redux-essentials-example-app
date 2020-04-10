import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: 1, title: 'First Post!', text: 'Hello!' },
  { id: 2, title: 'Second Post', text: 'More text' },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
})

export default postsSlice.reducer
