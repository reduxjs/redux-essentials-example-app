import React from 'react'
import { Link, useParams } from 'react-router-dom'

import { TimeAgo } from '@/components/TimeAgo'
import { Spinner } from '@/components/Spinner'
import { useGetPostQuery } from '@/features/api/apiSlice'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

export const SinglePostPage = () => {
  const { postId } = useParams()

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId!)

  let content: React.ReactNode

  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
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
    )
  }

  return <section>{content}</section>
}
