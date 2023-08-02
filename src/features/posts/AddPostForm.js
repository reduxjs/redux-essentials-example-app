import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "./postSlice";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const dispatch = useDispatch();

  const onTitleChange = (e) => setTitle(e.target.value);
  const onContentChange = (e) => setContent(e.target.value);

  return (
    <div>
      <h2>Add new post</h2>
      <form>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={onTitleChange}
        />

        <input
          type="text"
          name="content"
          id="content"
          value={content}
          onChange={onContentChange}
        />

        <button
          type="button"
          onClick={() => {
            dispatch(addPost({ title, content }));
          }}
        >
          Save Post
        </button>
      </form>
    </div>
  );
};
