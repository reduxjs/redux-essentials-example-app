import React from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdded } from './postsSlice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
};

export const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();

  const onReactionClick = (reaction) => {
    dispatch(reactionAdded({
      postId: post.id,
      reaction
    }))
  };

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => (
    <button 
      key={name} 
      type="button" 
      className="muted-button reaction-button"
      onClick={() => onReactionClick(name)}
    >
      {emoji} {post.reactions[name]}
    </button>
  ));

  return <div>{reactionButtons}</div>
}