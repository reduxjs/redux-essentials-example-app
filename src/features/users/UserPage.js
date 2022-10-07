import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from './usersSlice'
import { selectAllPosts, selectPostsByUser } from '../posts/postsSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector((state) => selectUserById(state, userId))

  // with this Memoized selecotr function we can avoid unnecessary re-render
  const postsForUser = useSelector((state) => selectPostsByUser(state, userId))

  // In this case useSelector will always returns new Array reference and
  // so that component will re-render after every action even if the posts data hasn't changed
  // const postsForUser = useSelector((state) => {
  //   const allPosts = selectAllPosts(state)

  //   return allPosts.filter((post) => post.user === userId)
  // })

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}> {post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  )
}
