import { useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { parseISO, formatDistanceToNow } from 'date-fns';
import classnames from 'classnames';
import { selectAllNotifications, allNotificationsRead  } from './notificationsSlice.js';
import { selectAllUsers } from '../users/usersSlice.js';

export const NotificationsList = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);
  const users = useSelector(selectAllUsers);

  useLayoutEffect(() => {
    dispatch(allNotificationsRead());    
  })

  const renderNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date);
    const timeAgo = formatDistanceToNow(date);
    const user = users.find((user) => user.id === notifications.user) || { name: 'Unknown User' };
    const notificationClassname = classnames('notification', {
      new: notification.isNew,
    })
    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationList">
      <h2>Notification</h2>
      {renderNotifications}
    </section>
  )
}