import React from 'react';
import {useSelector} from 'react-redux';

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params;
  
  const post = useSelector(state =>
    state.posts.find(post => post.id === postId)
  );

  return (
    <section>
      {!post && (
        <h2>Post not found</h2>
      )}
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
      </article>
    </section>
  )
}
