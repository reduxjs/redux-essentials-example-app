import React from 'react'
import { useSelector } from 'react-redux'

export const PostLists = () => {
  const posts = useSelector((state) => state.posts)

  const renderedPosts = () => {
    return posts.map((post) => (
      <article>
        <h3>{post.title}</h3>
        <p>{post.content.substring(0, 100)}</p>
      </article>
    ))
  }

  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
