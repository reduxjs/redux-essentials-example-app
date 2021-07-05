import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { Navbar } from "./app/Navbar";

import { PostsList } from "./features/posts/PostsList";
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
              <section>
                <>
                  <PostsList />
                </>
              </section>
            )}
          />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
