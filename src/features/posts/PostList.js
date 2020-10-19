import React from 'react'
import { useSelector } from 'react-redux'

export const PostList = () => {
  const posts = useSelector((state) => state.posts)

  const renderedPosts = posts.map((post) => (
    <article
      className="post-excerpt"
      key={post.id}
      style={{ marginBottom: 16 }}
    >
      <h3>{post.title}</h3>
      <p>{post.content.substring(0, 100)}</p>
    </article>
  ))
  return (
    <section style={{ marginBottom: 80 }}>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
