import React, { Component } from 'react'
import FlipMove from 'react-flip-move';
import { jobStatus } from '../../config'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import './Queue.css'

import Job from '../../components/Jobs/Job/Job'
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

  processJob = (id, processTime = null) => {
    const timeLeft = processTime ? processTime : 500 + Math.random() * 15000

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
    let jobsHTML = <h1 className="empty-queue">Please create a new job to run</h1>

    const queueClassList = ['Queue']
    const pauseButtonText = this.state.queueLocked ? 'Resume Queue' : 'Pause Queue'
    const pauseButtonClassName = this.state.queueLocked ? 'pause-queue locked' : 'pause-queue'

    if (this.state.jobs.length > 0) {
      jobsHTML = this.state.jobs.map((job, i) => {
        return (
          <Job
            key={job.id}
            id={job.id}
            name={job.name}
            program={job.program}
            status={job.status}
            submissionTime={job.submissionTime}
            canceled={this.jobCanceledHandler}
            jobIndex={i+1} />
        )
      })
    }

    if (this.state.showModal) {
      queueClassList.push('overlayed')
      queueClassList.push('no-scroll')
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
        <FlipMove
          duration={750}
          easing="ease-out"
          enterAnimation={"fade"}
          className="job-list">{jobsHTML}</FlipMove>
        <div className="overlay"></div>
      </div>
    )
  }
}

export default Queue
