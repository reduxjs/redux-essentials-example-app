import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createSelector } from '@reduxjs/toolkit'
import type { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'

import { useAppSelector } from '@/app/hooks'

import { selectUserById } from './usersSlice'
import { useGetPostsQuery, Post } from '../api/apiSlice'

type GetPostSelectFromResultArg = TypedUseQueryStateResult<Post[], any, any>

export const UserPage = () => {
  const { userId } = useParams()

  const user = useAppSelector((state) => selectUserById(state, userId!))

  const selectPostsForUser = useMemo(() => {
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (res: GetPostSelectFromResultArg) => res.data,
      (res: GetPostSelectFromResultArg, userId: string) => userId,
      (data, userId) => data?.filter((post) => post.user === userId),
    )
  }, [])

  // Use the same posts query, but extract only part of its data
  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: (res) => ({
      ...res,
      // Include a field called `postsForUser` in the hook result object,
      // which will be filtered list of posts
      postsForUser: selectPostsForUser(res, userId!),
    }),
  })

  const postTitles = postsForUser?.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  if (!user) {
    return (
      <section>
        <h2>User not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
