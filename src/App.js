import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Redirect,
} from 'react-router-dom'

import { Navbar } from './app/Navbar'
import { PostsList } from './features/posts/PostsList.js';
import { AddPostForm } from './features/posts/AddPostForm.js';
import { SinglePostPage } from './features/posts/SinglePostPage.js';
import { EditPostForm } from './features/posts/EditPostForm.js';

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
              <>
                <AddPostForm />
                <PostsList />
              </>
            )}
          />
          <Route exact path='/posts/:postId' component={SinglePostPage}/>
          <Route exact path="/editPost/:postId" component={EditPostForm} />
          {/* <Redirect to="/" /> */}
        </Switch>
      </div>
    </Router>
  )
}

export default App
