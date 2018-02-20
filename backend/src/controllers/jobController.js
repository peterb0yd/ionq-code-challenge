const Job = require('../models/job.js')
const boom = require('boom');

module.exports = {

  /** Create Job **/
  // POST /jobs
  async create(req, h) {
    try {
      const { payload } = req
      const job = await Job.create(payload)
      return job.toPublicJSON()
    } catch (e) {
      return boom.badImplementation()
    }
  },

  /** List All Jobs **/
  // GET /users
  async index(req, h) {
    try {
      const jobs = await Job.findAll()
      return jobs
    } catch (e) {
      return boom.badImplementation()
    }
  },

  /** Update Job State **/
  async update(req, h) {
    try {
      const { payload, params } = req
      let job = await Job.find(params.id)
      job = await job.setStatus(payload.status)
      return job.toPublicJSON()
    } catch (e) {
      return boom.badImplementation()
    }
    return {}
  }
}
