import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { Navbar } from "./app/Navbar";
import { PostList } from "./components/PostList";
import { NotificationList } from "./features/notifications/NotificationsList";
import { AddPostForm } from "./features/posts/AddPostForm";
import { EditPostForm } from "./features/posts/EditPostForm";
import { SinglePost } from "./features/posts/SinglePost";
import { UserPage } from "./features/users/UserPage";
import { UsersList } from "./features/users/UsersList";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                <PostList />
                <AddPostForm />
              </React.Fragment>
            )}
          />

          <Route path="/editPost/:postId" component={EditPostForm} />
          <Route path="/posts/:postId" component={SinglePost} />
          <Route exact path="/users" component={UsersList} />
          <Route exact path="/users/:userId" component={UserPage} />
          <Route exact path="/notifications" component={NotificationList} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
