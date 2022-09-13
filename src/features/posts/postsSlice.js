import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    // This is our array of posts
    {id: '1', title: 'First Post!', content: 'Hello!'},
    {id: '2', title: 'Second Post', content: 'More text'}
]
// below we give our slice it's initialState (the above array) and add its reducer function.
const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers: {}
})

export default postsSlice.reducer