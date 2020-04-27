import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'

import styles from './NotificationsList.module.css'

import {
  selectAllNotifications,
  allNotificationsRead,
} from './notificationsSlice'

export const NotificationsList = () => {
  const notifications = useSelector(selectAllNotifications)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    return (
      <div key={notification.id} className={styles.notification}>
        <div>
          <b>{notification.user}</b> {notification.message}
        </div>
        <div className={styles.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className={styles.notificationsList}>
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
