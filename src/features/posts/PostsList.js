import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectUserById } from '../users/usersSlice'

import { fetchPosts } from './postsSlice'

const PostExcerpt = ({ post }) => {
  const author = useSelector((state) => selectUserById(state, post.user))

  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <span>
        <i>{author.name}</i>
      </span>
      <p>{post.content.substring(0, 100)}</p>
      <Link to={`/posts/${post.id}`} className="button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const posts = useSelector((state) => state.posts)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const renderedPosts = posts.map((post) => (
    <PostExcerpt key={post.id} post={post} />
  ))

  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
