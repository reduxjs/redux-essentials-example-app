import { useNavigate, useParams } from 'react-router-dom'
import { useEditPostMutation, useGetPostQuery } from '../api/apiSlice'

interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

export const EditPostForm = () => {
  const { postId } = useParams()
  const navigate = useNavigate()

  const { data: currentPost } = useGetPostQuery(postId!)

  const [updatePost, { isLoading }] = useEditPostMutation()

  if (!currentPost) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onSavePostClicked = async (e: React.FormEvent<EditPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    if (title && content) {
      await updatePost({ id: currentPost.id, title, content })

      navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post title:</label>
        <input type="text" id="postTitle" name="postTitle" defaultValue={currentPost.title} required />

        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" defaultValue={currentPost.content} required />

        <button disabled={isLoading}>Save post</button>
      </form>
    </section>
  )
}
