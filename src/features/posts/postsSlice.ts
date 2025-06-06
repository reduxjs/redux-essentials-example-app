import { createEntityAdapter, createSelector, createSlice, EntityState, nanoid, PayloadAction } from '@reduxjs/toolkit'

import { logout } from '@/features/auth/authSlice'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/withTypes'
import { RootState } from '@/app/types'
import { AppStartListening } from '@/app/listenerMiddleware'

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
interface PostsState extends EntityState<Post, string> {
  status: 'idle' | 'pending' | 'succeeded' | 'rejected'
  error: string | null
}

export type ReactionName = keyof Reactions

export type EditPostType = Pick<Post, 'id' | 'title' | 'content'>
export type NewPost = Pick<Post, 'title' | 'content' | 'user'>


const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState: PostsState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

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
    editPost(state, action: PayloadAction<EditPostType>) {
      const { id, title, content } = action.payload
      postsAdapter.updateOne(state, { id, changes: { title, content } })
    },
    addReaction(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]

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
        postsAdapter.setAll(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.error.message ?? 'Unknown Error'
      })
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
  selectors: {
    selectPostsStatus: (postsState) => postsState.status,
    selectPostsError: (postsState) => postsState.error,
    // rewrite selectPostsByUser to be a memoized function with createSelector below
    // selectPostsByUser: (postsState, userId: string) => postsState.posts.filter((post) => post.user === userId),
  },
})

export const { editPost, addReaction } = postsSlice.actions
export const { selectPostsStatus, selectPostsError } = postsSlice.selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)
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

export const addPostsListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: addNewPost.fulfilled,
    effect: async (action, listenerApi) => {
      const { toast } = await import('react-tiny-toast')

      const toastId = toast.show('New post added!', {
        variant: 'success',
        position: 'bottom-right',
        pause: true
      })

      await listenerApi.delay(5000)
      toast.remove(toastId)
    }
  })
}
