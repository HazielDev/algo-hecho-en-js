const express = require("express")
const data = require("../data/data")
const routesLinesService = require("../services/routesLinesService");

const router = express.Router();

const service = new routesLinesService(data.routesLines);

router.get('/', (req, res) => {
  const routesLines = service.getAll();
  res.status(200).json(routesLines);
})

router.post('/', (req, res) => {
  const { name, coordinates } = req.body;
  service.create(name, coordinates);
  res.status(201).json({ message: 'Route created' });
})

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