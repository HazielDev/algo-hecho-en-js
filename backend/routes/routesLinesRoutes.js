const express = require("express")
const data = require("../data/data")
const routesLinesService = require("../services/routesLinesService");

const router = express.Router();

// Inicialización del servicio con los datos de líneas de ruta
const service = new routesLinesService(data.routesLines);

/**
 * @swagger
 * /routes_lines:
 *   get:
 *     tags: [Routes Lines]
 *     summary: Get all routes lines
 *     responses:
 *       200:
 *         description: A list of routes lines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the route line
 *                   name:
 *                     type: string
 *                     description: The name of the route line
 *                   coordinates:
 *                     type: array
 *                     description: The coordinates of the route line
 *                     items:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                         lng:
 *                           type: number
 *                   active:
 *                     type: boolean
 *                     description: The active status of the route line
 */
/**
 * Ruta para obtener todas las líneas de ruta
 */
router.get('/', (req, res) => {
  const routesLines = service.getAll();
  res.status(200).json(routesLines);
})


/**
 * @swagger
 * /routes_lines:
 *   post:
 *     tags: [Routes Lines]
 *     summary: Create a new route line
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Route line created successfully
 *       400:
 *         description: Bad Request - Requires at least 2 coordinates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * Ruta para crear una nueva línea de ruta
 * Valida que tenga al menos 2 coordenadas.
 */
router.post('/', (req, res) => {
  const { coordinates } = req.body;

  if (!coordinates || coordinates.length < 2) {
    return res.status(400).json({ 
      message: 'Una ruta requiere al menos 2 coordenadas.' 
    });
  }

  const newRoute = service.create(req.body);
  res.status(201).json(newRoute);
})

/**
 * @swagger
 * /routes_lines/{id}:
 *   patch:
 *     tags: [Routes Lines]
 *     summary: Update a route line
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Route line updated successfully
 *       400:
 *         description: Bad Request - Requires at least 2 coordinates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * Ruta para actualizar una línea de ruta existente por su ID
 * Valida que si se envían coordenadas, sean al menos 2.
 */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { coordinates } = req.body;

  if (coordinates !== undefined && coordinates.length < 2) {
    return res.status(400).json({ 
      message: 'Una ruta requiere al menos 2 coordenadas.' 
    });
  }

  const route = service.update(id, req.body);
  if (route) {
    res.status(200).json(route);
  } else {
    res.status(404).json({ message: 'Ruta no encontrada' });
  }
})

/**
 * @swagger
 * /routes_lines/{id}:
 *   delete:
 *     tags: [Routes Lines]
 *     summary: Delete a route line
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the route line to delete
 *     responses:
 *       200:
 *         description: Route line deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Route line not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * Ruta para eliminar una línea de ruta por su ID
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const route = service.delete(id);
  if (route) {
    res.status(200).json({ message: 'Route line deleted successfully' });
  } else {
    res.status(404).json({ message: 'Route line not found' });
  }
})

module.exports = router;