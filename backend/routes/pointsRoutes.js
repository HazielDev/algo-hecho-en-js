/**
 * pointsRoutes.js: Definición de endpoints para el recurso "Points".
 * Utiliza el patrón Router de Express para organizar las peticiones.
 */
const express = require('express');
const PointsService = require('../services/pointsService');
const data = require('../data/data');

const router = express.Router();
const service = new PointsService(data.points);

/**
 * @swagger
 * /points:
 *   get:
 *     tags: [Points]
 *     summary: Obtiene todos los puntos
 *     responses:
 *       200:
 *         description: Lista de puntos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *                   active:
 *                     type: boolean
 *                   category:
 *                     type: string
 */
router.get('/', async (req, res, next) => {
  try {
    const points = await service.find();
    res.json(points);
  } catch (error) {
    next(error); // Delega al middleware de error
  }
});

/**
 * @swagger
 * /points:
 *   post:
 *     tags: [Points]
 *     summary: Crea un nuevo punto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Punto creado exitosamente
 */
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newPoint = await service.create(body);
    res.status(201).json(newPoint);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /points/{id}:
 *   patch:
 *     tags: [Points]
 *     summary: Actualiza un punto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Punto actualizado exitosamente
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const point = await service.update(id, body);
    res.json(point);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /points/{id}:
 *   delete:
 *     tags: [Points]
 *     summary: Elimina un punto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Point deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Point not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const point = await service.delete(id);
    if (point) {
      res.status(200).json({ message: 'Point deleted successfully' });
    } else {
      res.status(404).json({ message: 'Point not found' });
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;