const express = require("express");
const data = require("../data/data");
const polygonsService = require("../services/polygonsService");

const router = express.Router();

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
 *                     type: string
 *                     description: The ID of the polygon
 *                   name:
 *                     type: string
 *                     description: The name of the polygon
 *                   coordinates:
 *                     type: array
 *                     description: The coordinates of the polygon
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
 *     responses:
 *       201:
 *         description: Polygon created successfully
 */

router.post('/', (req, res) => {
  const { name, coordinates } = req.body;
  service.create(name, coordinates);
  res.status(201).json({ message: 'Polygon created' });
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
 *     responses:
 *       200:
 *         description: Polygon updated successfully
 */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, coordinates } = req.body;
  const polygon = service.update(id, name, coordinates);
  if (polygon) {
    res.status(200).json({ message: 'Polygon updated' });
  } else {
    res.status(404).json({ message: 'Polygon not found' });
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
 */

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const polygon = service.delete(id);
  if (polygon) {
    res.status(200).json({ message: 'Polygon deleted' });
  } else {
    res.status(404).json({ message: 'Polygon not found' });
  }
})

module.exports = router;