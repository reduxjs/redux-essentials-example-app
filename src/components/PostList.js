import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts, selectPosts } from "../features/posts/postSlice";
import { Spinner } from "./Spinner";

export const PostList = () => {
  const posts = useSelector(selectPosts);
  const dispatch = useDispatch();
  const postsStatus = useSelector((state) => state.posts.status);
  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postsStatus, dispatch]);

  const renderedPost = (
    <div>
      {posts.map((post) => (
        <div className="post-excerpt" key={post.id}>
          <h3>{post.title}</h3>
          <p className="post-content">{post.content.substring(0, 100)}</p>
          <Link to={`/posts/${post.id}`} className="button muted-button">
            View Post
          </Link>
          <Link to={`/editPost/${post.id}`} className="button muted-button">
            Edit Post
          </Link>
        </div>
      ))}
    </div>
  );

  if (Array.isArray(posts) && posts.length === 0) {
    return <div> No Post Found </div>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {renderedPost}
    </section>
  );
};
