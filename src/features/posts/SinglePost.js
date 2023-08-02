import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPostById } from "./postSlice";

export const SinglePost = ({ match }) => {
  const { postId } = match.params;

  const post = useSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <div>
        <h2>No Post found</h2>
      </div>
    );
  }

  return (
    <section>
      <h2>{post.title}</h2>
      <p className="post-content">{post.content}</p>
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </section>
  );
};
