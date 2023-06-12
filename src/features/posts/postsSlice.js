import { createSlice, nanoid } from "@reduxjs/toolkit" 
import { sub } from 'date-fns'

const initialState = {
    posts: [],
    status: 'idle',
    error: null
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: { 
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId, reactions) {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId,
                        reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
                    }
                }
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.posts.find(post => post.id === id)
            if (existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = state => state.posts.posts;

export const selectPostById = (state, postId) => 
    state.posts.posts.find(post => post.id === postId)

// It's often a good idea to encapsulate data lookups by writing reusable selectors but it's not something you should do all of the time.

// .find returns undefined if not true