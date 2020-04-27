import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { parseISO, formatDistanceToNow } from 'date-fns'

import { selectUserById } from '../users/usersSlice'
import { selectPostById } from '../posts/postsSlice'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  const post = useSelector((state) => selectPostById(state, postId))

  const author = useSelector((state) =>
    selectUserById(state, post ? post.user : null)
  )

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const date = parseISO(post.date)
  const timeAgo = formatDistanceToNow(date)

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <span>
          <i>{author.name}</i>
        </span>
        <span title={post.date}>
          &nbsp; <i>{timeAgo} ago</i>
        </span>
        <p>{post.content}</p>
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  )
}
