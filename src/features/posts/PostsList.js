import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const PostsList = () => {
  const posts = useSelector((state) => state.posts)

  const renderedPosts = posts.map((post) => (
    <article className={'post-excerpt'}>
      <h2>{post.title}</h2>
      <p>{post.content.substring(0, 100)}</p>
    </article>
  ))

  return (
    <section>
      <h1>Posts</h1>
      {renderedPosts}
    </section>
  )
}
