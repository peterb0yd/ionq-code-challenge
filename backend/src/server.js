const hapi = require('hapi')

const server = new hapi.Server({
  port: 8080,
  host: 'localhost',
  routes: {
    cors: true
  }
})

const jobController = require('./controllers/jobController')

server.route({
    method: 'POST',
    path: '/jobs',
    handler: jobController.create
})

server.route({
    method: 'PATCH',
    path: '/jobs/{id}',
    handler: jobController.update
})

server.route({
    method: 'GET',
    path: '/jobs',
    handler: jobController.index
})

const start = async (err) => {
  try {
    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
  } catch (e) {
    console.error(err)
  }
}

start()
