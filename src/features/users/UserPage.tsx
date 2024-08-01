import { Link, useParams } from 'react-router-dom'
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'

import { useAppSelector } from '@/app/hooks'

import { useGetPostsQuery, Post } from '@/features/api/apiSlice'

import { selectUserById } from './usersSlice'

// Create a TS type that represents "the result value passed
// into the `selectFromResult` function for this hook"
type GetPostsSelectFromResultArg = TypedUseQueryStateResult<Post[], any, any>

const selectPostsForUser = createSelector(
  (res: GetPostsSelectFromResultArg) => res.data,
  (res: GetPostsSelectFromResultArg, userId: string) => userId,
  (data, userId) => data?.filter((post) => post.user === userId),
)

export const UserPage = () => {
  const { userId } = useParams()

  const user = useAppSelector((state) => selectUserById(state, userId!))

  // Use the same posts query, but extract only part of its data
  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: (result) => ({
      // Optional: Include all of the existing result fields like `isFetching`
      ...result,
      // Include a field called `postsForUser` in the result object,
      // which will be a filtered list of posts
      postsForUser: selectPostsForUser(result, userId!),
    }),
  })

  if (!user) {
    return (
      <section>
        <h2>User not found!</h2>
      </section>
    )
  }

  const postTitles = postsForUser?.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
