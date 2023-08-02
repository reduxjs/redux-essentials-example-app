import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAllUsers } from "./userSlice";

export const UsersList = () => {
  const users = useSelector(selectAllUsers);

  const renderUserList = users.map((item) => {
    return (
      <li key={item.id}>
        <Link to={`/users/${item.id}`}>{item.name}</Link>
      </li>
    );
  });
  return (
    <section>
      <h2>Users</h2>
      <ul>{renderUserList}</ul>
    </section>
  );
};
