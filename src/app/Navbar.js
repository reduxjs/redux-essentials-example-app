import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchNotifications } from "../features/notifications/notifications";

export const Navbar = () => {
  const dispatch = useDispatch();

  const newNotificationCount = useSelector((state) => {
    let count = 0;
    state.notifications.forEach((element) => {
      if (element.isNew) {
        count++;
      }
    });
    return count;
  });
  const fetchNewNotifications = () => {
    dispatch(fetchNotifications());
  };
  return (
    <nav>
      <section>
        <h1>
          <Link to="/">Redux Essentials Example</Link>
        </h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>{" "}
            <Link to="/notifications">
              Notifications {newNotificationCount}
            </Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  );
};
