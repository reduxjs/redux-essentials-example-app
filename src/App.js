import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from 'react-router-dom'

import { client } from './api/client'

import { PostsList } from './features/posts/PostsList'
import { AddPostForm } from './features/posts/AddPostForm'
import { SinglePostPage } from './features/posts/SinglePostPage'

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <section>
            <h1>Redux Quick Start Example</h1>

            <Link to="/">Posts</Link>
            <Link to="/addPost">Add New Post</Link>
          </section>
        </nav>
        <Switch>
          <Route exact path="/" component={PostsList} />
          <Route exact path="/addPost" component={AddPostForm} />
          <Route exact path="/posts/:id" component={SinglePostPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
