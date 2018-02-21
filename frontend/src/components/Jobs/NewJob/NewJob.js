import React, { Component } from 'react'
import './NewJob.css'

class NewJob extends Component {
  state = {
    jobData: {
      name: '',
      program: ''
    }
  }

  nameChangedHandler = (event) => {
    this.setState({
      jobData: {
        name: event.target.value,
        program: this.state.jobData.program
      }
    })
  }

  programChangedHandler = (event) => {
    this.setState({
      jobData: {
        name: this.state.jobData.name,
        program: event.target.value
      }
    })
  }

  submitJobHandler = (event) => {
    event.preventDefault()
    const nameUndefined = (this.state.jobData.name === '')
    const programUndefined = (this.state.jobData.program === '')
    if (nameUndefined || programUndefined) {
      alert('Please finish filling out the form to create a new job')
      return
    }
    this.props.submitted(this.state.jobData)
    this.setState({
      jobData: {
        name: '',
        program: ''
      }
    })
  }

  render() {
    return (
      <div className='NewJob'>
        <h2>Create a New Job</h2>
        <form>
          <div className="form-row">
            <label>Name</label>
            <input
              type="text"
              disabled={this.props.queueLocked}
              placeholder="name of this job..."
              value={this.state.jobData.name}
              onChange={e => this.nameChangedHandler(e)} />
          </div>
          <div className="form-row">
            <label>File</label>
            <input
              type="text"
              disabled={this.props.queueLocked}
              placeholder="name of the program to run..."
              value={this.state.jobData.program}
              onChange={e => this.programChangedHandler(e)} />
          </div>
        </form>
        <input
          type="submit"
          value="Submit Job"
          disabled={this.props.queueLocked}
          onClick={e => this.submitJobHandler(e)} />
      </div>
    )
  }
}

export default NewJob
