import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { parseISO, formatDistanceToNow } from 'date-fns'
import { selectUserById } from '../users/usersSlice'

import { fetchPosts, reactionAdded, selectAllPosts } from './postsSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

const PostExcerpt = ({ post }) => {
  const author = useSelector((state) => selectUserById(state, post.user))
  const dispatch = useDispatch()

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      >
        {emoji} {post.reactions[name]}
      </button>
    )
  })
  const date = parseISO(post.date)
  const timeAgo = formatDistanceToNow(date)

  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <span>{author.name}</span>
      <span title={post.date}>
        &nbsp; <i>{timeAgo} ago</i>
      </span>
      <p>{post.content.substring(0, 100)}</p>
      <div>{reactionButtons}</div>
      <Link to={`/posts/${post.id}`} className="button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const posts = useSelector(selectAllPosts)
  const status = useSelector((state) => state.posts.status)
  const error = useSelector((state) => state.posts.error)
  const dispatch = useDispatch()

  // Sort posts in reverse chronological order
  const orderedPosts = posts.slice().reverse()

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts())
    }
  }, [status, dispatch])

  let content

  if (status === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (status === 'succeeded') {
    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (status === 'error') {
    content = <div>{error}</div>
  }

  return (
    <section>
      <h2>Posts</h2>

      {content}
    </section>
  )
}
