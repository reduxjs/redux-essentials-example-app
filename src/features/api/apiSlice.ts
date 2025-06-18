import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Use the `Post` type we've already defined in `postsSlice`,
// and then re-export it for ease of use
import type { EditPostType, NewPost, Post, ReactionName } from '@/features/posts/postsSlice'
import type { User } from '@/features/users/usersSlice'
export type { Post }

export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  tagTypes: ['Post'],
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data.
    // The return value is a `Post[]` array, and it takes no arguments.
    getPosts: builder.query<Post[], void>({
      // /fakeApi/posts'
      query: () => '/posts',
      providesTags: (result = [], error, arg) => ['Post', ...result.map(({ id }) => ({ type: 'Post', id }) as const)],
    }),
    getPost: builder.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }],
    }),
    addNewPost: builder.mutation<Post, NewPost>({
      query: (initialPost) => ({
        // The HTTP URL will be '/fakeApi/posts'
        url: '/posts',
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: ['Post'],
    }),
    editPost: builder.mutation<Post, EditPostType>({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    addReaction: builder.mutation<Post, { postId: string; reaction: ReactionName }>({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      // invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.postId }],
      // since we're now doing optimistic updates
      async onQueryStarted({ postId, reaction }, lifecycleApi) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const getPostsPatchResult = lifecycleApi.dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.find((post) => post.id === postId)
            if (post) {
              post.reactions[reaction]++
            }
          }),
        )

        // We also have another copy of the same data in the `getPost` cache
        // entry for this post ID, so we need to update that as well
        const getPostPatchResult = lifecycleApi.dispatch(
          apiSlice.util.updateQueryData('getPost', postId, (draft) => {
            draft.reactions[reaction]++
          }),
        )

        try {
          await lifecycleApi.queryFulfilled
        } catch {
          getPostsPatchResult.undo()
          getPostPatchResult.undo()
        }
      },
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation, useEditPostMutation, useAddReactionMutation } =
  apiSlice
