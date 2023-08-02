import { useDispatch, useSelector } from "react-redux";
import { selectAllUsers } from "../users/userSlice";
import { selectAllNotifications, allNotifications } from "./notifications";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useLayoutEffect } from "react";
import classname from "classnames";

export const NotificationList = () => {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(allNotifications());
  });
  const notificationList = useSelector(selectAllNotifications);

  const users = useSelector(selectAllUsers);

  const renderNotifications = notificationList.map((notiItem) => {
    const date = parseISO(notiItem.date);
    const timeAgo = formatDistanceToNow(date);
    const user = users.find((user) => user.id === notiItem.user) || {
      name: "Unknown User"
    };

    const newNotificationClassName = classname("notitfication", {
      new: notiItem.isNew
    });

    return (
      <div key={notiItem.id} className={newNotificationClassName}>
        <div>
          <b>{user.name}</b> {notiItem.message}
        </div>
        <div title={notiItem.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    );
  });

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderNotifications}
    </section>
  );
};
