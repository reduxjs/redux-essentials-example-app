import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { editPost, selectPostById } from "./postSlice";

export const EditPostForm = ({ match }) => {
  const { params } = useParams();
  const { postId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const post = useSelector((state) => selectPostById(state, postId));

  const [title, setTitle] = useState(() => {
    if (post) {
      return post.title;
    }
    return "";
  });
  const [content, setContent] = useState(() => {
    if (post) {
      return post.content;
    }
    return post;
  });

  return (
    <div>
      <form>
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label>Content</label>
          <input value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <button
          type="button"
          onClick={() => {
            dispatch(editPost({ postId, title, content }));
            history.push(`/posts/${postId}`);
          }}
        >
          Save Post
        </button>
      </form>
    </div>
  );
};
