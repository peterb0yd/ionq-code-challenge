import React, { Component } from 'react'
import FlipMove from 'react-flip-move';
import axios from 'axios'
import './Queue.css'

import Job from '../../components/Jobs/Job/Job'

class Queue extends Component {
  state = {
    jobs: []
  }

  async componentDidMount() {
    this.jobRefreshHandler()
  }

  jobRefreshHandler = async () => {
    const jobs = await axios.get('/jobs')
    if (jobs.data.length > 0) {
      this.setState({ jobs: jobs.data })
    }
  }

  render() {
    let jobs = <h1>The queue is empty! Add a job!</h1>

    if (this.state.jobs.length > 0) {
      jobs = this.state.jobs.map((job, i) => {
        return (
          <Job
            key={i}
            name={job.name}
            program={job.program}
            submissionTime={job.submissionTime} />
        )
      })
    }

    return (
      <div className="Queue">
        <FlipMove duration={750} easing="ease-out" className="job-list">
          {jobs}
        </FlipMove>
        <h2>CREATE NEW JOB</h2>
        <button onClick={this.jobRefreshHandler}>Refresh</button>
      </div>
    )
  }
}

export default Queue
