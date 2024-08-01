import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@/app/hooks'

import { Spinner } from '@/components/Spinner'
import { TimeAgo } from '@/components/TimeAgo'

import { PostAuthor } from './PostAuthor'

import { fetchPosts, selectPostById, selectPostIds, selectPostsStatus, selectPostsError } from './postsSlice'
import { ReactionButtons } from './ReactionButtons'

interface PostExcerptProps {
  postId: string
}

function PostExcerpt({ postId }: PostExcerptProps) {
  const post = useAppSelector((state) => selectPostById(state, postId))
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}

export const PostsList = () => {
  const dispatch = useAppDispatch()
  const orderedPostIds = useAppSelector(selectPostIds)
  const postStatus = useAppSelector(selectPostsStatus)
  const postsError = useAppSelector(selectPostsError)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content: React.ReactNode

  if (postStatus === 'pending') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    content = orderedPostIds.map((postId) => <PostExcerpt key={postId} postId={postId} />)
  } else if (postStatus === 'rejected') {
    content = <div>{postsError}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
