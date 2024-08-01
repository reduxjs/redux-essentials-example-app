import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '@/components/Spinner'

import { useGetPostQuery, useEditPostMutation } from '@/features/api/apiSlice'

// TS types for the input fields
// See: https://epicreact.dev/how-to-type-a-react-form-on-submit-handler/
interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}
interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

export const EditPostForm = () => {
  const { postId } = useParams()

  const { data: post } = useGetPostQuery(postId!)

  const [updatePost, { isLoading }] = useEditPostMutation()

  const navigate = useNavigate()

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onSavePostClicked = async (e: React.SubmitEvent<EditPostFormElements>) => {
    // Prevent server submission
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    if (title && content) {
      await updatePost({ id: post.id, title, content })
      navigate(`/posts/${postId}`)
    }
  }

  const spinner = isLoading ? <Spinner text="Saving..." /> : null

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" name="postTitle" defaultValue={post.title} required disabled={isLoading} />
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" defaultValue={post.content} required disabled={isLoading} />
        <button disabled={isLoading}>Save Post</button>
      </form>
      {spinner}
    </section>
  )
}
