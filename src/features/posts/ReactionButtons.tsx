import React from 'react'

import type { Post, ReactionName } from './postsSlice'

const reactionEmoji: Record<ReactionName, string> = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export const ReactionButtons = ({ post }: { post: Post }) => {
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button key={name} type="button" className="muted-button reaction-button">
        {emoji} {post.reactions[name as ReactionName]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
