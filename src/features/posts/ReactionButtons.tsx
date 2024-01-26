import React from 'react'

import { useAppDispatch } from '@/app/hooks'

import type { Post, ReactionName } from './postsSlice'
import { reactionAdded } from './postsSlice'

const reactionEmoji: Record<ReactionName, string> = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export const ReactionButtons = ({ post }: { post: Post }) => {
  const dispatch = useAppDispatch()

  const reactionButtons = Object.entries(reactionEmoji).map(
    ([stringName, emoji]) => {
      const name = stringName as ReactionName
      return (
        <button
          key={name}
          type="button"
          className="muted-button reaction-button"
          onClick={() =>
            dispatch(reactionAdded({ postId: post.id, reaction: name }))
          }
        >
          {emoji} {post.reactions[name]}
        </button>
      )
    },
  )

  return <div>{reactionButtons}</div>
}
