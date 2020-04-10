import React from 'react'
import { useSelector } from 'react-redux'

const Post = ({ post }) => (
  <article className="post-excerpt">
    <h2>{post.title}</h2>
    <p>{post.content.substring(0, 100)}</p>
  </article>
)

export const PostsList = () => {
  const posts = useSelector((state) => state.posts)

  const renderedPosts = posts.map((post) => <Post key={post.id} post={post} />)

  return (
    <section>
      <h1>Posts</h1>
      {renderedPosts}
    </section>
  )
}
