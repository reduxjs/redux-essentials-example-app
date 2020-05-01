import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { selectUserEntities } from '../users/usersSlice'

import styles from './NotificationsList.module.css'

import {
  selectAllNotifications,
  allNotificationsRead,
} from './notificationsSlice'

export const NotificationsList = () => {
  const notifications = useSelector(selectAllNotifications)
  const usersById = useSelector(selectUserEntities)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(allNotificationsRead())
  })

  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = usersById[notification.user] || {}

    const notificationClassname = classnames(styles.notification, {
      [styles.new]: notification.isNew,
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div className={styles.date} title={notification.date}>
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
