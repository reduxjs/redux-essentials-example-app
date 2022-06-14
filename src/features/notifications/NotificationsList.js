import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { selectAllUsers } from '../users/usersSlice'
import {
  useGetNotificationsQuery,
  selectMetadataEntities,
  allNotificationsRead,
} from './notificationsSlice'
import classnames from 'classnames'
export const NotificationsList = () => {
  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetaData = useSelector(selectMetadataEntities)
  const users = useSelector(selectAllUsers)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(allNotificationsRead())
  })
  const renderedNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find((user) => user.id === notification.user) || {
      name: 'Unknown User',
    }
    const metadata = notificationsMetaData[notification.id]
    const notificationClassname = classnames('notification', {
      new: metadata.isNew,
    })
    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b>
          {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
