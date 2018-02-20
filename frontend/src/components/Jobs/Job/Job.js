import React, { Component } from 'react'
import './Job.css'

class Job extends Component {
  render() {
    return (
      <div className="Job">
        <h2>{this.props.name}</h2>
        <h3>File name: {this.props.program}</h3>
        <p>Submitted: {this.props.submissionTime}</p>
      </div>
    )
  }
}

export default Job
