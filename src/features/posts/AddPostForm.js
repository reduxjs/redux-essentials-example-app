import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postAdded } from './postsSlice';
import { unwrapResult } from '@reduxjs/toolkit'

import { addNewPost } from './postsSlice';

export const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const dispatch = useDispatch();
  const users = useSelector(state => state.users);

  const onTitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);
  const onAuthorChanged = e => setUserId(e.target.value);

  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        const resultAction = await dispatch(
          addNewPost({ title, content, user: userId })
        );
        unwrapResult(resultAction);
        setTitle('');
        setContent('');
        setUserId('');
      } catch (err) {
        console.error('Failed to save the post', err);
      } finally {
        setAddRequestStatus('idle');
      }
    }
  };

  const userList = users.map(user => (
    <option key={user.id} value={user.id}>{user.name}</option>
  ));

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
        <label htmlFor="postContent">Post Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <label htmlFor="postAuthor">Post Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {userList}
        </select>
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}