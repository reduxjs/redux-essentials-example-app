import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAllPosts,
  fetchPosts,
  selectPostIds,
  selectPostById,
} from './postsSlice';

import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor.js';
import { TimeAgo } from './TimeAgo.js';
import { ReactionButtons } from './ReactionButtons.js';
import { Spinner } from '../../components/Spinner.js';

const PostExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}



export const PostsList = () => {
  const dispatch = useDispatch();
  // Компоненты React читают данные из хранилища с помощью useSelector хука
  // const posts = useSelector(state => state.posts); // state.posts необходимый для работы срез данных
  // const posts = useSelector(selectAllPosts); // useSelector -> store.getState() -> корневой state -> selectorAllPosts(state) -> profit
  const orderedPostIds = useSelector(selectPostIds)

  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if(postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    content = orderedPostIds.map((postId) => (<PostExcerpt key={postId} postId={postId} />))
  } else if (postStatus === 'error') {
    content = <div>{error}</div>
  }

  return (
    <section className="post-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}