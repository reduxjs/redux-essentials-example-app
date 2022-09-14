import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    // This is our array of posts
    {id: '1', title: 'First Post!', content: 'Hello!'},
    {id: '2', title: 'Second Post', content: 'More text'}
]
// below we give our slice it's initialState (the above array) and add its reducer function.
// WARNING: Don't try to use methods like Array.push outside of a createSlice function as you'll be trying to change state (without the immer library)
const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers: {
// here we're updating our our posts slice to add new post entries. The following method is our reducer function. We're pushing the new post (the payload) onto the end of our array.
// in the reducer, our createSlice automatically generated an "action creator" function.
        postAdded(state, action) {
            state.push(action.payload)
        }
    }
})

export const { postAdded } = postsSlice.actions

export default postsSlice.reducer