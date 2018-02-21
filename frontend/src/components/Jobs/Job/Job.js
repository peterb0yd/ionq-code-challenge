import React, { Component } from 'react'
import moment from 'moment'
import { jobStatus } from '../../../config'
import './Job.css'

class Job extends Component {
  interval = null
  state = {
    brightBorder: false
  }

  componentDidMount() {
    if (this.props.status === jobStatus.IN_PROGRESS) {
      this.interval = setInterval(() => {
        this.setState({
          brightBorder: !this.state.brightBorder
        })
      }, 800)
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  pad = (num) => {
    const s = "0000" + num;
    return s.substr(s.length-4);
  }

  jobCanceledHandler = (event) => {
    event.preventDefault()
    this.props.canceled(this.props.id)
  }

  render() {
    let jobNumberHTML = null
    const classList = ['Job']

    if (this.state.brightBorder) {
      classList.push('bright-border')
    }

    switch (this.props.status) {
      case jobStatus.QUEUED:
        classList.push('queued')
        jobNumberHTML = <p className="jobNumber">Job: {this.pad(this.props.jobIndex)}</p>
        break
      case jobStatus.IN_PROGRESS:
        classList.push('in-progress')
        if (this.props.paused) {
          classList.push('paused')
        }
        jobNumberHTML = <p className="jobNumber">Job: {this.pad(this.props.jobIndex)}</p>
        break
      case jobStatus.CANCELED:
        classList.push('canceled')
        break
      case jobStatus.COMPLETED:
        classList.push('completed')
        break
      default:
        break
    }

    const className = classList.join(' ')
    const status = this.props.paused ? 'paused' : this.props.status

    return (
      <div className={className}>
        <p className="status">{status}</p>
        <h2>{this.props.name}</h2>
        <h4>File: {this.props.program}</h4>
        <p className="time">{moment(this.props.submissionTime).format('lll')}</p>
        {jobNumberHTML}
        <button
          className="cancel"
          onClick={e => this.jobCanceledHandler(e)}>Cancel Job</button>
      </div>
    )
  }
}

export default Job
