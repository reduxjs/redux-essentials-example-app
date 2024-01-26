import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { postUpdated } from './postsSlice'

export const EditPostForm = () => {
  const { postId } = useParams()

  const post = useAppSelector(
    (state) => state.posts.find((post) => post.id === postId)!,
  )

  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postUpdated({ id: post.id, title, content }))
      navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
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
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  )
}
