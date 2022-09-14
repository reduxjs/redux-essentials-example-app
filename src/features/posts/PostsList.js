import React from 'react'
import { useSelector } from 'react-redux'

// the following component will loop over the array of posts and display them on our screens.
export const PostsList = () => {
    // the useSelector hook takes state as part of it's argument and returns part of state. 
  const posts = useSelector(state => state.posts)

  const renderedPosts = posts.map(post => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
    </article>
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}