import React from 'react'
import FlipMove from 'react-flip-move';
import './Jobs.css'

import Job from './Job/Job'

const jobs = (props) => {
  let jobsHTML = <h1 className="empty-queue">Please create a new job to run</h1>

  if (props.jobs.length > 0) {
    jobsHTML = props.jobs.map((job, i) => {
      return (
        <Job
          key={job.id}
          id={job.id}
          name={job.name}
          program={job.program}
          status={job.status}
          submissionTime={job.submissionTime}
          canceled={job => props.jobCanceled(job)}
          jobIndex={i+1} />
      )
    })
  }

  return (
    <FlipMove
      duration={750}
      easing="ease-out"
      enterAnimation={"fade"}
      className="Jobs">{jobsHTML}</FlipMove>
  )
}

export default jobs
