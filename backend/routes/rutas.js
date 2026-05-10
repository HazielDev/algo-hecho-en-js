/**
 * Router principal de la aplicación.
 * Aquí se definen los puntos de acceso (endpoints) para cada tipo de dato.
 */
const pointsRouter = require('./pointsRoutes')
const routesLinesRouter = require('./routesLinesRoutes')
const polygonsRouter = require('./polygonsRoutes')

function routerApi(app) {
  // Configuración de rutas raíz para cada módulo
  app.use('/points', pointsRouter)
  app.use('/routes-lines', routesLinesRouter)
  app.use('/polygons', polygonsRouter)
}

module.exports = routerApi