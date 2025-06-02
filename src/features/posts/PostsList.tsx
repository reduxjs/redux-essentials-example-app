import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Post } from './postsSlice'
import { PostAuthor } from './PostAuthor'

import { Spinner } from '@/components/Spinner'
import { TimeAgo } from '@/components/TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { useGetPostsQuery } from '../api/apiSlice'
import classNames from 'classnames'

// Go back to passing a `post` object as a prop
interface PostExcerptProps {
  post: Post
}

const PostExcerpt = ({ post }: PostExcerptProps) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}

export const PostsList = () => {
  const { data: posts = [], isLoading, isSuccess, isError, error, refetch, isFetching } = useGetPostsQuery()

  let content: React.ReactNode

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))

    return sortedPosts
  }, [posts])

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => <PostExcerpt key={post.id} post={post} />)

    const containerClassname = classNames('posts-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch posts</button>
      {content}
    </section>
  )
}
