import { nanoid } from '@reduxjs/toolkit'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addPost } from './postsSlice'

export default function AssPostsForm(params) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const dispatch = useDispatch()

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)

  const submitPost = (e) => {
    e.preventDefault()
    if (title === '' || content === '') return
    const postDetails = {
      id: nanoid(),
      title,
      content,
    }
    dispatch(addPost(postDetails))
    setTitle('')
    setContent('')
  }
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
        <button onClick={submitPost} type="button">
          Save Post
        </button>
      </form>
    </section>
  )
}
