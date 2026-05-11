/**
 * rutas.js: Orquestador de rutas de la API.
 * Aquí se definen los prefijos de las versiones de la API y se agrupan los recursos.
 */
const pointsRouter = require('./pointsRoutes');
const polygonsRouter = require('./polygonsRoutes');
const routesLinesRouter = require('./routesLinesRoutes');

/**
 * Función que inyecta las rutas en la aplicación Express.
 * @param {Express} app - Instancia del servidor Express
 */
function routerApi(app) {
  app.use('/points', pointsRouter);
  app.use('/polygons', polygonsRouter);
  app.use('/routes_lines', routesLinesRouter);
}

module.exports = routerApi;