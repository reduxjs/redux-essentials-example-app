import React from 'react'
import { Link } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'
import { TimeAgo } from '@/components/TimeAgo'

import { PostAuthor } from './PostAuthor'

export const PostsList = () => {
  const posts = useAppSelector((state) => state.posts)

  // Sort posts in reverse chronological order by datetime string
  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))

  const renderedPosts = orderedPosts.map((post) => {
    return (
      <article className="post-excerpt" key={post.id}>
        <h3>{post.title}</h3>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content.substring(0, 100)}</p>
        <Link to={`/posts/${post.id}`} className="button muted-button">
          View Post
        </Link>
      </article>
    )
  })

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
