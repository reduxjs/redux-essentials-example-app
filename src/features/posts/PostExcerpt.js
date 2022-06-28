import React from 'react'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
// export const PostExcerpt = function ({ postId }) {
//   const post = useSelector((state) => selectPostById(state, postId))
//   return (
//     <article className="post-excerpt">
//       <h3>{post.title}</h3>
//       <p className="post-content">{post.content.substring(0, 100)}</p>
//       <PostAuthor userId={post.user}></PostAuthor>
//       <TimeAgo timeStamp={post.date}></TimeAgo>
//       <ReactionButtons post={post}></ReactionButtons>
//       <Link to={`/posts/${post.id}`} className="button muted-button">
//         View Post
//       </Link>
//     </article>
//   )
// }
export const PostExcerpt = function ({ post }) {
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <PostAuthor userId={post.user}></PostAuthor>
      <TimeAgo timeStamp={post.date}></TimeAgo>
      <ReactionButtons post={post}></ReactionButtons>
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}
