import { useSelector } from 'react-redux';
import { parseISO, formatDistanceToNow } from 'date-fns';
import { selectAllNotifications } from './notificationsSlice.js';
import { selectAllUsers } from '../users/usersSlice.js';

export const NotificationsList = () => {
  const notifications = useSelector(selectAllNotifications);
  const users = useSelector(selectAllUsers);

  const renderNotifications = notifications.map((notification) => {
    const date = parseISO(notification.date);
    const timeAgo = formatDistanceToNow(date);
    const user = users.find((user) => user.id === notifications.user) || { name: 'Unknown User' };
    return (
      <div key={notification.id} className="notification">
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