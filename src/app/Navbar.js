import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import styles from './Navbar.module.css'

import { selectAllPosts, reloadAllPosts } from '../features/posts/postsSlice'
import {
  fetchNotifications,
  selectAllNotifications,
} from '../features/notifications/notificationsSlice'

export const Navbar = () => {
  const totalPosts = useSelector((state) => selectAllPosts(state).length)
  const notifications = useSelector(selectAllNotifications)
  const numUnreadNotifications = notifications.filter((n) => !n.read).length
  const dispatch = useDispatch()

  const fetchNewNotifications = () => {
    dispatch(fetchNotifications())
  }

  const refreshPosts = () => {
    dispatch(reloadAllPosts())
  }

  let unreadNotificationsBadge

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Quick Start Example</h1>

        <div className={styles.navContent}>
          <div className={styles.navLinks}>
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">
              Notifications
              {unreadNotificationsBadge}
            </Link>
          </div>
          <button className="button" onClick={refreshPosts}>
            Refresh Posts
          </button>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
