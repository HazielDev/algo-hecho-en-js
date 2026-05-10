const express = require("express")

// Importación de datos y servicio
const data = require("../data/data")
const pointsService = require("../services/pointsService");

const router = express.Router();

// Inicialización del servicio con los datos actuales
const service = new pointsService(data.points);

/**
 * @swagger
 * /points:
 *   get:
 *     tags: [Points]
 *     summary: Get all points
 *     responses:
 *       200:
 *         description: A list of points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the point
 *                   name:
 *                     type: string
 *                     description: The name of the point
 *                   description:
 *                     type: string
 *                     description: The description of the point
 *                   lat:
 *                     type: number
 *                     description: The latitude of the point
 *                   lng:
 *                     type: number
 *                     description: The longitude of the point
 *                   active:
 *                     type: boolean
 *                     description: The active status of the point
 */

/**
 * Ruta para obtener todos los puntos guardados
 */
router.get('/', (req, res) => {
  const points = service.getAll();
  res.status(200).json(points);
})

/**
 * @swagger
 * /points:
 *   post:
 *     tags: [Points]
 *     summary: Create a new point
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the point
 *               description:
 *                 type: string
 *                 description: The description of the point
 *               lat:
 *                 type: number
 *                 description: The latitude of the point
 *               lng:
 *                 type: number
 *                 description: The longitude of the point
 *     responses:
 *       201:
 *         description: Point created successfully
 */
/**
 * Ruta para crear un nuevo punto
 */
router.post('/', (req, res) => {
  const { name, description, lat, lng } = req.body;
  service.create(name, description, lat, lng);
  res.status(201).json({ message: 'Punto creado exitosamente' });
})

/**
 * @swagger
 * /points/{id}:
 *   patch:
 *     tags: [Points]
 *     summary: Update a point
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the point to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the point
 *               description:
 *                 type: string
 *                 description: The description of the point
 *               lat:
 *                 type: number
 *                 description: The latitude of the point
 *               lng:
 *                 type: number
 *                 description: The longitude of the point
 *     responses:
 *       200:
 *         description: Point updated successfully
 *       404:
 *         description: Point not found
 */
/**
 * Ruta para actualizar un punto existente por su ID
 */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, lat, lng } = req.body;
  const point = service.update(id, name, description, lat, lng);
  if (point) {
    res.status(200).json({ message: 'Punto actualizado' });
  } else {
    res.status(404).json({ message: 'Punto no encontrado' });
  }
})

/**
 * @swagger
 * /points/{id}:
 *   delete:
 *     tags: [Points]
 *     summary: Delete a point
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the point to delete
 *     responses:
 *       200:
 *         description: Point deleted successfully
 *       404:
 *         description: Point not found
 */
/**
 * Ruta para eliminar un punto por su ID
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const point = service.delete(id);
  if (point) {
    res.status(200).json({ message: 'Punto eliminado' });
  } else {
    res.status(404).json({ message: 'Punto no encontrado' });
  }
})

module.exports = router;