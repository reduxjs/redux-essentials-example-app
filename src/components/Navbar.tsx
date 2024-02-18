import React from 'react'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { UserIcon } from './UserIcon'
import { userLoggedOut } from '@/features/auth/authSlice'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const username = useAppSelector((state) => state.auth.username)
  const user = useAppSelector((state) => state.users.find((user) => user.id === username))

  const isLoggedIn = !!username && !!user

  let navContent: React.ReactNode = null

  if (isLoggedIn) {
    const onLogoutClicked = () => {
      dispatch(userLoggedOut())
    }

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Posts</Link>
        </div>
        <div className="userDetails">
          <UserIcon size={32} />
          {user.name}
          <button className="button small" onClick={onLogoutClicked}>
            Log Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        {navContent}
      </section>
    </nav>
  )
}
