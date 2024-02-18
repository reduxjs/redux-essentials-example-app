import React, { useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { userLoggedIn } from './authSlice'

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users)

  const [userId, setUserId] = useState('')

  const onUserChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value)
  }

  const onLogInClicked = () => {
    if (userId) {
      dispatch(userLoggedIn(userId))
    }
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Log In</h2>
      <form>
        <label htmlFor="postAuthor">User:</label>
        <select id="postAuthor" value={userId} onChange={onUserChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <button type="button" onClick={onLogInClicked} disabled={!userId}>
          Log In
        </button>
      </form>
    </section>
  )
}
