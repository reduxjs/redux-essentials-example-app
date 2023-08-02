import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPosts } from "../posts/postSlice";
import { selectUserById } from "./userSlice";

export const UserPage = ({ match }) => {
  const { userId } = match.params;
  const user = useSelector((state) => selectUserById(state, userId));

  const postsByUser = useSelector((state) => {
    const posts = selectPosts(state);
    return posts.filter((post) => post.user === userId);
  });

  const postTitles = postsByUser.map((postByUserItem) => (
    <div>
      <Link to={`/posts/${postByUserItem.id}`}>{postByUserItem.title}</Link>
    </div>
  ));

  return (
    <div>
      {user.name}
      {postTitles}
    </div>
  );
};
