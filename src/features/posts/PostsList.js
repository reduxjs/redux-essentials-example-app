import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { client } from '../../api/client'

import { postsLoaded } from './postsSlice'

const Post = ({ post }) => (
  <article className="post-excerpt">
    <h2>{post.title}</h2>
    <p>{post.content.substring(0, 100)}</p>
  </article>
)

export const PostsList = () => {
  const posts = useSelector((state) => state.posts)
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchPosts() {
      const response = await client.get('/fakeApi/posts')
      dispatch(postsLoaded(response.posts))
    }
    if (posts.length === 0) {
      fetchPosts()
    }
  }, [posts, dispatch])

  const renderedPosts = posts.map((post) => <Post key={post.id} post={post} />)

  return (
    <section>
      <h1>Posts</h1>
      {renderedPosts}
    </section>
  )
}
