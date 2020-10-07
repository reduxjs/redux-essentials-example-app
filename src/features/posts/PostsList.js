import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export const PostList = () => {
  const posts = useSelector(state => state.posts);

  return (
    <section>
      <h2>Posts</h2>
      {posts.map(post => (
        <article className="posts-excerpt" key={post.id}>
          <h3>{post.title}</h3>

          <p className="post-content">
            {post.content.substring(0, 100)}
          </p>

          <Link
            to={`/posts/${post.id}`}
            className="button muted-button"
          >
            View Post
          </Link>
        </article>
      ))}
    </section>
  )
}
