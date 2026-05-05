const { version } = require('react');
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

const options = {
  swaggerDefinition,
  // Path to files
  apis : ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

module.exports = setupSwagger;