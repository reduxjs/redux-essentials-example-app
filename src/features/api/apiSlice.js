import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: (res) => res.posts,
    }),
    editPost: builder.mutation({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        // Our fake API expects Post objects to be a field called `post` in the body
        body: { post },
      }),
    }),
  }),
})

export const { useGetPostsQuery, useEditPostMutation } = apiSlice
