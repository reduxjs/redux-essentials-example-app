import React from 'react'

export const Spinner = ({ text = '' }) => {
  return (
    <div className="spinner">
      <h4>{text}</h4>
      <div className="loader" />
    </div>
  )
}
