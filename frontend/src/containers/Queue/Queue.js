import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

import { jobStatus } from '../../config'
import './Queue.css'

import Jobs from '../../components/Jobs/Jobs'
import NewJob from '../../components/Jobs/NewJob/NewJob'
import PauseModal from '../../components/PauseModal/PauseModal'

class Queue extends Component {
  state = {
    jobs: [],
    showModal: false,
    queueLocked: false
  }

  async componentDidMount() {
    await this.fetchJobs()
    this.startQueue()
  }

  startQueue = async () => {
    if (this.state.jobs.length === 0) {
      return
    }
    const job = this.state.jobs[0]
    if (job.status === jobStatus.QUEUED) {
      try {
        const body = { status: jobStatus.IN_PROGRESS }
        await axios.patch(`/jobs/${job.id}`, body)
        this.fetchJobs()
      } catch (e) {
        console.error(e)
      }
    }
    this.processJob(job.id)
  }

  newJobHandler = async (data) => {
    try {
      await axios.post('/jobs', data)
      await this.fetchJobs()
      if (this.state.jobs[0].status === jobStatus.QUEUED) {
        this.startQueue()
      }
    } catch (e) {
      console.error(e)
    }
  }

  fetchJobs = async () => {
    try {
      let jobs = await axios.get('/jobs')
      if (jobs.data.length > 0) {
        jobs = _.sortBy(jobs.data, job => {
          return moment(job.submissionTime)
        })
        this.setState({ jobs })
      } else {
        this.setState({ jobs: [] })
      }
    } catch (e) {
      // console.error(e) /** Comment out for testing **/
    }
  }

  jobCanceledHandler = async (job) => {
    try {
      const body = { status: jobStatus.CANCELED }
      await axios.patch(`/jobs/${job.id}`, body)
      await this.fetchJobs()
      if (job.status === jobStatus.IN_PROGRESS) {
        this.startQueue()
      }
    } catch (e) {
      console.error(e)
    }
  }

  processJob = (id) => {
    const timeLeft = 500 + Math.random() * 15000
    setTimeout(async () => {
      const body = { status: jobStatus.COMPLETED }
      await axios.patch(`/jobs/${id}`, body)
      await this.fetchJobs()
      this.startQueue()
    }, timeLeft)
  }

  acceptedPauseHandler = () => {
    this.setState({
      showModal: false,
      queueLocked: true
    })
  }

  rejectedPauseHandler = () => {
    this.setState({ showModal: false })
  }

  pauseButtonHandler = () => {
    if (this.state.queueLocked) {
      this.setState({ queueLocked: false })
    } else {
      this.setState({ showModal: true })
    }
  }

  render() {
    const queueClassList = ['Queue']
    const pauseButtonText = this.state.queueLocked ? 'Resume Queue' : 'Pause Queue'
    const pauseButtonClassName = this.state.queueLocked ? 'pause-queue locked' : 'pause-queue'

    if (this.state.showModal) {
      queueClassList.push('overlayed', 'no-scroll')
    }

    const queueClassName = queueClassList.join(' ')

    return (
      <div className={queueClassName}>
        <NewJob
          submitted={this.newJobHandler}
          queueLocked={this.state.queueLocked}/>
        <button
          className={pauseButtonClassName}
          onClick={this.pauseButtonHandler}>{pauseButtonText}</button>
        <PauseModal
          showModal={this.state.showModal}
          accepted={this.acceptedPauseHandler}
          rejected={this.rejectedPauseHandler} />
        <Jobs
          jobCanceled={this.jobCanceledHandler}
          jobs={this.state.jobs}/>
        <div className="overlay"></div>
      </div>
    )
  }
}

export default Queue
