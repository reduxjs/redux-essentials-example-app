import React from 'react'
import { Link, useParams } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'
import { TimeAgo } from '@/components/TimeAgo'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

export const SinglePostPage = () => {
  const { postId } = useParams()

  const post = useAppSelector((state) =>
    state.posts.find((post) => post.id === postId),
  )

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  )
}
