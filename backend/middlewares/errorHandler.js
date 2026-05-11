/**
 * errorHandler.js: Middlewares para la gestión de errores en Express.
 * Ayudan a capturar excepciones y devolver respuestas coherentes al cliente.
 */

/**
 * Imprime el error en la consola para depuración.
 */
function logErrors(err, req, res, next) {
  console.error('[SERVER ERROR]:', err);
  next(err); // Pasa el error al siguiente middleware
}

/**
 * Construye la respuesta JSON de error para el cliente.
 */
function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack, // Se recomienda ocultar el stack en producción
  });
}

module.exports = { logErrors, errorHandler };