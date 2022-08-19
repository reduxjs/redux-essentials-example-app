import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: '1', title: 'First Post', content: 'Hello' },
  { id: '1', title: 'Second Post', content: 'More Text' },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
})

export default postsSlice.reducer