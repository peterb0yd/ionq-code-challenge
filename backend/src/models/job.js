const _ = require('lodash')
const moment = require('moment')
const uuid = require('uuid/v1')
const db = require('../../db')
const schema = require('../../db/schema')
const { jobStatus } = require('../config')
const jobFields = schema.job

const Job = class {

  constructor(data) {
    this.data = data;
  }

  // Get Publicly Safe User Attributes
  // @returns {object} user attributes
  toPublicJSON() {
    return getFields(this.data)
  }

  // Update Job Status
  async setStatus(status) {
    if (_.includes(_.values(jobStatus), status)) {
      this.data.status = status
      await this.save()
      return new Job(this.data)
    } else {
      throw new Error()
    }
  }

  // Save User to DB
  async save() {
    const id = this.data.id || uuid().slice(0, 6)
    this.data.id = id
    return await db.put(`job:${id}`, this.data)
  }

  // Find Job by ID
  // @return Job
  static async find(id) {
    const jobData = await db.get(`job:${id}`)
    return new Job(jobData);
  }

  // Find All Jobs
  // @return Jobs as JSON
  static findAll() {
    return new Promise((resolve, reject) => {
      const jobs = []
      const readStream = db.createReadStream()
      readStream.on('data', data => {
        if (_.includes(data.key, 'job') && (data.value.status === jobStatus.QUEUED || data.value.status === jobStatus.IN_PROGRESS))
          jobs.push(getFields(data.value))
      })
      readStream.on('error', err => {
        reject()
      })
      readStream.on('end', () => {
        resolve(jobs)
      })
    })
  }

  // Create Job
  // @returns {object} Job
  static async create(data) {
    const job = new Job(getFields(data))
    job.data.submissionTime = moment()
    job.data.status = 'queued'
    await job.save()
    return job
  }

}

module.exports = Job


// Pick off relevant fields for Job
getFields = (data) => {
  return _.pick(data, ...jobFields)
}
