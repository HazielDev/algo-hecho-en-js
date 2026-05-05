const pointsRouter = require('./pointsRoutes')
const routesLinesRouter = require('./routesLinesService')
const polygonsRouter = require('./polygonsRoutes')

function routerApi(app) {
  app.use('/points', pointsRouter)
  app.use('/routesLines', routesLinesRouter)
  app.use('/polygons', polygonsRouter)
}

module.exports = routerApi