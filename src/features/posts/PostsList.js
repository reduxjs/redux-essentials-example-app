import React from 'react'
import { useSelector } from 'react-redux'

const PostsList = () => {
    // coming from store > postsSlice => initialState
    const posts = useSelector(state => state.posts)
    
    const renderedPosts = posts.map((post) => {
        return (
            <article
                className="post-excerpt"
                key={post.id}
            >
                <h3>{post.title}</h3>
                <p
                    className="post-content"
                >
                    {post.content.substring(0, 100)}
                </p>
            </article>
        )
    })

    return (
        <section
            className="posts-list"
        >
            <h2>Posts</h2>
            {renderedPosts}
        </section>
    )
}

export default PostsList