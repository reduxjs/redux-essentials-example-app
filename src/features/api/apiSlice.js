import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: (res) => res.posts,
      providesTags: ['Posts'],
    }),
    editPost: builder.mutation({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        // Our fake API expects Post objects to be a field called `post` in the body
        body: { post },
      }),
      invalidatesTags: ['Posts'],
    }),
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (res) => res.users,
    }),
  }),
})

export const {
  useGetPostsQuery,
  useEditPostMutation,
  useGetUsersQuery,
} = apiSlice
