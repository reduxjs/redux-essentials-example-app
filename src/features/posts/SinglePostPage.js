import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { Spinner } from '../../components/Spinner'
import { useGetPostQuery } from '../api/apiSlice'
import { selectPostById } from './postsSlice'
export const SinglePostPage = ({ match }) => {
  const { postId } = match.params
  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)
  //const post = useSelector((state) => selectPostById(state, postId))

  let content
  console.log(`isFetching: ${isFetching}`)
  if (isFetching) {
    content = <Spinner text="Loading..."></Spinner>
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <PostAuthor userId={post.user}></PostAuthor>
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    )
  }
  return <section>{content}</section>
}
