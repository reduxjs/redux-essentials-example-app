import React from 'react'
import { useDispatch } from 'react-redux'
import { useState } from 'react-router-dom'
import { nanoid } from '@reduxjs/toolkit'
import postAdded from './postsSlice'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const onChangeTitle = setTitle((e) => e.target.value)
  const onChangeContent = setContent((e) => e.target.value)

  const dispatch = useDispatch()

  const onSaveClicked = () => {
    if (title && content) {
      dispatch(
        postAdded({
          id: nanoid,
          title,
          content,
        })
      )
    }
    setTitle('')
    setContent('')
  }

  return (
    <section>
      <h2>Add a new Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onChangeTitle}
        />
        <label htmlFor="postContent">Content</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onChangeContent}
        />

        <button type="button" onClick={onSaveClicked}>
          Save
        </button>
      </form>
    </section>
  )
}
