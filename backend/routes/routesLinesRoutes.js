const express = require("express")
const data = require("../data/data")
const routesLinesService = require("../services/routesLinesService");

const router = express.Router();

const service = new routesLinesService(data.routesLines);

/**
 * @swagger
 * /routes-lines:
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
 *                     type: string
 *                     description: The ID of the route line
 *                   name:
 *                     type: string
 *                     description: The name of the route line
 *                   coordinates:
 *                     type: array
 *                     description: The coordinates of the route line
 */
router.get('/', (req, res) => {
  const routesLines = service.getAll();
  res.status(200).json(routesLines);
})


/**
 * @swagger
 * /routes-lines:
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
 *                 description: The name of the route line
 *               coordinates:
 *                 type: array
 *                 description: The coordinates of the route line
 *     responses:
 *       201:
 *         description: Route line created successfully
 */
router.post('/', (req, res) => {
  const { name, coordinates } = req.body;
  service.create(name, coordinates);
  res.status(201).json({ message: 'Route created' });
})

/**
 * @swagger
 * /routes-lines/{id}:
 *   patch:
 *     tags: [Routes Lines]
 *     summary: Update a route line
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the route line to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the route line
 *               coordinates:
 *                 type: array
 *                 description: The coordinates of the route line
 *     responses:
 *       200:
 *         description: Route line updated successfully
 */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, coordinates } = req.body;
  const route = service.update(id, name, coordinates);
  if (route) {
    res.status(200).json({ message: 'Route updated' });
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
})

/**
 * @swagger
 * /routes-lines/{id}:
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
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const route = service.delete(id);
  if (route) {
    res.status(200).json({ message: 'Route deleted' });
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
})

module.exports = router;