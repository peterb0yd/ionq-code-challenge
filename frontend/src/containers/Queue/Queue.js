import React, { Component } from 'react'
import FlipMove from 'react-flip-move';
import emptyIcon from '../../assets/empty_icon.svg'
import { jobStatus } from '../../config'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import './Queue.css'

import Job from '../../components/Jobs/Job/Job'
import NewJob from '../../components/Jobs/NewJob/NewJob'
import PauseModal from '../../components/PauseModal/PauseModal'

class Queue extends Component {
  currentTask = null
  state = {
    jobs: [],
    showModal: false,
    queueLocked: false,
    currentJob: {
      task: null,
      startTime: null,
      timeLeft: null,
      id: null
    }
  }

  async componentDidMount() {
    await this.fetchJobs()
    this.startQueue()
  }

  startQueue = async () => {
    if (this.state.jobs.length == 0) return
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
      if (!this.currentTask && !this.state.currentJob.id && !this.state.queueLocked) {
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
      console.error(e)
    }
  }

  jobCanceledHandler = async (job) => {
    try {
      const body = { status: jobStatus.CANCELED }
      await axios.patch(`/jobs/${job.id}`, body)
      await this.fetchJobs()
      if (job.status === jobStatus.IN_PROGRESS) {
        clearTimeout(this.currentTask)
        this.currentTask = null
        this.setState({
          currentJob: {
            ...this.state.currentJob,
            timeLeft: null,
            id: null
          }
        }, () => {
          this.startQueue()
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  processJob = (id, processTime = null) => {
    const timeLeft = processTime ? processTime : 500 + Math.random() * 15000
    console.log('starting time left: ', timeLeft)

    this.setState({
      currentJob: {
        ...this.state.currentJob,
        startTime: new Date(),
        timeLeft,
        id
      }}, () => {

      this.currentTask = setTimeout(async () => {
        console.log('finished!')
        clearTimeout(this.state.currentJob.task)
        const body = { status: jobStatus.COMPLETED }
        const job = await axios.patch(`/jobs/${id}`, body)
        await this.fetchJobs()
        this.currentTask = null
        this.startQueue()
        this.setState({
          currentJob: {
            ...this.state.currentJob,
            timeLeft: null,
            id: null
          }
        })
      }, timeLeft)

      if (this.state.queueLocked) {
        this.pauseJob()
      }
    })
  }

  pauseJob = () => {
    if (this.currentTask) {
      clearTimeout(this.currentTask)
      this.currentTask = null
      const pauseTime = new Date()
      const currentJob = {...this.state.currentJob}
      const timeLeft = currentJob.timeLeft - (pauseTime - currentJob.startTime)

      this.setState({
        currentJob: {
          ...currentJob,
          timeLeft
        }
      }, () => {
        console.log('paused with time left: ', timeLeft)
      })
    }
  }

  acceptedPauseHandler = () => {
    this.setState({
      showModal: false,
      queueLocked: true
    })
    this.pauseJob()
  }

  rejectedPauseHandler = () => {
    this.setState({ showModal: false })
  }

  pauseButtonHandler = () => {
    if (this.state.queueLocked) {
      this.setState({ queueLocked: false })
      if (this.state.currentJob.id) {
        const { id, timeLeft } = this.state.currentJob
        this.processJob(id, timeLeft)
      }
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
            paused={this.state.queueLocked}
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
        <NewJob submitted={this.newJobHandler} />
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
