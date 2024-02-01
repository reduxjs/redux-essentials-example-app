import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useGetPostsQuery, Post } from '@/features/api/apiSlice'
import { TimeAgo } from '@/components/TimeAgo'
import { Spinner } from '@/components/Spinner'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'

const PostExcerpt = ({ post }: { post: Post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  const { data: posts = [], isLoading, isFetching, isSuccess, isError, error, refetch } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content: React.ReactNode

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = sortedPosts.map((post) => <PostExcerpt key={post.id} post={post} />)
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {content}
    </section>
  )
}
