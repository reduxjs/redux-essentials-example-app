import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

import { selectAllUsers } from './usersSlice.js';

export const UsersList = () => {
  const users = useSelector(selectAllUsers);

  const renderUsers = users.map((user) => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ));

  return (
    <section>
      <h2>Users</h2>

      <ul>{renderUsers}</ul>
    </section>
  )
}