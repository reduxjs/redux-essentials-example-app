import { useAppSelector } from '@/app/hooks'

import { TimeAgo } from '@/components/TimeAgo'

import { PostAuthor } from '@/features/posts/PostAuthor'

import { selectAllNotifications } from './notificationsSlice'

export const NotificationsList = () => {
  const notifications = useAppSelector(selectAllNotifications)

  const renderedNotifications = notifications.map((notification) => {
    return (
      <div key={notification.id} className="notification">
        <div>
          <b>
            <PostAuthor userId={notification.user} showPrefix={false} />
          </b>{' '}
          {notification.message}
        </div>
        <TimeAgo timestamp={notification.date} />
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
