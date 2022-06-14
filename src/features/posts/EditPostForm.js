import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { postUpdated, selectPostById } from './postsSlice'
import { useGetPostQuery, useEditPostMutation } from '../api/apiSlice'
export const EditPostForm = ({ match }) => {
  const { postId } = match.params
  const history = useHistory()
  //const post = useSelector((state) => selectPostById(state, postId))
  const { data: post } = useGetPostQuery(postId)
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  //const dispatch = useDispatch()
  const [updatePost, { isLoading }] = useEditPostMutation()
  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onSavePostCilcked = async () => {
    if (title && content) {
      // dispatch(
      //   postUpdated({
      //     id: postId,
      //     title,
      //     content,
      //   })
      // )
      await updatePost({ id: postId, title, content })
      history.push(`/posts/${postId}`)
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
        ></input>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        ></textarea>
        <button type="button" onClick={onSavePostCilcked}>
          Save Post
        </button>
      </form>
    </section>
  )
}
