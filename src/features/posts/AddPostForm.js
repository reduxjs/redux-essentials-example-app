import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPost } from './postsSlice.js';
import { selectAllUsers } from '../users/usersSlice.js';

export const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [requestStatus, setRequestStatus] = useState('idle'); // idle === бездействует

  const dispatch = useDispatch();

  // const users = useSelector(state => state.users);
  const users = useSelector(selectAllUsers);
  
  const onTitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);
  const onAuthorChanged = e => setUserId(e.target.value);

  const canSave = [title, content, userId].every(Boolean) && requestStatus === 'idle';
  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setRequestStatus('pending');
        
       
        // unwrap INFO: https://redux.js.org/tutorials/essentials/part-5-async-logic#checking-thunk-results-in-components
        await dispatch(addNewPost({ title, content, user:userId })).unwrap();
        // Redux-toolkit добавляет метод .unwrap() к возвращаемому Promise. Исп. этого метода возвр. еще один промис 
        // содержащий результат action.payload в случае fulfilled или помогает всплытию ошибки в случае rejected.
        // Это позволяет нам обрабатывать успехи и неудачи в компоненте, используя обычную try/catch логику.
        // Грубо говоря .unwrap() в зависимости что вернул промис в поле action.type дописывает .then с доп логикой
        
        // Пример того, что будет заменять использование функции unwrap (пример условный):
        // Если промис вернул экшн в котором action.type === "posts/addNewPost/fulfilled", тогда
        // dispatch(...) + .then((action) => action.payload), если исп. с await то можно сразу получить наружу содержимое

        // Если промис вернул экшн в котором action.type === "posts/addNewPost/rejected", тогда
        // dispatch(...) + .then(action => {throw action.error.message}) - ошибка всплывает и уже обрабатывается try/catch (await никак не влияет на всплытие)
        // в моем случае await нужен для того, чтобы очистка полей произошла после того, как выполнился thunk, не важно с каким результатом.

        setTitle('');
        setContent('');
        setUserId('');
      } catch (err) {
        
        // Если результат dispatch(addNewPost) - rejected, unwrap позволит не проглатить ошибку внутри промиса, 
        // а поднять её наружу и обрабатываем тут! Это очень важно!
        console.error('Failed to save the post: ', err)
        // Если вы хотите посмотреть, что произойдет, если addNewPostвызов API завершится ошибкой, попробуйте создать новый пост, 
        // в котором в поле «Содержание» будет только слово «error» (без кавычек). Сервер увидит это и отправит ответ с ошибкой, 
        // поэтому вы должны увидеть сообщение, зарегистрированное на консоли. 
        // Это поможет понять как работает .unwrap() в случае ошибки. 
        // Т.е. попробовать await dispatch(addNewPost({ title, content, user:userId }))".unwrap()" и без неё

      } finally {
        setRequestStatus('idle');
      }
    }
  }

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

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
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
      </form>
    </section>
  )
}
