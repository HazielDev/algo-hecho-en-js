/**
 * Punto de entrada principal para el servidor Backend (Express).
 * Este archivo configura el servidor, middlewares globales y rutas.
 */
const express = require('express');
const setupSwagger = require('./swagger'); // Configuración de documentación Swagger
const routerApi = require('./routes/rutas'); // Router principal de la API

const { logErrors, errorHandler } = require('./middlewares/errorHandler'); // Manejo de errores

const app = express();
const port = 3000; // Puerto donde correrá la API

/**
 * Middleware para habilitar CORS (Cross-Origin Resource Sharing).
 * Permite que el frontend (Svelte) haga peticiones a este servidor desde otro puerto.
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Permite que Express entienda el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Inicializa las rutas definidas en /routes/rutas.js
routerApi(app);

// Inicializa la UI de Swagger en /api-docs
setupSwagger(app);

// Middlewares para capturar y mostrar errores de forma controlada
app.use(logErrors);
app.use(errorHandler);

// Inicia el servidor
app.listen(port, () => {
  console.log('Servidor corriendo en el puerto: ' + port);
});