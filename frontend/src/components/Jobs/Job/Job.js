import React, { Component } from 'react'
import moment from 'moment'
import { jobStatus } from '../../../config'
import './Job.css'

class Job extends Component {
  blinkInterval = null
  waitInterval = null
  state = {
    blinking: false,
    waitTime: 0
  }

  componentDidMount() {
    this.waitInterval = setInterval( () => {
      this.setState({
        waitTime: this.state.waitTime + 1
      })
    },1000)

    if (this.props.status === jobStatus.IN_PROGRESS) {
      this.blinkInterval = setInterval(() => {
        this.setState({
          blinking: !this.state.blinking
        })
      }, 800)
    }
  }

  componentWillUnmount() {
    clearInterval(this.blinkInterval)
  }

  pad = (num) => {
    const s = "0000" + num;
    return s.substr(s.length-4);
  }

  jobCanceledHandler = (event) => {
    event.preventDefault()
    this.props.canceled(this.props)
  }

  render() {
    const classList = ['Job', this.props.status]

    if (this.props.status === jobStatus.IN_PROGRESS) {
      clearInterval(this.waitInterval)
    }

    if (this.state.blinking) {
      classList.push('blinking')
    }

    const className = classList.join(' ')

    return (
      <div className={className}>
        <p className="status">{this.props.status}</p>
        <h2>{this.props.name}</h2>
        <h4>File: {this.props.program}</h4>
        <p className="time">{moment(this.props.submissionTime).format('lll')}</p>
        <p>Wait time: {this.state.waitTime} seconds</p>
        <p className="jobNumber">Job: {this.pad(this.props.jobIndex)}</p>
        <button
          className="cancel"
          onClick={e => this.jobCanceledHandler(e)}>Cancel Job</button>
      </div>
    )
  }
}

export default Job
