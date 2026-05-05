
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Configuración de swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Documentación de la API', // Titulo de la documentacion
    version: '1.0.0', // Version de la API
    description: 'Documentacion de la API con Swagger'
  },
  servers : [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo'
    }
  ]
}

const path = require('path');

const options = {
  swaggerDefinition,
  // Path to files (usando path.join para que funcione sin importar desde dónde se ejecute nodemon)
  apis : [path.join(__dirname, './routes/*.js')]
}

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

module.exports = setupSwagger;