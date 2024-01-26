import React from 'react'
import { useParams } from 'react-router-dom'

import { useAppSelector } from '@/app/hooks'

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
        <p className="post-content">{post.content}</p>
      </article>
    </section>
  )
}
