const express = require("express");
const data = require("../data/data");
const polygonsService = require("../services/polygonsService");

const router = express.Router();

// Inicialización del servicio con los datos de polígonos
const service = new polygonsService(data.polygons);

/**
 * @swagger
 * /polygons:
 *   get:
 *     tags: [Polygons]
 *     summary: Get all polygons
 *     responses:
 *       200:
 *         description: A list of polygons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the polygon
 *                   name:
 *                     type: string
 *                     description: The name of the polygon
 *                   coordinates:
 *                     type: array
 *                     description: The coordinates of the polygon
 *                     items:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                         lng:
 *                           type: number
 *                   active:
 *                     type: boolean
 *                     description: The active status of the polygon
 */

/**
 * Ruta para obtener todos los polígonos
 */
router.get('/', (req, res) => {
  const polygons = service.getAll();
  res.status(200).json(polygons);
})

/**
 * @swagger
 * /polygons:
 *   post:
 *     tags: [Polygons]
 *     summary: Create a new polygon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the polygon
 *               coordinates:
 *                 type: array
 *                 description: The coordinates of the polygon
 *                 items:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *             example:
 *               name: "Nuevo Polígono"
 *               coordinates:
 *                 - lat: 21.1211
 *                   lng: -101.6830
 *                 - lat: 21.1212
 *                   lng: -101.6831
 *                 - lat: 21.1213
 *                   lng: -101.6832
 *     responses:
 *       201:
 *         description: Polygon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Not enough coordinates to form a polygon (needs at least 3)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * Ruta para crear un nuevo polígono
 * Valida que tenga al menos 3 coordenadas.
 */
router.post('/', (req, res) => {
  const { name, coordinates } = req.body;

  if (!coordinates || coordinates.length < 3) {
    return res.status(400).json({ 
      message: 'Un polígono requiere al menos 3 coordenadas.' 
    });
  }

  service.create(name, coordinates);
  res.status(201).json({ message: 'Polígono creado exitosamente' });
})

/**
 * @swagger
 * /polygons/{id}:
 *   patch:
 *     tags: [Polygons]
 *     summary: Update a polygon
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the polygon to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the polygon
 *               coordinates:
 *                 type: array
 *                 description: The coordinates of the polygon
 *                 items:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                     lng:
 *                       type: number
 *             example:
 *               name: "Polígono Actualizado"
 *               coordinates:
 *                 - lat: 21.1211
 *                   lng: -101.6830
 *                 - lat: 21.1212
 *                   lng: -101.6831
 *                 - lat: 21.1213
 *                   lng: -101.6832
 *     responses:
 *       200:
 *         description: Polygon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Not enough coordinates to form a polygon (needs at least 3)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Polygon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * Ruta para actualizar un polígono existente por su ID
 * Valida que si se envían coordenadas, sean al menos 3.
 */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, coordinates } = req.body;

  if (coordinates !== undefined && coordinates.length < 3) {
    return res.status(400).json({ 
      message: 'Un polígono requiere al menos 3 coordenadas.' 
    });
  }

  const polygon = service.update(id, name, coordinates);
  if (polygon) {
    res.status(200).json({ message: 'Polígono actualizado' });
  } else {
    res.status(404).json({ message: 'Polígono no encontrado' });
  }
})

/**
 * @swagger
 * /polygons/{id}:
 *   delete:
 *     tags: [Polygons]
 *     summary: Delete a polygon
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the polygon to delete
 *     responses:
 *       200:
 *         description: Polygon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Polygon not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * Ruta para eliminar un polígono por su ID
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const polygon = service.delete(id);
  if (polygon) {
    res.status(200).json({ message: 'Polígono eliminado' });
  } else {
    res.status(404).json({ message: 'Polígono no encontrado' });
  }
})

module.exports = router;