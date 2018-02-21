import React from 'react'
import './PauseModal.css'

const pauseModal = (props) => {
  const classList = ['PauseModal']

  if (props.showModal) {
    classList.push('show')
  }

  const className = classList.join(' ')

  return (
    <div className={className}>
      <div className="container">
        <h4>Are you sure you want to lock the queue?</h4>
        <button onClick={props.accepted}>Yes</button>
        <button onClick={props.rejected}>No</button>
      </div>
    </div>
  )
}

export default pauseModal
