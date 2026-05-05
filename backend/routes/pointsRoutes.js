const express = require("express")

const data = require("../data/data")
const pointsService = require("../services/pointsService");

const router = express.Router();

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
 *                     type: string
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
router.post('/', (req, res) => {
  const { name, description, lat, lng } = req.body;
  service.create(name, description, lat, lng);
  res.status(201).json({ message: 'Point created' });
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
 */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, lat, lng } = req.body;
  const point = service.update(id, name, description, lat, lng);
  if (point) {
    res.status(200).json({ message: 'Point updated' });
  } else {
    res.status(404).json({ message: 'Point not found' });
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
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const point = service.delete(id);
  if (point) {
    res.status(200).json({ message: 'Point deleted' });
  } else {
    res.status(404).json({ message: 'Point not found' });
  }
})

module.exports = router;