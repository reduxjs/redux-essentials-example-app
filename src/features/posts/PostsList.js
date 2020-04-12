import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { fetchPosts } from './postsSlice'

const PostExcerpt = ({ post }) => (
  <article className="post-excerpt">
    <h2>{post.title}</h2>
    <p>{post.content.substring(0, 100)}</p>
    <Link to={`/posts/${post.id}`} className="button">
      View Post
    </Link>
  </article>
)

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
      <h1>Posts</h1>
      {renderedPosts}
    </section>
  )
}
