import React, { useState } from 'react'

export const AddPostForm = () => {
  // create local state for title and content of posts
  const [title, setTitle] = useState('')
  const [content, sentContent] = useState('')

  // update the title and content on change locally
  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => sentContent(e.target.value)

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button">Save Post</button>
      </form>
    </section>
  )
}
