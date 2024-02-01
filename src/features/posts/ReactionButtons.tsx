import React from 'react'

import { useAddReactionMutation, Post, ReactionName } from '@/features/api/apiSlice'

const reactionEmoji: Record<ReactionName, string> = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export const ReactionButtons = ({ post }: { post: Post }) => {
  const [addReaction] = useAddReactionMutation()

  const reactionButtons = Object.entries(reactionEmoji).map(([stringName, emoji]) => {
    const reactionName = stringName as ReactionName
    return (
      <button
        key={reactionName}
        type="button"
        className="muted-button reaction-button"
        onClick={() => {
          addReaction({ postId: post.id, reaction: reactionName })
        }}
      >
        {emoji} {post.reactions[reactionName]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
