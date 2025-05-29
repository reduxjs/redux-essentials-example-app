import { createSelector, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'

import { logout } from '@/features/auth/authSlice'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/withTypes'
import { RootState } from '@/app/types'

export interface Post {
  id: string
  title: string
  content: string
  user: string
  date: string
  reactions: Reactions
}
export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}
interface PostsState {
  posts: Post[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed' | 'rejected'
  error: string | null
}

export type ReactionName = keyof Reactions

type EditPostType = Pick<Post, 'id' | 'title' | 'content'>
type NewPost = Pick<Post, 'title' | 'content' | 'user'>

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null,
}

export const fetchPosts = createAppAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await client.get<Post[]>('/fakeApi/posts')
    return response.data
  },
  {
    condition(_, thunkApi) {
      const postsStatus = selectPostsStatus(thunkApi.getState())
      if (postsStatus !== 'idle') {
        return false
      }
    },
  },
)

export const addNewPost = createAppAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost: NewPost) => {
    const response = await client.post<Post>('/fakeApi/posts', initialPost)

    return response.data
  },
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload)
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            user: userId,
            date: new Date().toISOString(),
            reactions: initialReactions,
          },
        }
      },
    },
    editPost(state, action: PayloadAction<EditPostType>) {
      const { id, title, content } = action.payload
      const currentPost = state.posts.find((post) => post.id === id)

      if (currentPost) {
        currentPost.title = title
        currentPost.content = content
      }
    },
    addReaction(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => {
        return initialState
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'pending'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.posts.push(...action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown Error'
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload)
      })
  },
  selectors: {
    selectAllPosts: (postsState) => postsState.posts,
    selectPostById: (postsState, postId: string) => postsState.posts.find((post) => post.id === postId),
    selectPostsStatus: (postsState) => postsState.status,
    selectPostsError: (postsState) => postsState.error,
    // rewrite selectPostsByUser to be a memoized function with createSelector below
    // selectPostsByUser: (postsState, userId: string) => postsState.posts.filter((post) => post.user === userId),
  },
})

export const { editPost, addReaction } = postsSlice.actions
export const { selectAllPosts, selectPostById, selectPostsStatus, selectPostsError } = postsSlice.selectors
export const postsReducer = postsSlice.reducer

export const selectPostsByUser = createSelector(
  [
    // we can pass in an existing selector function that
    // reads something from the root `state` and returns it
    selectAllPosts,
    // and another function that extracts one of the arguments
    // and passes that onward
    (state: RootState, userId: string) => userId,
  ],
  // the output function gets those values as its arguments,
  // and will run when either input value changes
  (posts, userId) => posts.filter((post) => post.user === userId),
)
