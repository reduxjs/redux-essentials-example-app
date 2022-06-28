import React, { useMemo } from 'react'
import { useGetPostsQuery } from '../api/apiSlice'
import { PostExcerpt } from './PostExcerpt'
import classnames from 'classnames'
export const PostsList = () => {
  // const dispatch = useDispatch()
  // const postStatus = useSelector((state) => state.posts.status)
  // const orderedPostIds = useSelector(selectPostIds)
  // useEffect(() => {
  //   if (postStatus === 'idle') dispatch(fetchPosts())
  // }, [postStatus, dispatch])
  // let content = null
  // if (postStatus === 'loading') {
  //   content = <div className="loader">Loading...</div>
  // } else if (postStatus === 'succeeded') {
  //   console.log(orderedPostIds)
  //   content = orderedPostIds.map((postId) => {
  //     return <PostExcerpt postId={postId} key={postId} />
  //   })
  // }
  const {
    data: posts = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetPostsQuery()
  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])
  let content
  if (isLoading) {
    content = <div className="loader">Loading...</div>
  } else if (isSuccess) {
    const renderedPosts = sortedPosts.map((post) => {
      return <PostExcerpt post={post} key={post.id} />
    })
    const containerClassname = classnames('posts-container', {
      disabled: isFetching,
    })
    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>refetch</button>
      {content}
    </section>
  )
}
