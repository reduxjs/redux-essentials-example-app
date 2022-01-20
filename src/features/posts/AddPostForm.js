import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { postAdded } from './postsSlice'

const AddPostForm = () => {
    // component state
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    // handle the changes from inputs
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)

    const dispatch = useDispatch()

    const onSavePostClicked = () => {
        if ( title && content ) {
            dispatch(
                postAdded({
                    id: nanoid(),
                    title,
                    content
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
                <label
                    htmlFor="postTitle"
                >Post Title</label>
                <input 
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label
                    htmlFor="postContent"
                >Post Content</label>
                <input 
                    type="text"
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                >Save Post</button>
            </form>
        </section>
    )
}

export default AddPostForm