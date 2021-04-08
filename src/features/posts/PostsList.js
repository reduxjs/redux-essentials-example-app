import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; 
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';
import { selectAllPosts, fetchPosts } from './postsSlice'

export const PostsList = () => {
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch]);

  let content;

  const PostExcerpt = (props) => {
    const { key, post } = props;
    return (
      <article className="post-excerpt" key={key}>
        <h3>{post.title}</h3>
        <PostAuthor userId={post.user}/>
        <TimeAgo timestamp={post.date}/>
        <p className="post-content">{post.content.substring(0, 100)}</p>
        <ReactionButtons post={post}/>
        <Link to={`/posts/${post.id}`} className="button muted-button">
          View Post
        </Link>
      </article>
    )
  };

  if (postStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (postStatus === 'succeeded') {
    // sort posts in reverse chronological order
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post}/>
    ))
  } else {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}