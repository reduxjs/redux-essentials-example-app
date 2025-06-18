import { Link, useParams } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'
import { Post } from '@/features/posts/postsSlice'

import { selectUserById } from './usersSlice'
import { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'
import { createSelector } from '@reduxjs/toolkit'
import { useGetPostsQuery } from '../api/apiSlice'

// Create a TS type that represents "the result value passed
// into the `selectFromResult` function for this hook"
type GetPostSelectFromResultArg = TypedUseQueryStateResult<Post[], any, any>

const selectPostsForUser = createSelector(
  (res: GetPostSelectFromResultArg) => res.data,
  (res: GetPostSelectFromResultArg, userId: string) => userId,
  (data, userId) => data?.filter(post => post.user === userId)
)

export const UserPage = () => {
  const { userId } = useParams()

  const user = useAppSelector((state) => selectUserById(state, userId!))

  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: result => ({
      // Optional: Include all of the existing result fields like `isFetching`
      ...result,
      // Include a field called `postsForUser` in the result object,
      // which will be a filtered list of posts
      postsForUser: selectPostsForUser(result, userId!)
    })
  })

  // const postsForUser = useAppSelector((state) => selectPostsByUser(state, userId!))

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
